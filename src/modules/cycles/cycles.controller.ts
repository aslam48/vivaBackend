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
import { CyclesService } from './cycles.service';
import { CreateCycleDto } from './dto/create-cycle.dto';
import { UpdateCycleDto } from './dto/update-cycle.dto';

@Controller('cycles')
export class CyclesController {
  constructor(private readonly cyclesService: CyclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCycleDto: CreateCycleDto) {
    return this.cyclesService.create(createCycleDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.cyclesService.findAll(userId);
  }

  @Get('current')
  getCurrentCycle(@Query('userId') userId: string) {
    if (!userId) {
      throw new Error('userId query parameter is required');
    }
    return this.cyclesService.getCurrentCycle(userId);
  }

  @Get('calendar')
  getCalendarData(
    @Query('userId') userId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    if (!userId || !month || !year) {
      throw new Error('userId, month, and year query parameters are required');
    }
    return this.cyclesService.getCalendarData(
      userId,
      parseInt(month),
      parseInt(year),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cyclesService.findOne(id);
  }

  @Get(':id/predictions')
  getPredictions(@Param('id') id: string) {
    return this.cyclesService.findOne(id).then((cycle) => {
      const fertileWindow = this.cyclesService.calculateFertileWindow(cycle);
      const ovulationWindow = this.cyclesService.calculateOvulationWindow(cycle);
      return {
        fertileWindow,
        ovulationWindow,
      };
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCycleDto: UpdateCycleDto) {
    return this.cyclesService.update(id, updateCycleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.cyclesService.remove(id);
  }
}

