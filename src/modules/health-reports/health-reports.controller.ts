import { Controller, Get, Query } from '@nestjs/common';
import { HealthReportsService } from './health-reports.service';

@Controller('health-reports')
export class HealthReportsController {
  constructor(
    private readonly healthReportsService: HealthReportsService,
  ) {}

  @Get('monthly')
  getMonthlyReport(
    @Query('userId') userId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    if (!userId || !month || !year) {
      throw new Error('userId, month, and year query parameters are required');
    }
    return this.healthReportsService.getMonthlyReport(
      userId,
      parseInt(month),
      parseInt(year),
    );
  }

  @Get('cycle/:cycleId')
  getCycleReport(@Query('cycleId') cycleId: string) {
    if (!cycleId) {
      throw new Error('cycleId query parameter is required');
    }
    return this.healthReportsService.getCycleSummary(cycleId);
  }

  @Get('symptoms')
  getSymptomFrequency(
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!userId || !startDate || !endDate) {
      throw new Error(
        'userId, startDate, and endDate query parameters are required',
      );
    }
    return this.healthReportsService.getSymptomFrequency(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('flow-pattern')
  getFlowPattern(
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!userId || !startDate || !endDate) {
      throw new Error(
        'userId, startDate, and endDate query parameters are required',
      );
    }
    return this.healthReportsService.getFlowPattern(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }
}

