import * as crypto from 'crypto';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}
import { Public } from 'src/auth/decorators/public.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { AIService } from 'src/AI/ai.service';
import { GithubAppService } from 'src/github/github-app.service';
import { RulesService } from 'src/rules/rules.service';

@ApiTags('webhook')
@Public()
@Controller('webhook/github')
export class GithubWebhookController {
  private readonly logger = new Logger(GithubWebhookController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AIService,
    private readonly githubAppService: GithubAppService,
    private readonly rulesService: RulesService,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Receber webhook do GitHub' })
  @ApiHeader({
    name: 'x-hub-signature-256',
    description: 'Assinatura HMAC-SHA256 do payload (obrigatória)',
    required: true,
  })
  @ApiHeader({
    name: 'x-github-event',
    description: 'Tipo do evento GitHub (ex.: pull_request)',
    required: false,
  })
  @ApiHeader({
    name: 'x-github-delivery',
    description: 'ID único da entrega do webhook',
    required: false,
  })
  @ApiBody({
    description: 'Payload JSON enviado pelo GitHub',
    schema: { type: 'object', additionalProperties: true },
  })
  @ApiResponse({ status: 200, description: 'Webhook processado com sucesso' })
  @ApiResponse({ status: 401, description: 'Assinatura de webhook inválida' })
  async handleWebhook(
    @Headers('x-hub-signature-256') signature: string,
    @Headers('x-github-event') event: string,
    @Headers('x-github-delivery') deliveryId: string,
    @Body() payload: Record<string, any>,
    @Req() req: RawBodyRequest,
  ) {
    // ─── Validação de assinatura ──────────────────────────────────────────────
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new UnauthorizedException(
        'GITHUB_WEBHOOK_SECRET não configurado no servidor',
      );
    }
    const rawBody: Buffer = req.rawBody ?? Buffer.alloc(0);
    const hmac = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');
    const expected = `sha256=${hmac}`;
    if (
      !signature ||
      !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
    ) {
      throw new UnauthorizedException('Assinatura de webhook inválida');
    }

    if (event !== 'pull_request') {
      return { received: true };
    }

    const action = payload?.action as string | undefined;
    if (
      action !== 'opened' &&
      action !== 'synchronize' &&
      action !== 'reopened'
    ) {
      return { received: true };
    }

    const prNumber = payload?.pull_request?.number as number;
    const owner = payload?.repository?.owner?.login as string | undefined;
    const repo = payload?.repository?.name as string | undefined;
    const repositoryGithubId = payload?.repository?.id as number | undefined;

    this.logger.log(
      `[Webhook] PR #${prNumber} (${action}) em ${owner}/${repo} (githubId: ${repositoryGithubId})`,
    );

    if (!owner || !repo || !repositoryGithubId || !prNumber) {
      this.logger.warn('Payload incompleto — campos obrigatórios ausentes');
      return { received: true };
    }

    // ─── Busca diff do PR ─────────────────────────────────────────────────────
    let diff = '';
    try {
      const installationToken =
        await this.githubAppService.getInstallationToken();
      const diffResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.diff',
            Authorization: `Bearer ${installationToken}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );

      if (diffResponse.ok) {
        diff = await diffResponse.text();
      } else {
        this.logger.warn(`Falha ao buscar diff: ${diffResponse.status}`);
      }
    } catch (err) {
      this.logger.error('Erro ao buscar diff do PR', err);
    }

    if (!diff) {
      this.logger.warn(
        `Diff indisponível para PR #${prNumber} — análise ignorada`,
      );
      return { received: true };
    }

    // ─── Busca o repositório no banco ─────────────────────────────────────────
    let repository = await this.prisma.repository.findUnique({
      where: { githubId: repositoryGithubId },
    });

