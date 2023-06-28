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
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtPayload } from 'src/auth/interfaces';
import { CreateMsgDto } from './dto/create-msg';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ModifyUserDto } from './dto/modify-user.dto';
import { AddUserDto } from './dto/add-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('chatrooms/')
  async getChatRooms(
	@Request() { user }: { user: JwtPayload },
  ) {
	return await this.chatService.getChatRooms(user.login);
  }

  @Get('chatroom/:id')
  async getChatRoom(
	@Request() { user }: { user: JwtPayload },
	@Param('id') reciverId: string,
  ) {
	return await this.chatService.getChatRoom(user.login, reciverId);
  }

  @Get('friends/')
  async getAllFriendMessages(
	@Request() { user }: { user: JwtPayload },
  ) {
	return await this.chatService.getFriendsMessages(user.login);
  }
  
  @Get('direct/:id')
  async openDirectChat(
	@Request() { user }: { user: JwtPayload },
	@Param('id') reciverId:string,
  ) {
	return await this.chatService.openDirectChat(user.login, reciverId);
  }

  @Post('group/')
  async createGroupChat(
	@Request() { user }: { user: JwtPayload },
	@Body() groupDto: CreateChatDto,
  ) {
	return await this.chatService.createGroupChat(user.login, groupDto);
  }

  @Patch('group/')
  async updateGroupChat(
	@Request() { user }: { user: JwtPayload },
	@Body() groupDto: UpdateChatDto,
  ) {
	return await this.chatService.updateGroupChat(user.login, groupDto);
  }

  @Post('add/')
  async addUser(
	@Request() { user }: { user: JwtPayload },
	@Body() addUserDto: AddUserDto
  ) {
	return await this.chatService.addUser(user.login, addUserDto);
  }

  @Post('ban/')
  async banUser(
	@Request() { user }: { user: JwtPayload },
	@Body() modifyUserDto: ModifyUserDto,
  ) {
	return await this.chatService.banUser(user.login, modifyUserDto);
  }

  @Post('mute/')
  async mutexUser(
	@Request() { user }: { user: JwtPayload },
	@Body() modifyUserDto: ModifyUserDto,
  ) {
	return await this.chatService.muteUser(user.login, modifyUserDto);
  }

  @Post('admin/')
  async makeAdmin(
	@Request() { user }: { user: JwtPayload },
	@Body() modifyUserDto: ModifyUserDto,
  ) {
	return await this.chatService.makeAdmin(user.login, modifyUserDto);
  }
}
