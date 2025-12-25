import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PregnancyTestsService } from './pregnancy-tests.service';
import { CreatePregnancyTestLogDto } from './dto/create-pregnancy-test-log.dto';
import { UpdatePregnancyTestLogDto } from './dto/update-pregnancy-test-log.dto';

@Controller('pregnancy-tests')
export class PregnancyTestsController {
  constructor(
    private readonly pregnancyTestsService: PregnancyTestsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPregnancyTestLogDto: CreatePregnancyTestLogDto) {
    return this.pregnancyTestsService.create(createPregnancyTestLogDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.pregnancyTestsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pregnancyTestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePregnancyTestLogDto: UpdatePregnancyTestLogDto,
  ) {
    return this.pregnancyTestsService.update(id, updatePregnancyTestLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.pregnancyTestsService.remove(id);
  }
}

