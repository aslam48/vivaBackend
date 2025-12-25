import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TipDocument = Tip & Document;

export enum CyclePhase {
  MENSTRUAL = 'menstrual',
  FOLLICULAR = 'follicular',
  OVULATION = 'ovulation',
  LUTEAL = 'luteal',
}

@Schema({ timestamps: true })
export class Tip {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  category?: string;

  @Prop()
  cycleDay?: number;

  @Prop({ enum: CyclePhase })
  cyclePhase?: CyclePhase;
}

export const TipSchema = SchemaFactory.createForClass(Tip);

