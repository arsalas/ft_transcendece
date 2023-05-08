import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { AcceptFriendDto, CreateFriendDto } from './dto';
import { Profile } from 'src/user/entities';
import { UnfriendDto } from './dto/unfriend.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
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

    return friends.map((friend) => ({
      activedAt: friend.activedAt,
      isSender: friend.sender.login == login,
      profile: friend.reciver.login == login ? friend.sender : friend.reciver,
    }));
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
}
