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

  // send a message
  @Post('send/:username')
  async sendMsg(
    @Request() { user }: { user: JwtPayload },
    @Body() msgDto: CreateMsgDto,
    @Param('username') reciverId: string,
  ) {
    console.log(user, msgDto, reciverId);
    return await this.chatService.sendMsg(
      reciverId,
      user.login,
      msgDto.message,
    );
  }

  // open a direct chat
  @Post('direct/:username')
  async openDirectChat(
    @Request() { user }: { user: JwtPayload },
    @Body() msgDto: CreateMsgDto,
    @Param('username') reciverId: string,
  ) {
    console.log(user, msgDto, reciverId);
    return await this.chatService.openDirectChat(
      reciverId,
      user.login,
      msgDto.message,
    );
  }

  // open a group chat
  @Post('group/:username')
  async openGroupChat(
    @Request() { user }: { user: JwtPayload },
    // @Body() msgDto: CreateMsgDto,
    @Body() nameGroup: string,
    @Param('username') reciverId: string[],
  ) {
    console.log(user, reciverId);
    return await this.chatService.openGroupChat(
      nameGroup,
      reciverId,
      user.login,
      'hola',
      // msgDto.message,
    );
  }

  // add user
  @Post('addUser/:username')
  async addUser(
    @Request() { user }: { user: JwtPayload },
    @Body() chatId: string,
    @Param('username') newUser: string,
  ) {
    return await this.chatService.addUser(newUser, chatId);
  }

  // delete user
  @Post('deleteUser/:username')
  async deleteUser(
    @Request() { user }: { user: JwtPayload },
    @Body() chatId: string,
    @Param('username') deletedUser: string,
  ) {
    return await this.chatService.deleteUser(deletedUser, chatId);
  }

  @Post('direct/:username')
  async mutexUser(
    @Request() { user }: { user: JwtPayload },
    @Param('username') silencedUser: string,
  ) {
    // return await this.chatService.mutexUser(silencedUser);
  }
}
