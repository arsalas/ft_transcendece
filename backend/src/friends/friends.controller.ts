import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { JwtPayload } from 'src/auth/interfaces';
import { AcceptFriendDto, CreateFriendDto } from './dto';
import { UnfriendDto } from './dto/unfriend.dto';


@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async getFriends(@Request() { user }: { user: JwtPayload }) {
	return this.friendsService.getAllByUser(user.login);
  }

  @Post()
  async sendRequest(
    @Request() { user }: { user: JwtPayload },
    @Body() friendDto: CreateFriendDto,
  ) {
    return await this.friendsService.sendRequest(user.login, friendDto);
  }

  @Patch()
  async acceptRequest(
    @Request() { user }: { user: JwtPayload },
    @Body() friendDto: AcceptFriendDto,
  ) {
    return await this.friendsService.acceptRequest(user.login, friendDto);
  }

  @Delete(':userId')
  async unfriend(
    @Request() { user }: { user: JwtPayload },
	@Param('userId') userId: string
  ) {
    return await this.friendsService.unfriend(user.login, userId);
  }
}
