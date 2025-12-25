import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  category?: string;

  @Prop({ default: Date.now })
  publishedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

