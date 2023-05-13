import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { Game, GameUser } from './entities';

@Module({
  providers: [GameService, GameGateway],
  imports: [TypeOrmModule.forFeature([Game, GameUser]), ConfigModule],
  controllers: [GameController],
  exports: [GameService, TypeOrmModule],
})
export class GameModule {}
