import { PartialType } from '@nestjs/mapped-types';
import { CreateCycleDto } from './create-cycle.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { CycleStatus } from '../schemas/cycle.schema';

export class UpdateCycleDto extends PartialType(CreateCycleDto) {
  @IsOptional()
  @IsEnum(CycleStatus)
  status?: CycleStatus;
}

