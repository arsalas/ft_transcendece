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
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // @Get()
  // async getMsg(@Request() { user }: { user: JwtPayload }) {
  //   return this.chatService.getAllByUser(user.login);
  // }

  @Post('direct/:username')
  async sendMsg(
    @Request() { user }: { user: JwtPayload },
    @Body() msgDto: CreateMsgDto,
    @Param('username') reciverId: string,
  ) {
    console.log(user, msgDto, reciverId);
    return await this.chatService.findChatOrCreate(reciverId, user.login);
  }
}
