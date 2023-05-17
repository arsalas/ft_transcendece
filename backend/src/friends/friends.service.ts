import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend, Block } from './entities';
import { AcceptFriendDto, CreateFriendDto } from './dto';
import { Profile } from 'src/user/entities';
import { UnfriendDto } from './dto/unfriend.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  /**
   * Obtiene todos los usuarios
   * @param login
   * @returns
   */
  async getAllByUser(login: string) {
    const friends = await this.friendRepository.find({
      relations: { reciver: true, sender: true },
      select: {
        reciver: {
          avatar: true,
          avatar42: true,
          login: true,
          username: true,
          status: true,
        },
        sender: {
          avatar: true,
          avatar42: true,
          login: true,
          username: true,
          status: true,
        },
        // activedAt: true,
      },
      where: [
        {
          sender: { login },
        },
        {
          reciver: { login },
        },
      ],
    });

    const block = await this.blockRepository.find({
      relations: { user: true, blockUser: true },
      where: {
        user: { login },
      },
    });

    return friends.map((friend) => {
      const isSender = friend.sender.login == login;
      let isBlock: boolean = false;
      if (isSender) {
        if (
          block.findIndex((b) => b.blockUser.login == friend.reciver.login) > -1
        )
          isBlock = true;
      } else {
        if (
          block.findIndex((b) => b.blockUser.login == friend.sender.login) > -1
        )
          isBlock = true;
      }

      const data = {
        activedAt: friend.activedAt,
        isSender,
        profile: friend.reciver.login == login ? friend.sender : friend.reciver,
        isBlock,
      };
      return data;
    });
  }

  /**
   * Busca el registro que indica si dos usuarios son amigos
   * @param userId
   * @param user2Id
   * @returns
   */
  private async findFriends(userId: string, user2Id: string) {
    const friend = await this.friendRepository.findOne({
      where: [
        {
          sender: { login: userId },
          reciver: { login: user2Id },
        },
        {
          sender: { login: user2Id },
          reciver: { login: userId },
        },
      ],
    });

    return friend;
  }

  /**
   * Envia una peticion de amistad a otro usuario
   * @param login
   * @param friendDto
   * @returns
   */
  async sendRequest(login: string, friendDto: CreateFriendDto) {
    const user = await this.profileRepository.findOneBy({
      username: friendDto.reciverId,
    });
    if (!user) throw new NotFoundException('User not found');
    if (await this.findFriends(login, user.login))
      throw new BadRequestException('Users already friends');
    const friend = this.friendRepository.create({
      reciver: { login: user.login },
      sender: { login },
    });
    await this.friendRepository.insert(friend);
    return {
      activedAt: null,
      isSender: true,
      profile: {
        login: user.login,
        username: user.username,
        avatar: user.avatar,
        avatar42: user.avatar42,
        status: user.status,
      },
    };
  }

  /**
   * Acepta una solicitud de amistad de otro usuario
   * @param login
   * @param friendDto
   * @returns
   */
  async acceptRequest(login: string, friendDto: AcceptFriendDto) {
    const friend = await this.friendRepository.findOneBy({
      reciver: { login },
      sender: { login: friendDto.senderId },
    });
    if (!friend) throw new BadRequestException('User not found');
    if (friend.activedAt)
      throw new BadRequestException('Users already friends');
    await this.friendRepository.save({
      ...friend,
      activedAt: new Date(),
    });
    return { msg: `${login} accept friendship with ${friendDto.senderId}` };
  }

  /**
   * Dos usuarios dejan de ser amigos
   * @param login
   * @param friendDto
   * @returns
   */
  async unfriend(login: string, userId: string) {
    const friend = await this.findFriends(login, userId);
    if (!friend) throw new BadRequestException('User not found');
    await this.friendRepository.remove(friend);
    return { msg: `${login} unfriend ${userId}` };
  }

  async blockUser(login: string, userId: string) {
    try {
      const user = this.blockRepository.create({
        user: { login },
        blockUser: { login: userId },
      });
      return await this.blockRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }

  async unblockUser(login: string, userId: string) {
    try {
      console.log({
        user: { login },
        blockUser: { login: userId },
      });
      return await this.blockRepository.delete({
        user: { login },
        blockUser: { login: userId },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Unexpected error');
    }
  }
}
