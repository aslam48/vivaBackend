import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityLogDocument = ActivityLog & Document;

@Schema({ timestamps: true })
export class ActivityLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  activityName: string;

  @Prop()
  duration?: number;

  @Prop()
  notes?: string;
}

export const ActivityLogSchema = SchemaFactory.createForClass(ActivityLog);

