import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
  Inject
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
    await this.chatMessageRepository.save(newMsg);
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
    console.log('NUEVO CHAT CREADO');
  }

  async getMessages(userId: string, chatId: string) {
	try {
	  const user = await this.chatUserRepository.findOne({
		where: {
			user: { login: userId },
			chatRoom: { id: chatId}
		},
		relations: ['chatRoom'],
	  });

	  if (!user) {
		throw new UnauthorizedException();
	  }

	  if (user.isBanned)
		  throw new UnauthorizedException();

	  const msgs = await this.chatMessageRepository
		.createQueryBuilder('message')
		.leftJoinAndSelect('message.userId', 'user') // Cargar la relación 'userId' con la entidad 'User'
		.where('message.chatRoomId = :chatId', { chatId })
		.orderBy('message.createdAt', 'DESC')
		.take(this.LIMIT_MESSAGE)
		.getMany();

	return msgs.map((val) => ({
			userId: val.userId.login,
			message: val.message,
			createdAt: val.createdAt,
			isRead: val.isRead
		}));
	} catch (error) {
	  console.log(error);
	}
  }

  async getChatRooms(userId:string) {
	try {
		const chats = await this.chatRoomRepository.find({
			where: {
					type: In(['public', 'private', 'protected'])
				}
		})

		return chats.filter(async (c) => {
			if (c.type !== 'public') {
				const user = await this.chatUserRepository.findOneBy({ user: {login: userId}});
				if (!user)
					return false;
			}
			return true;
		}).map((c) => ({
			id: c.id,
			name: c.name,
			type: c.type
		}))
	} catch {

	}
  }

  async getChatRoom(userId: string, chatId: string) {
	try {
	  const room = await this.chatRoomRepository.findOneBy({ id: chatId });

	  if (!room) {
		throw new NotFoundException();
	  }
		return {
			id: room.id,
			name: room.name,
			type: room.type,
			messages: await this.getMessages(userId, chatId),
			users: await this.getUsersFromRoom(chatId),
		};
	} catch (error) {
	  console.log(error);
	  throw error;
	}
  }

  async getUsersFromRoom(chatId:string) {
	try {
		const room = await this.chatRoomRepository.findOneBy({ id: chatId });
		if (!room || room.type === 'direct') {
			return []
		}
		const users = await this.chatUserRepository.find({
			where: {
				chatRoom: { id: chatId }
			},
			relations: ['user']
		})

		if (!users)
			return [];

		const usersInChat = [];
		for (let u of users) {
			const profile = await this.profileRepository.findOneBy({ login: u.user.login });

			usersInChat.push({
				...profile,
				isAdmin: u.isAdmin,
				isOwner: u.isOwner
			})
		}
		return usersInChat;

	} catch {

	}
  }

  async getFriendsMessages(userId:string) {
	try {
		const chats = await this.chatUserRepository
		.createQueryBuilder('chats')
		.where('chat.userId.login = :userId and chat.chatRoom.type = "direct"', { userId })
		.leftJoinAndSelect('message.userId', 'user')
		.getMany()

		const chatMessages = chats.map(async (v) => ({
			id: v.chatRoom.id, messages: await this.getMessages(userId, v.chatRoom.id)
		}))
		return await Promise.all(chatMessages);
	}
	catch (error) {
		console.log(error);
	}
  }

  async openDirectChat(senderLogin: string, reciverId: string) {
    try {
		const chat = await this.chatUserRepository.findOne({
			where: [
				{
				chatRoom: {name: senderLogin + '-' + reciverId},
				},
				{
				chatRoom: {name: reciverId + '-' + senderLogin},
				},
			],
			relations: ['chatRoom'],
		});
      if (!chat) {
        console.log('El chat NO existe');
        await this.createSaveChat(senderLogin, reciverId);
        return [];
      }

		return await this.getChatRoom(senderLogin, chat.chatRoom.id);
	  } catch (error) {
		console.log(error);
		throw new InternalServerErrorException();
	  }
  }

  async createGroupChat(userId:string, groupDto: CreateChatDto) {
    try {
    //   const chat = await this.chatRoomRepository.findOne({
    //     where: [
    //       {
    //         name: groupDto.name,
    //       },
    //     ],
    //   });
    //   if (chat) {
    //     console.log('EXISTE EL CHAT');
    //     return [];
    //   }
	if (groupDto.type === 'protected' && !groupDto.password)
		throw Error("MISSSING PASSWORD")
	const newChat = this.chatRoomRepository.create({
		name: groupDto.name,
		type: groupDto.type,
		password: groupDto.password ? this.encryptPass(groupDto.password) : null
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
		id: newChat.id,
		name: newChat.name,
		type: newChat.type
	};
    } catch (error) {
      console.log(error);
    }
  }

  async updateGroupChat(userId:string, groupDto: UpdateChatDto) {
    try {
		const user = await this.chatUserRepository.findOne({
			where: [
			  {
				user: { login: userId },
				chatRoom: { name: groupDto.name },
			  },
			],
		});
		if (!user) {
			throw new UnauthorizedException();
		}

      const group = await this.chatRoomRepository.findOneBy({name: groupDto.name});
      if (!group) {
        console.log('NO EXISTE EL CHAT');
        return [];
      }

	if (groupDto.type && groupDto.type === 'protected' && !groupDto.password)
		throw Error("MISSSING PASSWORD")

	const pass = groupDto.password ? this.encryptPass(groupDto.password) : null
	await this.chatRoomRepository.update(group, {...groupDto, password: pass})
	return {
		name: groupDto.name,
		type: groupDto.type
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

      if (!user || !user.isAdmin || !user.isOwner) {
		throw new UnauthorizedException();
      }

	  const addUser = await this.chatUserRepository.findOne({
        where: [
          {
			user: { login: addUserDto.userId },
            chatRoom: { id: addUserDto.chatId },
          },
        ],
      });

	  if (addUser) {
		throw new BadRequestException();
	  }

      const findRoom = await this.chatRoomRepository.findOne({
        where: [
          {
			id: addUserDto.chatId,
          },
        ],
      });

	  if (findRoom.type === 'protected' && !this.matchPass(findRoom.password, addUserDto.password)) {
		throw new UnauthorizedException();
      }

      const newUser = this.chatUserRepository.create({
        chatRoom: findRoom,
        user: { login: addUserDto.userId },
        isAdmin: false,
        isOwner: false,
      });
      await this.chatUserRepository.save(newUser);
    } catch (error) {
      console.log(error);
    }
  }

  async banUser(userId: string, modifyUserDto: ModifyUserDto) {
    try {
      const user = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: userId },
            chatRoom: { name: modifyUserDto.chatId },
          },
        ],
      });
      if (!user || !user.isAdmin || !user.isOwner) {
		throw new UnauthorizedException();
      }
	  const modifyUser = await this.chatUserRepository.findOne({
		where: [
			{
			  user: { login: modifyUserDto.userId },
			  chatRoom: { name: modifyUserDto.chatId },
			},
		  ],
		});

		if (!modifyUser) {
			throw new BadRequestException();
		}
		if (modifyUser.isOwner) {
			throw new UnauthorizedException();
		}
		await this.chatUserRepository.update(modifyUser, {isBanned: true});
    } catch (error) {
      console.log(error);
    }
  }

  async muteUser(userId: string, modifyUserDto: ModifyUserDto) {
    try {
		const user = await this.chatUserRepository.findOne({
		  where: [
			{
			  user: { login: userId },
			  chatRoom: { name: modifyUserDto.chatId },
			},
		  ],
		});
		if (!user || !user.isAdmin || !user.isOwner) {
		  throw new UnauthorizedException();
		}
		const modifyUser = await this.chatUserRepository.findOne({
		  where: [
			  {
				user: { login: modifyUserDto.userId },
				chatRoom: { name: modifyUserDto.chatId },
			  },
			],
		  });
  
		  if (!modifyUser) {
			  throw new BadRequestException();
		  }
		  if (modifyUser.isOwner) {
			  throw new UnauthorizedException();
		  }
		  await this.chatUserRepository.update(modifyUser, {mutedTo: modifyUserDto.time});
	  } catch (error) {
		console.log(error);
	  }
  }

  async makeAdmin(userId: string, modifyUserDto: ModifyUserDto) {
    try {
		const user = await this.chatUserRepository.findOne({
		  where: [
			{
			  user: { login: userId },
			  chatRoom: { name: modifyUserDto.chatId },
			},
		  ],
		});
		if (!user || !user.isAdmin || !user.isOwner) {
		  throw new UnauthorizedException();
		}
		const modifyUser = await this.chatUserRepository.findOne({
		  where: [
			  {
				user: { login: modifyUserDto.userId },
				chatRoom: { name: modifyUserDto.chatId },
			  },
			],
		  });
  
		  if (!modifyUser) {
			  throw new BadRequestException();
		  }
		  await this.chatUserRepository.update(modifyUser, {isAdmin: true});
	  } catch (error) {
		console.log(error);
	  }
  }

	encryptPass (password: string): string {
		const salt = bcryptjs.genSaltSync();
		return bcryptjs.hashSync(password, salt);
	}

	matchPass (password: string, passwordEncrypt: string): boolean {
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
					chatRoom: { id: payload.chatId }
				}
			})

			if (!user || user.isBanned || (user.mutedTo && user.mutedTo.valueOf() - Date.now() < 0)) {
				throw new UnauthorizedException();
			}
			await this.storeMessage(userId, payload);
			this.gameGateway.wss.to(payload.chatId).emit('recive-message', payload.message);
		} catch {

		}
	}

}
