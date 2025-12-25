import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActivityLogDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  activityName: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

