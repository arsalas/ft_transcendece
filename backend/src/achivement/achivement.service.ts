import { Injectable } from '@nestjs/common';
import { GameService } from 'src/game/game.service';

@Injectable()
export class AchivementService {
  constructor(
    private gameService: GameService,
  ) {}

  async findAll(userId: string) {
    const stadistics = await this.gameService.getStadisticsByUser(userId);
    const achivements = {
      wins: stadistics.victories,
      played: stadistics.defeats + stadistics.victories,
    };
    return achivements;
  }
}
