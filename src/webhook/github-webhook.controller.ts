import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';

@Controller('webhook/github')
export class GithubWebhookController {
  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Headers('x-github-event') event: string,
    @Headers('x-github-delivery') deliveryId: string,
    @Body() payload: Record<string, any>,
  ) {
    const action = payload?.action;
    const prNumber = payload?.pull_request?.number;
    const diffUrl = payload?.pull_request?.diff_url as string | undefined;
    const actionDate = payload?.pull_request?.updated_at || payload?.repository?.pushed_at;
    const githubToken = process.env.GITHUB_TOKEN;
    const prAuthor = payload?.pull_request?.user?.login;
    const repositoryId = payload?.repository?.id;
    const repositoryName = payload?.repository?.full_name;
    let diff: string | null = null;
    let diffError: string | null = null;

    if (event === 'pull_request' && diffUrl) {
      try {
        const response = await fetch(diffUrl, {
          headers: {
            Accept: 'application/vnd.github.v3.diff',
            ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
          },
        });

        if (!response.ok) {
          diffError = `GitHub diff request failed with status ${response.status}`;
        } else {
          diff = await response.text();
        }
      } catch (error) {
        diffError =
          error instanceof Error ? error.message : 'Unknown error fetching diff';
      }
    }

    console.log('[GitHub Webhook]', {
      event,
      repositoryId,
      repositoryName,
      deliveryId,
      action,
      actionDate,
      prNumber,
      prAuthor,
      diffLength: diff?.length ?? 0,
      diffPreview: diff?.slice(0, 300),
      diffError,
    });

    return {
      received: true,
      event,
      repositoryId,
      repositoryName,
      deliveryId,
      action,
      actionDate,
      prNumber,
      prAuthor,
      diffLength: diff?.length ?? 0,
      diffPreview: diff?.slice(0, 300),
      diffError,
    };
  }
}
