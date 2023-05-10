import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces';

@UseGuards(JwtAuthGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':gameId')
  getGame(
    @Request() { user }: { user: JwtPayload },
    @Param('gameId') gameId: string,
  ) {
    return this.gameService.getGame(gameId, user.login);
  }

  @Post()
  create(
    @Request() { user }: { user: JwtPayload },
    @Body() createGameDto: CreateGameDto,
  ) {
    return this.gameService.create(createGameDto, user.login);
  }
}
