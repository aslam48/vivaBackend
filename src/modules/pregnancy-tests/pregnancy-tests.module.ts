import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PregnancyTestsService } from './pregnancy-tests.service';
import { PregnancyTestsController } from './pregnancy-tests.controller';
import {
  PregnancyTestLog,
  PregnancyTestLogSchema,
} from './schemas/pregnancy-test-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PregnancyTestLog.name, schema: PregnancyTestLogSchema },
    ]),
  ],
  controllers: [PregnancyTestsController],
  providers: [PregnancyTestsService],
  exports: [PregnancyTestsService],
})
export class PregnancyTestsModule {}

