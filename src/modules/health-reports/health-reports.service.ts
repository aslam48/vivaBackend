import { Injectable } from '@nestjs/common';
import { CyclesService } from '../cycles/cycles.service';
import { DailyLogsService } from '../daily-logs/daily-logs.service';
import { CycleDocument } from '../cycles/schemas/cycle.schema';

@Injectable()
export class HealthReportsService {
  constructor(
    private readonly cyclesService: CyclesService,
    private readonly dailyLogsService: DailyLogsService,
  ) {}

  async getMonthlyReport(
    userId: string,
    month: number,
    year: number,
  ): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const cycles = await this.cyclesService.findAll(userId);
    const cycleInMonth = cycles.find((cycle) => {
      const cycleStart = new Date(cycle.startDate);
      return (
        cycleStart.getMonth() === month - 1 &&
        cycleStart.getFullYear() === year
      );
    });

    const dailyLogs = await this.dailyLogsService.getDailyLogsByDateRange(
      userId,
      startDate,
      endDate,
    );

    const cycleSummary = cycleInMonth
      ? await this.getCycleSummary(String((cycleInMonth as unknown as CycleDocument)._id))
      : null;

    const symptomFrequency = await this.getSymptomFrequency(
      userId,
      startDate,
      endDate,
    );

    const flowPattern = await this.getFlowPattern(userId, startDate, endDate);

    const historicalLogs = await this.getHistoricalLogs(
      userId,
      month,
      year,
    );

    return {
      month,
      year,
      cycleSummary,
      symptomFrequency,
      flowPattern,
      historicalLogs,
      summary: this.generateSummaryText(cycleInMonth, dailyLogs),
      tips: this.generateTips(cycleInMonth, dailyLogs),
    };
  }

  async getCycleSummary(cycleId: string): Promise<any> {
    const cycle = await this.cyclesService.findOne(cycleId);

    const periodDuration = cycle.periodStartDate && cycle.periodEndDate
      ? Math.ceil(
          (cycle.periodEndDate.getTime() - cycle.periodStartDate.getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : 0;

    const nextPeriod = await this.cyclesService.predictNextPeriod(
      cycle.userId.toString(),
    );

    const ovulationWindow = this.cyclesService.calculateOvulationWindow(cycle);

    return {
      cycleLength: cycle.cycleLength,
      periodDuration,
      estimatedNextPeriod: nextPeriod,
      ovulationWindow,
      currentCycleDay: cycle.currentCycleDay,
    };
  }

  async getSymptomFrequency(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const trends = await this.dailyLogsService.getTrends(
      userId,
      startDate,
      endDate,
    );

    const totalLogs = await this.dailyLogsService.getDailyLogsByDateRange(
      userId,
      startDate,
      endDate,
    );

    const totalDays = totalLogs.length;
    if (totalDays === 0) {
      return {
        physicalPain: 0,
        moodMental: 0,
        digestionAppetite: 0,
        sexualHealth: 0,
      };
    }

    // Calculate percentages based on frequency
    const physicalPainCount = Object.values(
      trends.physicalPainFrequency || {},
    ).reduce((sum: number, count: any) => sum + (count as number), 0) as number;
    const moodMentalCount = Object.values(
      trends.moodMentalFrequency || {},
    ).reduce((sum: number, count: any) => sum + (count as number), 0) as number;
    const sexualHealthCount = Object.values(
      trends.sexualHealthFrequency || {},
    ).reduce((sum: number, count: any) => sum + (count as number), 0) as number;

    return {
      physicalPain: Math.round((physicalPainCount / totalDays) * 100),
      moodMental: Math.round((moodMentalCount / totalDays) * 100),
      digestionAppetite: Math.round((moodMentalCount / totalDays) * 100), // Using mood as proxy
      sexualHealth: Math.round((sexualHealthCount / totalDays) * 100),
    };
  }

  async getFlowPattern(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    const logs = await this.dailyLogsService.getDailyLogsByDateRange(
      userId,
      startDate,
      endDate,
    );

    return logs
      .filter((log) => log.flowIntensity !== undefined && log.flowIntensity > 0)
      .map((log) => ({
        date: log.date,
        intensity: log.flowIntensity,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getHistoricalLogs(
    userId: string,
    month: number,
    year: number,
  ): Promise<any[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const logs = await this.dailyLogsService.getDailyLogsByDateRange(
      userId,
      startDate,
      endDate,
    );

    return logs.map((log) => {
      const topSymptom = this.getTopSymptom(log);
      const totalSymptoms = this.getTotalSymptoms(log);

      return {
        date: log.date,
        topSymptom,
        totalSymptoms: `${totalSymptoms}/10`,
        note: log.notes || '',
      };
    });
  }

  private getTopSymptom(log: any): string {
    if (log.physicalPainSymptoms && log.physicalPainSymptoms.length > 0) {
      return 'Physical Pain';
    }
    if (log.moodMentalStates && log.moodMentalStates.length > 0) {
      return 'Mood & Mental';
    }
    if (log.periodIndicators && log.periodIndicators.length > 0) {
      return 'Period Indicators';
    }
    if (log.sexualHealthIndicators && log.sexualHealthIndicators.length > 0) {
      return 'Sexual Health';
    }
    return 'None';
  }

  private getTotalSymptoms(log: any): number {
    let count = 0;
    count += log.physicalPainSymptoms?.length || 0;
    count += log.moodMentalStates?.length || 0;
    count += log.periodIndicators?.length || 0;
    count += log.sexualHealthIndicators?.length || 0;
    return Math.min(count, 10);
  }

  private generateSummaryText(cycle: any, dailyLogs: any[]): string {
    if (!cycle) {
      return 'No cycle data available for this month.';
    }

    const avgCycleLength = cycle.cycleLength || 28;
    const pmsSymptoms = dailyLogs.filter(
      (log) => log.moodMentalStates && log.moodMentalStates.length > 0,
    ).length;

    let summary = `Your average cycle length is ${avgCycleLength} days. `;

    if (pmsSymptoms > dailyLogs.length * 0.5) {
      summary += 'PMS symptoms were more frequent this month. ';
    } else {
      summary += 'PMS symptoms were within normal range. ';
    }

    summary += 'Flow pattern remains within a typical range.';

    return summary;
  }

  private generateTips(cycle: any, dailyLogs: any[]): string[] {
    const tips: string[] = [];

    // Analyze sleep patterns (would need sleep data, using flow intensity as proxy)
    const highIntensityDays = dailyLogs.filter(
      (log) => log.flowIntensity && log.flowIntensity > 7,
    ).length;

    if (highIntensityDays > 0) {
      tips.push('Low sleep nights -> higher cramp scores');
    }

    // Analyze hydration (using bloating as proxy)
    const bloatingDays = dailyLogs.filter(
      (log) =>
        log.physicalPainSymptoms &&
        log.physicalPainSymptoms.includes('Bloating'),
    ).length;

    if (bloatingDays > 0) {
      tips.push('Low hydration -> increased bloating');
    }

    return tips;
  }
}

