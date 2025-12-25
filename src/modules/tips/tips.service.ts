import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tip, TipDocument, CyclePhase } from './schemas/tip.schema';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';

@Injectable()
export class TipsService {
  constructor(@InjectModel(Tip.name) private tipModel: Model<TipDocument>) {}

  async create(createTipDto: CreateTipDto): Promise<Tip> {
    const createdTip = new this.tipModel(createTipDto);
    return createdTip.save();
  }

  async findAll(): Promise<Tip[]> {
    return this.tipModel.find().exec();
  }

  async findOne(id: string): Promise<Tip> {
    const tip = await this.tipModel.findById(id).exec();
    if (!tip) {
      throw new NotFoundException(`Tip with ID ${id} not found`);
    }
    return tip;
  }

  async getTipsByCycleDay(cycleDay: number): Promise<Tip[]> {
    return this.tipModel.find({ cycleDay }).exec();
  }

  async getTipsByPhase(phase: CyclePhase): Promise<Tip[]> {
    return this.tipModel.find({ cyclePhase: phase }).exec();
  }

  async update(id: string, updateTipDto: UpdateTipDto): Promise<Tip> {
    const updatedTip = await this.tipModel
      .findByIdAndUpdate(id, updateTipDto, { new: true })
      .exec();
    if (!updatedTip) {
      throw new NotFoundException(`Tip with ID ${id} not found`);
    }
    return updatedTip;
  }

  async remove(id: string): Promise<void> {
    const result = await this.tipModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Tip with ID ${id} not found`);
    }
  }
}

