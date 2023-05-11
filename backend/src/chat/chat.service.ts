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

  async create() {
    try {
      const mess = this.chatRoomRepository.create({
        name: 'name',
        type: 'direct',
      });
      const res = await this.chatRoomRepository.insert(mess);
      return { res };
    } catch (error) {
      console.log(error);
    }
  }

  // en este punto ya nos hemos asegurado de que el mensaje no este vacio
  async sendMsg(senderLogin: string, msg: string, reciverId: string) {
    // mirar si existe chat
    const history = await this.chatUserRepository.findOne({
      where: [
        {
          userId: { login: senderLogin },
        },
        {
          userId: { login: reciverId },
        },
      ],
    });
    if (!history) {
      // si no existe el chat, creamos un registro y guardarlo con el save
      // crear room de chat. inserto usuarios. creo mensaje
      const newHistory = this.chatMessageRepository.create({});
      //save
    }
    // si existe chat, miramos si es uno o mas
  }

  // async getAllByUser(id: string) {
  //   const msgs = await this.chatRoomRepository.find({});
  // }

  // // encontrar el chat que tenga ese Id
  // async findHistory(chatId: string) {
  //   const msgs = await this.chatMessageRepository.findOne({
  //     where: [
  //       {
  //       },
  //     ],
  //   });
  //   return msgs;
  // }

  // async sendMsg(login: string, ChatUser: CreateChatDto) {
  //   const msg = await this.chatMessageRepository.findOneBy({
  //     // username: ChatUser.,
  //   });
  //   if (!msg)
  //     throw new NotFoundException('CREAMOS EL INICIO DE LOS MENSAJES');
  //   if (await this.chatMessageRepository)
  //     throw new BadRequestException('TENEMOS MENSAJES');
  //   const friend = this.chatMessageRepository.create({
  //     reciver: { login: msg.login },
  //     sender: { login },
  //   });
  //   await this.chatMessageRepository.insert(msg);
  //   return {
  //     msg: {
  //       login: chat.login,
  //       id: chat.id;
  //       date: chat.date;
  //     },
  //   };
  // }
}
