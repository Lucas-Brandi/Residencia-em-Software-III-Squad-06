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
import { Public } from 'src/auth/decorators/public.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { AIService } from 'src/AI/ai.service';
import { GithubAppService } from 'src/github/github-app.service';

@ApiTags('webhook')
@Public()
@Controller('webhook/github')
export class GithubWebhookController {
  private readonly logger = new Logger(GithubWebhookController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AIService,
    private readonly githubAppService: GithubAppService,
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
    @Req() req: Request,
  ) {
    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    if (webhookSecret) {
      const hmac = crypto
        .createHmac('sha256', webhookSecret)
        .update((req as any).rawBody ?? Buffer.alloc(0))
        .digest('hex');
      const expected = `sha256=${hmac}`;
      if (
        !signature ||
        !crypto.timingSafeEqual(
          Buffer.from(expected),
          Buffer.from(signature),
        )
      ) {
        throw new UnauthorizedException('Assinatura de webhook inválida');
      }
    }

    if (event !== 'pull_request') {
      return { received: true };
    }

    const action = payload?.action as string | undefined;
    if (action !== 'opened' && action !== 'synchronize' && action !== 'reopened') {
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
        this.logger.warn(
          `Falha ao buscar diff: ${diffResponse.status}`,
        );
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

    const repository = await this.prisma.repository.findUnique({
      where: { githubId: repositoryGithubId },
    });

    if (!repository) {
      this.logger.warn(
        `Repositório com githubId ${repositoryGithubId} não encontrado no banco`,
      );
      return { received: true };
    }

    const rules = await this.prisma.analysisRule.findMany({
      where: { repositoryId: repository.id },
    });

    if (!rules.length) {
      this.logger.log(
        `Nenhuma regra cadastrada para "${repository.name}" — análise focada em segurança`,
      );
    }

    const ruleContents = rules.map((r) => r.content);
    const aiResult = await this.aiService.analyzeCode(diff, ruleContents);

    const score = aiResult.healthScore;
    const scoreEmoji = score >= 80 ? '✅' : score >= 50 ? '⚠️' : '❌';
    const commentBody = [
      '## DiffyAI - Analysis Result',
      '',
      `${scoreEmoji} **Health Score: ${score}/100**`,
      '',
      aiResult.feedback,
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

    return { received: true, analysed: true, healthScore: score };
  }
}
