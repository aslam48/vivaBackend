import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { UpdateTipDto } from './dto/update-tip.dto';
import { CyclePhase } from './schemas/tip.schema';

@Controller('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTipDto: CreateTipDto) {
    return this.tipsService.create(createTipDto);
  }

  @Get()
  findAll() {
    return this.tipsService.findAll();
  }

  @Get('cycle-day/:day')
  getByCycleDay(@Param('day') day: string) {
    return this.tipsService.getTipsByCycleDay(parseInt(day));
  }

  @Get('phase/:phase')
  getByPhase(@Param('phase') phase: CyclePhase) {
    return this.tipsService.getTipsByPhase(phase);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipDto: UpdateTipDto) {
    return this.tipsService.update(id, updateTipDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tipsService.remove(id);
  }
}

