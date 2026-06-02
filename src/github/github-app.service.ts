import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface InstallationToken {
  token: string;
  expiresAt: Date;
}

export type AutoRegisterEligibility =
  | { allowed: true; via: 'org_member' | 'org_membership' | 'repo_access' }
  | { allowed: false; reason: string };

type GithubApiHeaders = {
  Authorization: string;
  Accept: string;
  'X-GitHub-Api-Version': string;
};

@Injectable()
export class GithubAppService {
  private readonly logger = new Logger(GithubAppService.name);
  private cachedToken: InstallationToken | null = null;

  private getPrivateKey(): string {
    const raw = (process.env.GITHUB_APP_PRIVATE_KEY ?? '')
      .replace(/\\n/g, '\n')
      .trim();

    if (raw.includes('-----BEGIN')) {
      return raw;
    }

    return `-----BEGIN RSA PRIVATE KEY-----\n${raw}\n-----END RSA PRIVATE KEY-----`;
  }

  private generateAppJwt(): string {
    const appId = process.env.GITHUB_APP_ID;
    if (!appId) throw new Error('GITHUB_APP_ID não está definida no .env');

    const privateKey = this.getPrivateKey();
    const now = Math.floor(Date.now() / 1000);

    return jwt.sign({ iat: now - 60, exp: now + 540, iss: appId }, privateKey, {
      algorithm: 'RS256',
    });
  }

  async getInstallationToken(): Promise<string> {
    const now = new Date();
    if (this.cachedToken && this.cachedToken.expiresAt > now) {
      return this.cachedToken.token;
    }

    const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
    if (!installationId) {
      throw new Error('GITHUB_APP_INSTALLATION_ID não está definida no .env');
    }

    const appJwt = this.generateAppJwt();

    const response = await fetch(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${appJwt}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Falha ao obter installation token: ${response.status} ${text}`,
      );
    }

    const data = (await response.json()) as {
      token: string;
      expires_at: string;
    };

    const expiresAt = new Date(
      new Date(data.expires_at).getTime() - 10 * 60 * 1000,
    );

    this.cachedToken = { token: data.token, expiresAt };
    this.logger.log('Installation token renovado com sucesso');

    return data.token;
  }

  async postPRComment(
    owner: string,
    repo: string,
    prNumber: number,
    body: string,
  ): Promise<void> {
    const token = await this.getInstallationToken();

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      },
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Falha ao postar comentário no PR: ${response.status} ${text}`,
      );
    }

    this.logger.log(`Comentário postado em ${owner}/${repo}#${prNumber}`);
  }

  private githubApiHeaders(token: string): GithubApiHeaders {
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async checkAutoRegisterEligibility(
    org: string,
    username: string,
    hasRepoAccess: boolean,
  ): Promise<AutoRegisterEligibility> {
    try {
      const token = await this.getInstallationToken();
      const headers = this.githubApiHeaders(token);

      const memberResponse = await fetch(
        `https://api.github.com/orgs/${org}/members/${username}`,
        { headers },
      );

      if (memberResponse.status === 204) {
        return { allowed: true, via: 'org_member' };
      }

      const membershipResponse = await fetch(
        `https://api.github.com/orgs/${org}/memberships/${username}`,
        { headers },
      );

      if (membershipResponse.ok) {
        const membership = (await membershipResponse.json()) as {
          state?: string;
        };
        if (membership.state === 'active' || membership.state === 'pending') {
          return { allowed: true, via: 'org_membership' };
        }
      }

      if (hasRepoAccess) {
        const memberStatus = memberResponse.status;
        const membershipStatus = membershipResponse.status;
        const lacksMembersPermission =
          memberStatus === 403 ||
          membershipStatus === 403 ||
          (memberStatus === 404 && membershipStatus === 404);

        if (lacksMembersPermission) {
          this.logger.warn(
            `[Auto-registro] GitHub App sem permissão members:read — não foi possível confirmar membership de "${username}" em "${org}" (members: HTTP ${memberStatus}, memberships: HTTP ${membershipStatus}). Auto-registro permitido pois o app já tem acesso ao repositório.`,
          );
          return { allowed: true, via: 'repo_access' };
        }
      }

      const reasonByStatus: Record<number, string> = {
        404: `usuário "${username}" não é membro da org "${org}" (HTTP 404 em members e memberships). Se ele for membro no GitHub, adicione a permissão "Organization members: Read-only" (members:read) na GitHub App e reinstale-a na org`,
        403: `GitHub App sem permissão para verificar membros da org "${org}" (requer members:read)`,
        401: `token de instalação inválido ou expirado ao verificar membro da org "${org}"`,
      };

      const status = memberResponse.status;
      return {
        allowed: false,
        reason:
          reasonByStatus[status] ??
          `verificação de membro retornou HTTP ${status} (memberships: HTTP ${membershipResponse.status})`,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        allowed: false,
        reason: `erro ao chamar API do GitHub (${org}/${username}): ${message}`,
      };
    }
  }
}
