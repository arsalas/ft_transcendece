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

  /** para grupos */
  // async create() {
  //   try {
  //     const mess = this.chatRoomRepository.create({
  //       name: 'name',
  //       type: 'direct',
  //     });
  //     const res = await this.chatRoomRepository.save(mess);
  //     return { res };
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // no existe el chat
  async createSaveChat(senderLogin: string, reciverId: string, msg: string) {
    const newChat = await this.chatRoomRepository.create({
      name: `${senderLogin}-${reciverId}`,
      type: 'direct',
    });
    console.log({ newChat });
    const room = await this.chatRoomRepository.save(newChat);
    console.log({ room });

    const user1 = await this.chatUserRepository.create({
      chatRoom: room,
      user: { login: senderLogin },
      isAdmin: false,
      isOwner: false,
    });
    const user2 = await this.chatUserRepository.create({
      chatRoom: room,
      user: { login: reciverId },
      isAdmin: false,
      isOwner: false,
    });
    await this.chatUserRepository.save([user1, user2]);
    console.log('NUEVO CHAT CREADO');
    await this.storeMessage(senderLogin, msg, room.id);
  }

  // store the message
  async storeMessage(senderLogin: string, msg: string, roomId: string) {
    // const date = new Date();
    // const actualDate = date.toLocaleString();
    console.log('Vamos a almacenar el mensaje');
    const newMsg = await this.chatMessageRepository.create({
      message: msg,
      isRead: false,
      userId: { login: senderLogin },
      chatRoomId: { id: roomId },
    });
    await this.chatMessageRepository.save(newMsg);
    console.log('NUEVO MENSAJE GUARDADO');
  }

  // find the chat. If not exist, create one. Store the message
  async findChatOrCreate(senderLogin: string, reciverId: string, msg: string) {
    try {
      const chat = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: senderLogin },
          },
          {
            user: { login: reciverId },
          },
        ],
        relations: ['chatRoom'],
      });
      // create es crear una instancia de clase
      // el save guarda, el insert no
      if (!chat) {
        await this.createSaveChat(senderLogin, reciverId, msg);
        return [];
      }
      console.log('EXISTE EL CHAT');
      // coinciden los usuarios?
      await this.storeMessage(senderLogin, msg, chat.chatRoom.id);
      return chat;
    } catch (error) {
      console.log(error);
    }
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
