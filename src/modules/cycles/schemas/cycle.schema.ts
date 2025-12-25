import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CycleDocument = Cycle & Document;

export enum CycleStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Cycle {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  cycleLength: number;

  @Prop()
  periodStartDate?: Date;

  @Prop()
  periodEndDate?: Date;

  @Prop({ type: Number })
  currentCycleDay?: number;

  @Prop({ enum: CycleStatus, default: CycleStatus.ACTIVE })
  status: CycleStatus;
}

export const CycleSchema = SchemaFactory.createForClass(Cycle);

