import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PregnancyTestLog,
  PregnancyTestLogDocument,
} from './schemas/pregnancy-test-log.schema';
import { CreatePregnancyTestLogDto } from './dto/create-pregnancy-test-log.dto';
import { UpdatePregnancyTestLogDto } from './dto/update-pregnancy-test-log.dto';

@Injectable()
export class PregnancyTestsService {
  constructor(
    @InjectModel(PregnancyTestLog.name)
    private pregnancyTestLogModel: Model<PregnancyTestLogDocument>,
  ) {}

  async create(
    createPregnancyTestLogDto: CreatePregnancyTestLogDto,
  ): Promise<PregnancyTestLog> {
    const createdTest = new this.pregnancyTestLogModel({
      ...createPregnancyTestLogDto,
      userId: new Types.ObjectId(createPregnancyTestLogDto.userId),
    });
    return createdTest.save();
  }

  async findAll(userId?: string): Promise<PregnancyTestLog[]> {
    const query = userId ? { userId: new Types.ObjectId(userId) } : {};
    return this.pregnancyTestLogModel.find(query).sort({ date: -1 }).exec();
  }

  async findOne(id: string): Promise<PregnancyTestLog> {
    const test = await this.pregnancyTestLogModel.findById(id).exec();
    if (!test) {
      throw new NotFoundException(`Pregnancy test log with ID ${id} not found`);
    }
    return test;
  }

  async update(
    id: string,
    updatePregnancyTestLogDto: UpdatePregnancyTestLogDto,
  ): Promise<PregnancyTestLog> {
    const updateData: any = { ...updatePregnancyTestLogDto };
    if (updatePregnancyTestLogDto.userId) {
      updateData.userId = new Types.ObjectId(updatePregnancyTestLogDto.userId);
    }

    const updatedTest = await this.pregnancyTestLogModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedTest) {
      throw new NotFoundException(`Pregnancy test log with ID ${id} not found`);
    }
    return updatedTest;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pregnancyTestLogModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(`Pregnancy test log with ID ${id} not found`);
    }
  }
}

