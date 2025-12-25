import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CyclesService } from './cycles.service';
import { CyclesController } from './cycles.controller';
import { Cycle, CycleSchema } from './schemas/cycle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cycle.name, schema: CycleSchema }]),
  ],
  controllers: [CyclesController],
  providers: [CyclesService],
  exports: [CyclesService],
})
export class CyclesModule {}

