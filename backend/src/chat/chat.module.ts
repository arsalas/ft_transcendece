import { Module } from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ChatMessage, ChatRoom, ChatUser } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage, ChatRoom, ChatUser]), // chat, message, user
    ConfigModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}