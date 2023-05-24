import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from 'src/game/game.module';
import { Game, GameUser } from 'src/game/entities';
import { GameService } from 'src/game/game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    ConfigModule,
    GameModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
