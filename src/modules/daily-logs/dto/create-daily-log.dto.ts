import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDailyLogDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsOptional()
  @IsNumber()
  cycleDay?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  physicalPainSymptoms?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  moodMentalStates?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  flowIntensity?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  periodIndicators?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sexualHealthIndicators?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

