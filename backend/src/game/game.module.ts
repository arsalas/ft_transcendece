import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { Game, GameUser } from './entities';
import { UserModule } from 'src/user/user.module';
import { Profile } from 'src/user/entities';

@Module({
  providers: [GameService, GameGateway],
  imports: [TypeOrmModule.forFeature([Game, GameUser, Profile]), ConfigModule],
  controllers: [GameController],
  exports: [GameService, TypeOrmModule],
})
export class GameModule {}
