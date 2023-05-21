import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtPayload } from 'src/auth/interfaces';
import { CreateMsgDto } from './dto/create-msg';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chatAddUser')
export class chatAddUserController {
  constructor(private readonly chatService: ChatService) {}

  // mutex user
  @Post('direct/:username')
  async addUser(
    @Request() { user }: { user: JwtPayload },
    @Param('username') newUser: string,
    @Param('chatGroup') chatId: string,
  ) {
    return await this.chatService.addUser(newUser, chatId);
  }
}
