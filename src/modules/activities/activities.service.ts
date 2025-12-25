import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ActivityLog,
  ActivityLogDocument,
} from './schemas/activity-log.schema';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async create(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLog> {
    const createdActivity = new this.activityLogModel({
      ...createActivityLogDto,
      userId: new Types.ObjectId(createActivityLogDto.userId),
    });
    return createdActivity.save();
  }

  async findAll(userId?: string): Promise<ActivityLog[]> {
    const query = userId ? { userId: new Types.ObjectId(userId) } : {};
    return this.activityLogModel.find(query).sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<ActivityLog> {
    const activity = await this.activityLogModel.findById(id).exec();
    if (!activity) {
      throw new NotFoundException(`Activity log with ID ${id} not found`);
    }
    return activity;
  }

  async update(
    id: string,
    updateActivityLogDto: UpdateActivityLogDto,
  ): Promise<ActivityLog> {
    const updateData: any = { ...updateActivityLogDto };
    if (updateActivityLogDto.userId) {
      updateData.userId = new Types.ObjectId(updateActivityLogDto.userId);
    }

    const updatedActivity = await this.activityLogModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedActivity) {
      throw new NotFoundException(`Activity log with ID ${id} not found`);
    }
    return updatedActivity;
  }

  async remove(id: string): Promise<void> {
    const result = await this.activityLogModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Activity log with ID ${id} not found`);
    }
  }
}

