import { Module } from '@nestjs/common';
import { GithubWebhookController } from './github-webhook.controller';
import { GithubAppModule } from 'src/github/github-app.module';
import { AIModule } from 'src/AI/ai.module';

@Module({
  imports: [GithubAppModule, AIModule],
  controllers: [GithubWebhookController],
})
export class GithubWebhookModule {}
