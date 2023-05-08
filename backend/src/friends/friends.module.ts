import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';

import { Friend } from './entities/friend.entity';
import { Profile } from 'src/user/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, Profile]), ConfigModule],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}