import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCycleDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  periodStartDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  periodEndDate?: Date;

  @IsOptional()
  @IsNumber()
  cycleLength?: number;
}

