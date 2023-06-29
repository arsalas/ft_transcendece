import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from './../auth/auth.guard';
import { AchivementService } from './achivement.service';
import { JwtPayload } from 'src/auth/interfaces';

@UseGuards(JwtAuthGuard)
@Controller('achivements')
export class AchivementController {
  constructor(private readonly achivementService: AchivementService) {}

  //   @Post()
  //   create(@Body() createAchivementDto: CreateAchivementDto) {
  //     return this.achivementService.create(createAchivementDto);
  //   }

  @Get()
  findAll(@Request() { user }: { user: JwtPayload }) {
    return this.achivementService.findAll(user.login);
  }
}
