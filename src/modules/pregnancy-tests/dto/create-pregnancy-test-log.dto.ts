import { IsDate, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PregnancyTestResult } from '../schemas/pregnancy-test-log.schema';

export class CreatePregnancyTestLogDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsEnum(PregnancyTestResult)
  result: PregnancyTestResult;
}

