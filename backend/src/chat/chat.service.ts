import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatMessage, ChatRoom, ChatUser } from './entities';
import { JwtPayload } from 'src/auth/interfaces';
import { Profile, User } from 'src/user/entities';
import { ModifyUserDto } from './dto/modify-user.dto';
import { AddUserDto } from './dto/add-user.dto';
import { Socket } from 'socket.io';
import * as bcryptjs from 'bcryptjs';
import { ChatGateway } from './chat.gateway';
import { CreateMsgDto } from './dto/create-msg';
import { GetChatDto } from './dto/get-chat.dto';
import { Block } from 'src/friends/entities';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    userId: string;
  };
}

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => ChatGateway))
    private readonly gameGateway: ChatGateway,
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Block)
	private blockRepository: Repository<Block>,
    @InjectRepository(Profile)

    private readonly dataSource: DataSource,
  ) {}

  private readonly LIMIT_MESSAGE = 50;

  // store the message
  async storeMessage(userId: string, msg: CreateMsgDto) {
    const newMsg = this.chatMessageRepository.create({
      message: msg.message,
      isRead: false,
      userId: { login: userId },
      chatRoomId: { id: msg.chatId },
    });
    return await this.chatMessageRepository.save(newMsg);
  }

  // no existe el chat directo
  async createSaveChat(senderLogin: string, reciverId: string) {
    const newChat = this.chatRoomRepository.create({
      name: `${senderLogin}-${reciverId}`,
      type: 'direct',
    });
    console.log({ newChat });
    const room = await this.chatRoomRepository.save(newChat);
    console.log({ room });

    const user1 = this.chatUserRepository.create({
      chatRoom: room,
      user: { login: senderLogin },
      isAdmin: false,
      isOwner: false,
    });
    const user2 = this.chatUserRepository.create({
      chatRoom: room,
      user: { login: reciverId },
      isAdmin: false,
      isOwner: false,
    });
    await this.chatUserRepository.save([user1, user2]);
    return newChat;
  }

  async getMessages(userId: string, chatId: string) {
    try {
      const user = await this.chatUserRepository.findOne({
        where: {
          user: { login: userId },
          chatRoom: { id: chatId },
        },
        relations: ['chatRoom'],
      });

      if (!user) {
        throw new UnauthorizedException();
      }

      if (user.isBanned) throw new UnauthorizedException();

      const msgs = await this.chatMessageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.userId', 'user')
        .where('message.chatRoomId = :chatId', { chatId })
        .orderBy('message.createdAt', 'DESC')
        .take(this.LIMIT_MESSAGE)
        .getMany();

      const reverseMsg = msgs.reverse();
      return reverseMsg.map((val) => ({
        userId: val.userId.login,
        message: val.message,
        createdAt: val.createdAt,
        isRead: val.isRead,
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async getChatRooms(userId: string) {
    try {
      const chats = await this.chatRoomRepository.find({
        where: {
          type: In(['public', 'private', 'protected']),
        },
      });

      return chats
        .filter(async (c) => {
          if (c.type === 'private') {
            const user = await this.chatUserRepository.findOneBy({
              user: { login: userId },
              chatRoom: { id: c.id },
            });
            if (!user) return false;
          }
          return true;
        })
        .map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
        }));
    } catch {}
  }

  async getChatRoom(userId: string, getChatDto: GetChatDto) {
    try {
      const room = await this.chatRoomRepository.findOneBy({
        id: getChatDto.chatId,
      });

      if (!room) {
        throw new NotFoundException();
      }

      const user = await this.chatUserRepository.findOneBy({
        user: { login: userId },
        chatRoom: { id: getChatDto.chatId },
      });

	  console.log(getChatDto.password, room.password);
      if (!user) {
        if (
          room.type === 'protected' &&
          !this.matchPass(getChatDto.password, room.password)
        )
          throw new UnauthorizedException();
        const chatUser = this.chatUserRepository.create({
          user: { login: userId },
          isAdmin: false,
          isOwner: false,
          chatRoom: room,
        });
        await this.chatUserRepository.save(chatUser);
      }

      const manager = this.dataSource.manager;
      const result = await manager.query(
        `
	 update "chat_message"
	 set "isRead" = true
	 where "chatRoomIdId" = $1 and "userIdLogin" != $2
	  `,
        [getChatDto.chatId, userId],
      );

      return {
        id: room.id,
        name: room.name,
        type: room.type,
        messages: await this.getMessages(userId, getChatDto.chatId),
        users: await this.getUsersFromRoom(getChatDto.chatId),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getUsersFromRoom(chatId: string) {
    try {
      const room = await this.chatRoomRepository.findOneBy({ id: chatId });
      if (!room || room.type === 'direct') {
        return [];
      }
      const users = await this.chatUserRepository.find({
        where: {
          chatRoom: { id: chatId },
        },
        relations: ['user'],
      });

      if (!users) throw new InternalServerErrorException();

      const usersInChat = [];
      for (let u of users) {
        const profile = await this.profileRepository.findOneBy({
          login: u.user.login,
        });

        usersInChat.push({
          ...profile,
          isAdmin: u.isAdmin,
          isOwner: u.isOwner,
        });
      }
      return usersInChat;
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getFriendsMessages(userId: string) {
    try {
      //   const chats = await this.chatUserRepository
      //     .createQueryBuilder('chat')
      //     .where(
      //       'chat.userId.login = :userId and chat.chatRoom.type = "direct"',
      //       { userId },
      //     )
      //     .leftJoinAndSelect('message.userId', 'user')
      //     .getMany();

      const manager = this.dataSource.manager;
      const result = await manager.query(
        `
		select t2."userIdLogin" as userId, count(t2."userIdLogin") from 
		(
		select chat_room.id, chat_user."userLogin"
		from chat_room 
		inner join chat_user 
		on chat_room.id = chat_user."chatRoomId"
		where chat_room.type = 'direct' and chat_user."userLogin" !=  $1
		) as t1
		right join chat_message t2
		on t1.id = t2."chatRoomIdId" 
		where t2."isRead" = false  and t2."userIdLogin" !=  $2
		group by t2."userIdLogin"
`,
        [userId, userId],
      );

      return result.map((r: { count: string; userid: string }) => ({
        count: Number(r.count),
        userId: r.userid,
      }));
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async openDirectChat(senderLogin: string, reciverId: string) {
    try {
      const chat = await this.chatUserRepository.findOne({
        where: [
          {
            chatRoom: { name: senderLogin + '-' + reciverId },
          },
          {
            chatRoom: { name: reciverId + '-' + senderLogin },
          },
        ],
        relations: ['chatRoom'],
      });
      if (!chat) {
        console.log('El chat NO existe');
        return await this.createSaveChat(senderLogin, reciverId);
      }

      return await this.getChatRoom(senderLogin, {
        chatId: chat.chatRoom.id,
        password: '',
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createGroupChat(userId: string, groupDto: CreateChatDto) {
    try {
      if (groupDto.type === 'protected' && !groupDto.password)
        throw Error('MISSSING PASSWORD');
      const newChat = this.chatRoomRepository.create({
        name: groupDto.name,
        type: groupDto.type,
        password: groupDto.password
          ? this.encryptPass(groupDto.password)
          : null,
      });
      const room = await this.chatRoomRepository.save(newChat);

      const user = this.chatUserRepository.create({
        chatRoom: room,
        user: { login: userId },
        isAdmin: true,
        isOwner: true,
      });
      await this.chatUserRepository.save(user);
      return {
        id: room.id,
        name: newChat.name,
        type: newChat.type,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async updateGroupChat(userId: string, groupDto: UpdateChatDto) {
    try {
      const user = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: userId },
            chatRoom: { name: groupDto.id },
          },
        ],
      });
      if (!user || !user.isOwner) {
        throw new UnauthorizedException();
      }

      const group = await this.chatRoomRepository.findOneBy({
        name: groupDto.name,
      });
      if (!group) {
        console.log('NO EXISTE EL CHAT');
        return [];
      }

      if (groupDto.type && groupDto.type === 'protected' && !groupDto.password)
        throw Error('MISSSING PASSWORD');

      const pass = groupDto.password
        ? this.encryptPass(groupDto.password)
        : null;
      await this.chatRoomRepository.update(group, {
        ...groupDto,
        password: pass,
      });
      return {
        id: groupDto.id,
        name: groupDto.name,
        type: groupDto.type,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async addUser(userId: string, addUserDto: AddUserDto) {
    try {
      const user = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: userId },
            chatRoom: { id: addUserDto.chatId },
          },
        ],
      });

      if (!user || !user.isAdmin) throw new UnauthorizedException();

      const userProfile = await this.profileRepository.findOneBy({
        username: addUserDto.userId,
      });

      if (!userProfile) throw new NotFoundException();

      const addUser = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: userProfile.login },
            chatRoom: { id: addUserDto.chatId },
          },
        ],
      });

      if (addUser) throw new BadRequestException();

      const newUser = this.chatUserRepository.create({
        chatRoom: { id: addUserDto.chatId },
        user: { login: userProfile.login },
        isAdmin: false,
        isOwner: false,
      });
      await this.chatUserRepository.save(newUser);
      return {
        ...userProfile,
        isAdmin: false,
        isOwner: false,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async banUser(userId: string, modifyUserDto: ModifyUserDto) {
    try {
      const user = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: userId },
            chatRoom: { id: modifyUserDto.chatId },
          },
        ],
      });
      if (!user || !user.isAdmin) throw new UnauthorizedException();

      const modifyUser = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: modifyUserDto.userId },
            chatRoom: { id: modifyUserDto.chatId },
          },
        ],
      });

      if (!modifyUser) throw new BadRequestException();
      if (modifyUser.isOwner) throw new UnauthorizedException();

      await this.chatUserRepository.update(modifyUser, { isBanned: true });
      return { message: 'Success' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async muteUser(userId: string, modifyUserDto: ModifyUserDto) {
    try {
		console.log(1);
      const chatUser = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: userId },
            chatRoom: { id: modifyUserDto.chatId },
          },
        ],
      });
      if (!chatUser || !chatUser.isAdmin) throw new UnauthorizedException();
	  console.log(2);

      const modifyUser = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: modifyUserDto.userId },
            chatRoom: { id: modifyUserDto.chatId },
          },
        ],
      });

      if (!modifyUser) throw new BadRequestException();
	  console.log(3);
      if (modifyUser.isOwner) throw new UnauthorizedException();
	  console.log(4);

      const time = new Date();
      time.setMinutes((time.getMinutes() + modifyUserDto.time) as number);
      const a = await this.chatUserRepository.update({id: modifyUser.id}, {
        mutedTo: time,
      });
	  console.log(time);
	  console.log(a);
		return { message: 'Success' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async makeAdmin(userId: string, modifyUserDto: ModifyUserDto) {
    try {
      const user = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: userId },
            chatRoom: { id: modifyUserDto.chatId },
          },
        ],
      });
      if (!user || !user.isOwner) {
        throw new UnauthorizedException();
      }
      const modifyUser = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: modifyUserDto.userId },
            chatRoom: { id: modifyUserDto.chatId },
          },
        ],
      });

      if (!modifyUser) throw new BadRequestException();
	
      const b = await this.chatUserRepository.update({id: modifyUser.id}, { isAdmin: true });
	  console.log(b);
      return { message: 'Success' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  private async removeUserFromChat(userId: string, chatId: string) {
    try {
      await this.chatUserRepository.delete({
        user: { login: userId },
        chatRoom: { id: chatId },
      });
      const user = await this.getUsersFromRoom(chatId);
      if (user.length === 0)
        await this.chatRoomRepository.delete({ id: chatId });
      return { message: 'Success' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async leaveChatRoom(userId: string, chatId: string) {
    try {
      const chatUser = await this.chatUserRepository.findOneBy({
        user: { login: userId },
        chatRoom: { id: chatId },
      });
      if (!chatUser) throw new BadRequestException();
      await this.removeUserFromChat(userId, chatId);
      const chat = await this.chatUserRepository.find({
        where: { chatRoom: { id: chatId } },
      });
      if (chat && chat.length > 0 && chatUser.isOwner) {
        const admins = chat.sort((a, b) =>
          a.isAdmin === b.isAdmin ? 0 : a.isAdmin ? -1 : 1,
        );
        await this.chatUserRepository.update(
          { id: admins[0].id },
          { isOwner: true },
        );
      }
      return { message: 'Success' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async kickFromChatRoom(userId: string, modifyUserDto: ModifyUserDto) {
    try {
      const chatUser = await this.chatUserRepository.findOneBy({
        user: { login: userId },
        chatRoom: { id: modifyUserDto.chatId },
      });

      if (!chatUser || !chatUser.isAdmin || userId === modifyUserDto.userId)
        throw new BadRequestException();
      const user = await this.chatUserRepository.findOneBy({
        user: { login: modifyUserDto.userId },
        chatRoom: { id: modifyUserDto.chatId },
      });
      if (!user || user.isOwner) throw new BadRequestException();
      await this.removeUserFromChat(modifyUserDto.userId, modifyUserDto.chatId);
      return { message: 'Success' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  encryptPass(password: string): string {
    const salt = bcryptjs.genSaltSync();
    return bcryptjs.hashSync(password, salt);
  }

  matchPass(password: string, passwordEncrypt: string): boolean {
    return bcryptjs.compareSync(password, passwordEncrypt);
  }

  private connectedClients: ConnectedClients = {};

  private checkUserConnection(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.userId === userId) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

  getUserIdByClient(clientId: string) {
    return this.connectedClients[clientId].userId;
  }

  getUserClientById(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.userId === userId) {
        return clientId;
      }
    }
  }

  getSocketByUserId(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];
      if (connectedClient.userId === userId) {
        return connectedClient.socket;
      }
    }
  }

  registerClient(client: Socket, userId: string) {
    this.checkUserConnection(userId);
    this.connectedClients[client.id] = {
      socket: client,
      userId,
    };
  }

  async removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  async sendMessage(userId: string, payload: CreateMsgDto) {
    try {
      const user = await this.chatUserRepository.findOne({
        where: {
          user: { login: userId },
          chatRoom: { id: payload.chatId },
        },
        relations: ['user'],
      });

      if (
        !user ||
        user.isBanned ||
        (user.mutedTo && new Date < new Date(user.mutedTo))
      ) {
		console.log('AAA');
        return ;
      }

	  if (payload.type === 'direct') {
		const block = await this.blockRepository.find({
		  where: [
			{
			user: {login: payload.reciverId},
		  	blockUser: {login: userId}
		    },
			{
				user: {login: userId},
				blockUser: {login: payload.reciverId}
			},
		]
	  	});
		console.log(block);
	  	if (block.length > 0)
		  return ;
	  }

      const msg = await this.storeMessage(userId, payload);
      const { id, chatRoomId, ...message } = msg;
      const resp = {
        ...msg,
        userId: msg.userId.login,
        chatRoomId: msg.chatRoomId.id,
      };
      if (payload.type === 'direct')
        this.gameGateway.wss
          .to(payload.reciverId)
          .emit('recive-message-direct', resp);
      else
        this.gameGateway.wss
          .to(payload.chatId)
          .emit('recive-message-group', resp);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
