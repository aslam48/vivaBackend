import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PregnancyTestLogDocument = PregnancyTestLog & Document;

export enum PregnancyTestResult {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  FAINT_LINE = 'faint_line',
  NOT_TAKEN = 'not_taken',
}

@Schema({ timestamps: true })
export class PregnancyTestLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({
    enum: PregnancyTestResult,
    required: true,
  })
  result: PregnancyTestResult;
}

export const PregnancyTestLogSchema =
  SchemaFactory.createForClass(PregnancyTestLog);

