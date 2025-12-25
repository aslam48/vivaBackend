import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DailyLog, DailyLogDocument } from './schemas/daily-log.schema';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';

@Injectable()
export class DailyLogsService {
  constructor(
    @InjectModel(DailyLog.name) private dailyLogModel: Model<DailyLogDocument>,
  ) {}

  async create(createDailyLogDto: CreateDailyLogDto): Promise<DailyLog> {
    const createdLog = new this.dailyLogModel({
      ...createDailyLogDto,
      userId: new Types.ObjectId(createDailyLogDto.userId),
    });
    return createdLog.save();
  }

  async findAll(userId?: string): Promise<DailyLog[]> {
    const query = userId ? { userId: new Types.ObjectId(userId) } : {};
    return this.dailyLogModel.find(query).sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<DailyLog> {
    const log = await this.dailyLogModel.findById(id).exec();
    if (!log) {
      throw new NotFoundException(`Daily log with ID ${id} not found`);
    }
    return log;
  }

  async getDailyLogsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<DailyLog[]> {
    return this.dailyLogModel
      .find({
        userId: new Types.ObjectId(userId),
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ date: 1 })
      .exec();
  }

  async update(
    id: string,
    updateDailyLogDto: UpdateDailyLogDto,
  ): Promise<DailyLog> {
    const updateData: any = { ...updateDailyLogDto };
    if (updateDailyLogDto.userId) {
      updateData.userId = new Types.ObjectId(updateDailyLogDto.userId);
    }

    const updatedLog = await this.dailyLogModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedLog) {
      throw new NotFoundException(`Daily log with ID ${id} not found`);
    }
    return updatedLog;
  }

  async remove(id: string): Promise<void> {
    const result = await this.dailyLogModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Daily log with ID ${id} not found`);
    }
  }

  async getTrends(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<any> {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const logs = await this.dailyLogModel.find(query).exec();

    // Calculate symptom frequency by category
    const physicalPainCount = new Map<string, number>();
    const moodMentalCount = new Map<string, number>();
    const periodIndicatorCount = new Map<string, number>();
    const sexualHealthCount = new Map<string, number>();

    logs.forEach((log) => {
      log.physicalPainSymptoms?.forEach((symptom) => {
        physicalPainCount.set(
          symptom,
          (physicalPainCount.get(symptom) || 0) + 1,
        );
      });

      log.moodMentalStates?.forEach((mood) => {
        moodMentalCount.set(mood, (moodMentalCount.get(mood) || 0) + 1);
      });

      log.periodIndicators?.forEach((indicator) => {
        periodIndicatorCount.set(
          indicator,
          (periodIndicatorCount.get(indicator) || 0) + 1,
        );
      });

      log.sexualHealthIndicators?.forEach((indicator) => {
        sexualHealthCount.set(
          indicator,
          (sexualHealthCount.get(indicator) || 0) + 1,
        );
      });
    });

    // Find most frequent symptoms
    const mostFrequentPhysicalPain = this.getMostFrequent(physicalPainCount);
    const mostFrequentMood = this.getMostFrequent(moodMentalCount);

    // Calculate symptom intensity change (comparing first half vs second half of period)
    const sortedLogs = logs.sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    const midpoint = Math.floor(sortedLogs.length / 2);
    const firstHalf = sortedLogs.slice(0, midpoint);
    const secondHalf = sortedLogs.slice(midpoint);

    const firstHalfAvgIntensity = this.calculateAverageIntensity(firstHalf);
    const secondHalfAvgIntensity = this.calculateAverageIntensity(secondHalf);

    let intensityChange = 'stable';
    const diff = secondHalfAvgIntensity - firstHalfAvgIntensity;
    if (diff > 1) {
      intensityChange = 'increasing';
    } else if (diff < -1) {
      intensityChange = 'decreasing';
    }

    return {
      mostFrequentSymptom: mostFrequentPhysicalPain || mostFrequentMood,
      symptomIntensityChange: intensityChange,
      physicalPainFrequency: Object.fromEntries(physicalPainCount),
      moodMentalFrequency: Object.fromEntries(moodMentalCount),
      periodIndicatorFrequency: Object.fromEntries(periodIndicatorCount),
      sexualHealthFrequency: Object.fromEntries(sexualHealthCount),
    };
  }

  async getMostFrequentSymptom(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<string | null> {
    const trends = await this.getTrends(userId, startDate, endDate);
    return trends.mostFrequentSymptom || null;
  }

  private getMostFrequent(map: Map<string, number>): string | null {
    if (map.size === 0) return null;

    let maxCount = 0;
    let mostFrequent = '';

    map.forEach((count, item) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequent = item;
      }
    });

    return mostFrequent;
  }

  private calculateAverageIntensity(logs: DailyLog[]): number {
    if (logs.length === 0) return 0;

    const intensities = logs
      .map((log) => log.flowIntensity || 0)
      .filter((intensity) => intensity > 0);

    if (intensities.length === 0) return 0;

    const sum = intensities.reduce((acc, val) => acc + val, 0);
    return sum / intensities.length;
  }
}