    if (!repository) {
      const prAuthorLogin = payload?.pull_request?.user?.login as
        | string
        | undefined;
      const orgLogin =
        (payload?.organization?.login as string | undefined) ?? owner;

      if (!orgLogin) {
        this.logger.warn(
          `[Auto-registro] Repositório githubId ${repositoryGithubId} (${owner}/${repo}) não cadastrado: org ausente no payload (organization.login e repository.owner.login indefinidos)`,
        );
        return { received: true };
      }

      if (!prAuthorLogin) {
        this.logger.warn(
          `[Auto-registro] Repositório githubId ${repositoryGithubId} (${owner}/${repo}) não cadastrado: login do autor do PR ausente no payload`,
        );
        return { received: true };
      }

      const eligibility =
        await this.githubAppService.checkAutoRegisterEligibility(
          orgLogin,
          prAuthorLogin,
          true,
        );

      if (!eligibility.allowed) {
        this.logger.warn(
          `[Auto-registro] Repositório githubId ${repositoryGithubId} (${owner}/${repo}) não cadastrado: ${eligibility.reason}. Cadastre via POST /repositories ou adicione "${prAuthorLogin}" à org "${orgLogin}".`,
        );
        return { received: true };
      }

      try {
        repository = await this.prisma.repository.create({
          data: {
            name: repo,
            githubId: repositoryGithubId,
            githubUrl: (payload?.repository?.html_url as string) ?? null,
            isAutoRegistered: true,
          },
        });
        const viaLabel: Record<typeof eligibility.via, string> = {
          org_member: 'membro confirmado via API /members',
          org_membership: 'membro confirmado via API /memberships',
          repo_access:
            'app com acesso ao repositório (members:read indisponível)',
        };
        this.logger.log(
          `Repositório "${repo}" auto-registrado (githubId: ${repositoryGithubId}) — ${viaLabel[eligibility.via]}`,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(
          `[Auto-registro] Repositório githubId ${repositoryGithubId} (${owner}/${repo}) não persistido no banco: ${message}`,
        );
        return { received: true };
      }
    }

    // ─── Busca regras vinculadas ──────────────────────────────────────────────
    const rules = await this.rulesService.findActiveByRepository(repository.id);

    if (!rules.length) {
      this.logger.log(
        `Nenhuma regra cadastrada para "${repository.name}" — análise focada em segurança`,
      );
    }

    // ─── Análise da IA ────────────────────────────────────────────────────────
    const aiResult = await this.aiService.analyzeCode(diff, rules);
    const score = aiResult.healthScore;

    // ─── Posta comentário no PR ───────────────────────────────────────────────
    const scoreEmoji = score >= 80 ? '✅' : score >= 50 ? '⚠️' : '❌';
    const findingsSummary =
      aiResult.findings.length > 0
        ? [
            '',
            '### Findings',
            ...aiResult.findings.map(
              (f) =>
                `- **[${f.severity}]** ${f.description}${f.filePath ? ` \`${f.filePath}${f.lineNumber ? `:${f.lineNumber}` : ''}\`` : ''}`,
            ),
          ].join('\n')
        : '';

    const commentBody = [
      '## DiffyAI - Analysis Result',
      '',
      `${scoreEmoji} **Health Score: ${score}/100**`,
      '',
      aiResult.feedback,
      findingsSummary,
      '',
      '---',
      '*Analysis generated automatically by the DiffyAI Bot*',
    ].join('\n');

    try {
      await this.githubAppService.postPRComment(
        owner,
        repo,
        prNumber,
        commentBody,
      );
      this.logger.log(
        `Comentário de análise postado no PR #${prNumber} de ${owner}/${repo}`,
      );
    } catch (err) {
      this.logger.error('Erro ao postar comentário no PR', err);
    }

    // ─── Persiste o resultado no banco ────────────────────────────────────────
    try {
      // Tenta encontrar o autor do PR por GitHub username
      const prAuthorLogin = payload?.pull_request?.user?.login as
        | string
        | undefined;
      let authorId: number | null = null;

      if (prAuthorLogin) {
        const author = await this.prisma.user.findFirst({
          where: { githubUsername: prAuthorLogin },
        });
        if (author) {
          authorId = author.id;
        }
      }

      // Upsert do PullRequest (em caso de synchronize, atualiza)
      const pullRequest = await this.prisma.pullRequest.upsert({
        where: {
          repositoryId_prNumber: {
            repositoryId: repository.id,
            prNumber,
          },
        },
        create: {
          repositoryId: repository.id,
          prNumber,
          authorId,
          title: (payload?.pull_request?.title as string) || null,
          githubUrl: (payload?.pull_request?.html_url as string) || null,
          status: 'aberto',
        },
        update: {
          title: (payload?.pull_request?.title as string) || undefined,
          status: 'aberto',
        },
      });

      // Cria o AnalysisResult
      const analysisResult = await this.prisma.analysisResult.create({
        data: {
          prId: pullRequest.id,
          healthScore: score,
          iaFeedback: aiResult.feedback,
          status: 'pendente',
        },
      });

      // Persiste os findings individuais da IA
      if (aiResult.findings.length > 0) {
        const ruleIdByTitle = new Map(
          rules.map((rule) => [rule.title, rule.id]),
        );

        await this.prisma.finding.createMany({
          data: aiResult.findings.map((finding) => ({
            analysisResultId: analysisResult.id,
            severity: finding.severity,
            description: finding.description,
            filePath: finding.filePath ?? null,
            lineNumber: finding.lineNumber ?? null,
            ruleId: finding.ruleName
              ? (ruleIdByTitle.get(finding.ruleName) ?? null)
              : null,
          })),
        });

        this.logger.log(
          `${aiResult.findings.length} finding(s) salvos para PR #${prNumber}`,
        );
      }

      this.logger.log(
        `PR #${prNumber} persistido no banco (pullRequestId: ${pullRequest.id}, analysisResultId: ${analysisResult.id})`,
      );

      return {
        received: true,
        analysed: true,
        healthScore: score,
        findingsCount: aiResult.findings.length,
        pullRequestId: pullRequest.id,
        analysisResultId: analysisResult.id,
      };
    } catch (err) {
      // Loga o erro mas não falha o webhook — o comentário já foi postado
      this.logger.error('Erro ao persistir resultado da análise no banco', err);
      return { received: true, analysed: true, healthScore: score };
    }
  }
}
