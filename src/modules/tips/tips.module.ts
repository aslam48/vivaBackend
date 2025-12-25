import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TipsService } from './tips.service';
import { TipsController } from './tips.controller';
import { Tip, TipSchema } from './schemas/tip.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tip.name, schema: TipSchema }])],
  controllers: [TipsController],
  providers: [TipsService],
  exports: [TipsService],
})
export class TipsModule {}

