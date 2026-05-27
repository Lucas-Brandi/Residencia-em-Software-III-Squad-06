import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { AnalysisRulesModule } from './analysis-rules/analysis-rules.module';
import { TeamsModule } from './teams/teams.module';
import { PullRequestsModule } from './pull-requests/pull-requests.module';
import { AnalysisResultsModule } from './analysis-results/analysis-results.module';
import { AIModule } from './AI/ai.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { GithubWebhookModule } from './webhook/github-webhook.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    AIModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    RepositoriesModule,
    AnalysisRulesModule,
    TeamsModule,
    PullRequestsModule,
    AnalysisResultsModule,
    DashboardModule,
    GithubWebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
