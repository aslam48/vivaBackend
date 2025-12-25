import { Module } from '@nestjs/common';
import { HealthReportsService } from './health-reports.service';
import { HealthReportsController } from './health-reports.controller';
import { CyclesModule } from '../cycles/cycles.module';
import { DailyLogsModule } from '../daily-logs/daily-logs.module';

@Module({
  imports: [CyclesModule, DailyLogsModule],
  controllers: [HealthReportsController],
  providers: [HealthReportsService],
  exports: [HealthReportsService],
})
export class HealthReportsModule {}

