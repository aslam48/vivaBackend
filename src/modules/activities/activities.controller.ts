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
import { ActivitiesService } from './activities.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { UpdateActivityLogDto } from './dto/update-activity-log.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createActivityLogDto: CreateActivityLogDto) {
    return this.activitiesService.create(createActivityLogDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.activitiesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActivityLogDto: UpdateActivityLogDto,
  ) {
    return this.activitiesService.update(id, updateActivityLogDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}

