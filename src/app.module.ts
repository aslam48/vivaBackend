import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { UsersModule } from './modules/users/users.module';
import { CyclesModule } from './modules/cycles/cycles.module';
import { DailyLogsModule } from './modules/daily-logs/daily-logs.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { PregnancyTestsModule } from './modules/pregnancy-tests/pregnancy-tests.module';
import { TipsModule } from './modules/tips/tips.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { HealthReportsModule } from './modules/health-reports/health-reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    CyclesModule,
    DailyLogsModule,
    ActivitiesModule,
    PregnancyTestsModule,
    TipsModule,
    ArticlesModule,
    HealthReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

