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
import { DailyLogsService } from './daily-logs.service';
import { CreateDailyLogDto } from './dto/create-daily-log.dto';
import { UpdateDailyLogDto } from './dto/update-daily-log.dto';

@Controller('daily-logs')
export class DailyLogsController {
  constructor(private readonly dailyLogsService: DailyLogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDailyLogDto: CreateDailyLogDto) {
    return this.dailyLogsService.create(createDailyLogDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.dailyLogsService.findAll(userId);
  }

  @Get('date-range')
  getByDateRange(
    @Query('userId') userId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    if (!userId || !startDate || !endDate) {
      throw new Error(
        'userId, startDate, and endDate query parameters are required',
      );
    }
    return this.dailyLogsService.getDailyLogsByDateRange(
      userId,
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('trends')
  getTrends(
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (!userId) {
      throw new Error('userId query parameter is required');
    }
    return this.dailyLogsService.getTrends(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('most-frequent')
  getMostFrequent(
    @Query('userId') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    if (!userId) {
      throw new Error('userId query parameter is required');
    }
    return this.dailyLogsService.getMostFrequentSymptom(
      userId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dailyLogsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDailyLogDto: UpdateDailyLogDto) {
    return this.dailyLogsService.update(id, updateDailyLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.dailyLogsService.remove(id);
  }
}

