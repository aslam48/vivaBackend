import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CyclePhase } from '../schemas/tip.schema';

export class CreateTipDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  cycleDay?: number;

  @IsOptional()
  @IsEnum(CyclePhase)
  cyclePhase?: CyclePhase;
}

