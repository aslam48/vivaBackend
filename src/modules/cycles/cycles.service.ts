import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cycle, CycleDocument, CycleStatus } from './schemas/cycle.schema';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';

@Injectable()
export class CyclesService {
  constructor(
    @InjectModel(Cycle.name) private cycleModel: Model<CycleDocument>,
  ) {}

  async create(createCycleDto: CreateCycleDto): Promise<Cycle> {
    const cycleLength = createCycleDto.cycleLength || 28;
    const createdCycle = new this.cycleModel({
      ...createCycleDto,
      userId: new Types.ObjectId(createCycleDto.userId),
      cycleLength,
      status: CycleStatus.ACTIVE,
    });

    // Calculate current cycle day if period start date is provided
    if (createCycleDto.periodStartDate) {
      createdCycle.currentCycleDay = this.calculateCycleDay(
        createCycleDto.periodStartDate,
        new Date(),
      );
    }

    return createdCycle.save();
  }

  async findAll(userId?: string): Promise<Cycle[]> {
    const query = userId ? { userId: new Types.ObjectId(userId) } : {};
    return this.cycleModel.find(query).sort({ startDate: -1 }).exec();
  }

  async findOne(id: string): Promise<Cycle> {
    const cycle = await this.cycleModel.findById(id).exec();
    if (!cycle) {
      throw new NotFoundException(`Cycle with ID ${id} not found`);
    }
    return cycle;
  }

  async getCurrentCycle(userId: string): Promise<Cycle | null> {
    return this.cycleModel
      .findOne({
        userId: new Types.ObjectId(userId),
        status: CycleStatus.ACTIVE,
      })
      .sort({ startDate: -1 })
      .exec();
  }

  async update(id: string, updateCycleDto: UpdateCycleDto): Promise<Cycle> {
    const updateData: any = { ...updateCycleDto };
    
    if (updateCycleDto.userId) {
      updateData.userId = new Types.ObjectId(updateCycleDto.userId);
    }

    // Recalculate cycle day if period start date is updated
    if (updateCycleDto.periodStartDate) {
      const cycle = await this.cycleModel.findById(id).exec();
      if (cycle) {
        updateData.currentCycleDay = this.calculateCycleDay(
          updateCycleDto.periodStartDate,
          new Date(),
        );
      }
    }

    const updatedCycle = await this.cycleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedCycle) {
      throw new NotFoundException(`Cycle with ID ${id} not found`);
    }
    return updatedCycle;
  }

  async remove(id: string): Promise<void> {
    const result = await this.cycleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Cycle with ID ${id} not found`);
    }
  }

  calculateCycleDay(periodStartDate: Date, currentDate: Date): number {
    const diffTime = currentDate.getTime() - periodStartDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  }

  async predictNextPeriod(userId: string): Promise<Date | null> {
    const cycles = await this.findAll(userId);
    if (cycles.length === 0) {
      return null;
    }

    const completedCycles = cycles.filter(
      (c) => c.status === CycleStatus.COMPLETED && c.cycleLength,
    );

    if (completedCycles.length === 0) {
      // Use default or last cycle length
      const lastCycle = cycles[0];
      const avgLength = lastCycle.cycleLength || 28;
      const lastPeriodStart = lastCycle.periodStartDate || lastCycle.startDate;
      return this.addDays(lastPeriodStart, avgLength);
    }

    // Calculate average cycle length
    const totalLength = completedCycles.reduce(
      (sum, cycle) => sum + cycle.cycleLength,
      0,
    );
    const avgLength = Math.round(totalLength / completedCycles.length);

    // Get the most recent period start date
    const lastCycle = cycles.find((c) => c.periodStartDate) || cycles[0];
    const lastPeriodStart = lastCycle.periodStartDate || lastCycle.startDate;

    return this.addDays(lastPeriodStart, avgLength);
  }

  calculateFertileWindow(cycle: Cycle): { start: Date; end: Date } | null {
    if (!cycle.periodStartDate) {
      return null;
    }

    // Fertile window is typically days 8-19 of the cycle
    const fertileStart = this.addDays(cycle.periodStartDate, 7);
    const fertileEnd = this.addDays(cycle.periodStartDate, 18);

    return {
      start: fertileStart,
      end: fertileEnd,
    };
  }

  calculateOvulationWindow(cycle: Cycle): { start: Date; end: Date } | null {
    if (!cycle.periodStartDate) {
      return null;
    }

    // Ovulation window is typically days 13-15 of the cycle
    const ovulationStart = this.addDays(cycle.periodStartDate, 12);
    const ovulationEnd = this.addDays(cycle.periodStartDate, 14);

    return {
      start: ovulationStart,
      end: ovulationEnd,
    };
  }

  async getCalendarData(
    userId: string,
    month: number,
    year: number,
  ): Promise<any> {
    const cycles = await this.findAll(userId);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const calendarData = {
      month,
      year,
      highlightedDates: [] as any[],
    };

    cycles.forEach((cycle) => {
      if (cycle.periodStartDate && cycle.periodEndDate) {
        const periodStart = new Date(cycle.periodStartDate);
        const periodEnd = new Date(cycle.periodEndDate);

        // Check if period overlaps with the requested month
        if (
          (periodStart >= startDate && periodStart <= endDate) ||
          (periodEnd >= startDate && periodEnd <= endDate) ||
          (periodStart <= startDate && periodEnd >= endDate)
        ) {
          const currentDate = new Date(periodStart);
          while (currentDate <= periodEnd && currentDate <= endDate) {
            if (currentDate >= startDate) {
              calendarData.highlightedDates.push({
                date: new Date(currentDate),
                type: 'period',
              });
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }

        // Add fertile window highlights
        const fertileWindow = this.calculateFertileWindow(cycle);
        if (fertileWindow) {
          const fertileStart = new Date(fertileWindow.start);
          const fertileEnd = new Date(fertileWindow.end);
          if (
            (fertileStart >= startDate && fertileStart <= endDate) ||
            (fertileEnd >= startDate && fertileEnd <= endDate)
          ) {
            const currentDate = new Date(fertileStart);
            while (currentDate <= fertileEnd && currentDate <= endDate) {
              if (currentDate >= startDate) {
                calendarData.highlightedDates.push({
                  date: new Date(currentDate),
                  type: 'fertile',
                });
              }
              currentDate.setDate(currentDate.getDate() + 1);
            }
          }
        }
      }
    });

    return calendarData;
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

