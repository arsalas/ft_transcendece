import { Module } from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ChatMessage, ChatRoom, ChatUser } from './entities';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { Block } from 'src/friends/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage, ChatRoom, ChatUser, Block]), // chat, message, user
    ConfigModule,
	UserModule
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
