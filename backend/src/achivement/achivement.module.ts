import { Module } from '@nestjs/common';
import { AchivementService } from './achivement.service';
import { AchivementController } from './achivement.controller';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [
    ConfigModule,
	GameModule
  ],

  controllers: [AchivementController],
  providers: [AchivementService],
})
export class AchivementModule {}
