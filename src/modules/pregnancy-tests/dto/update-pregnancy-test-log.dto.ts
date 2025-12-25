import { PartialType } from '@nestjs/mapped-types';
import { CreatePregnancyTestLogDto } from './create-pregnancy-test-log.dto';

export class UpdatePregnancyTestLogDto extends PartialType(
  CreatePregnancyTestLogDto,
) {}

