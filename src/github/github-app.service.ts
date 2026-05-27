import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface InstallationToken {
  token: string;
  expiresAt: Date;
}

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

    return jwt.sign(
      { iat: now - 60, exp: now + 540, iss: appId },
      privateKey,
      { algorithm: 'RS256' },
    );
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
}
