import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  profilePicture?: string;

  @Prop({ default: 28 })
  averageCycleLength: number;

  @Prop({ type: Object, default: {} })
  settings?: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

