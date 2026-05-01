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

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    RepositoriesModule,
    AnalysisRulesModule,
    TeamsModule,
    PullRequestsModule,
    AnalysisResultsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
