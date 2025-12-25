import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DailyLogDocument = DailyLog & Document;

@Schema({ timestamps: true })
export class DailyLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop()
  cycleDay?: number;

  @Prop({ type: [String], default: [] })
  physicalPainSymptoms: string[];

  @Prop({ type: [String], default: [] })
  moodMentalStates: string[];

  @Prop({ type: Number, min: 0, max: 10 })
  flowIntensity?: number;

  @Prop({ type: [String], default: [] })
  periodIndicators: string[];

  @Prop({ type: [String], default: [] })
  sexualHealthIndicators: string[];

  @Prop()
  notes?: string;
}

export const DailyLogSchema = SchemaFactory.createForClass(DailyLog);

