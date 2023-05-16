import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatMessage, ChatRoom, ChatUser } from './entities';
import { JwtPayload } from 'src/auth/interfaces';
import { User } from 'src/user/entities';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  /**
   * Obtiene todos los mensajes de un chatRoom
   */
  async create() {
    try {
      const mess = this.chatRoomRepository.create({
        name: 'name',
        type: 'direct',
      });
      // const res = await this.chatRoomRepository.insert(mess);
      const res = await this.chatRoomRepository.save(mess);
      return { res };
    } catch (error) {
      console.log(error);
    }
  }

  async findChatOrCreate(
    senderLogin: string,
    reciverId: string,
  ): Promise<ChatUser> {
    const chat = await this.chatUserRepository.findOne({
      where: [
        {
          userId: { login: senderLogin },
        },
        {
          userId: { login: reciverId },
        },
      ],
    });
    if (!chat) {
      const newChat = new ChatRoom();
      newChat.type = 'direct';
      newChat.name = 'name';
    }
    return chat;
  }

  async storeMessage(
    msg: string,
    chatId: string,
    user2: string,
  ): Promise<ChatMessage> {
    const chat = await this.chatMessageRepository.findOne({
      relations: ['user'],
    });
    const newMsg = new ChatMessage();
    newMsg.message = msg;
    newMsg.createdAt = new Date();
    newMsg.isRead = false;
    return chat;
  }

  // async getChatById(channelId: number): Promise<ChatUser> {
  //   const source = await this.chatRoomRepository.find{
  //     where: {channelId: id,},
  //     select: {}
  //   }
  //   return source;
  // }
}

//   // en este punto ya nos hemos asegurado de que el mensaje no este vacio
//   async sendMsg(senderLogin: string, msg: string, reciverId: string) {
//     // mirar si existe chat
//     const history = await this.chatUserRepository.findOne({
//       where: [
//         {
//           userId: { login: senderLogin },
//         },
//         {
//           userId: { login: reciverId },
//         },
//       ],
//     });
//     // si no existe el chat, creamos un registro y guardarlo con el save
//     // crear room de chat. inserto usuarios. creo mensaje
//     if (!history) {
//       await this.chatUserRepository.save({
//         ...history, // los ... es para crear un nuevo objeto copiando las propiedades de otro objeto
//         activedAt: new Date(),
//       });
//       const newHistory = this.chatMessageRepository.create({});
//       //save
//     } else {
//       const newMsg = this.chatMessageRepository.create({});
//       const findMsg = await this.chatUserRepository.insert(newMsg);
//     }
//     // si existe chat, miramos si es uno o mas
//     return history;
//   }
// }
