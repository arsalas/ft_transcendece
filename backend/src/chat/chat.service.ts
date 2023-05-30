import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatMessage, ChatRoom, ChatUser } from './entities';
import { JwtPayload } from 'src/auth/interfaces';
import { User } from 'src/user/entities';
import crypto from 'crypto';
// import bcrypt from 'bcryptjs';

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

  // store the message
  async storeMessage(senderLogin: string, msg: string, roomId: string) {
    const newMsg = await this.chatMessageRepository.create({
      message: msg,
      isRead: false,
      userId: { login: senderLogin },
      chatRoomId: { id: roomId },
    });
    await this.chatMessageRepository.save(newMsg);
    console.log('NUEVO MENSAJE GUARDADO');
  }

  // storage the msg in direct chat
  async sendMsg(senderLogin: string, reciverId: string, msg: string) {
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
      if (!chat) {
        console.log('User not found');
        return [];
      }
      if (chat) {
        await this.storeMessage(senderLogin, msg, chat.chatRoom.id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // no existe el chat directo
  async createSaveChat(senderLogin: string, reciverId: string) {
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
  }

  // find the last 10 messages in this chatRoom
  // async lastTenMsg(senderLogin: string, reciverId: string) {
  //   try {
  //     const chat = await this.chatUserRepository.findOne({
  //       where: [
  //         {
  //           user: { login: senderLogin },
  //         },
  //         {
  //           user: { login: reciverId },
  //         },
  //       ],
  //       relations: ['chatRoom'],
  //     });
  //     if (!chat) {
  //       console.log('El chat NO existe');
  //       return [];
  //     }
  //     const msgs = await this.chatMessageRepository.find({
  //       where: {
  //         chatRoomId: { id: chat.id },
  //       },
  //       // in descending order
  //       order: {
  //         id: 'DESC',
  //       },
  //       take: 10,
  //     });
  //     console.log(
  //       'LAST 10 MESSAGES:',
  //       msgs.map((msg) => msg.message),
  //     );
  //     console.log('MSG IN LAST 10 MSG IS: ', msgs);
  //     return msgs;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async lastTenMsg(senderLogin: string, reciverId: string) {
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

      if (!chat) {
        console.log('El chat NO existe');
        return [];
      }
      const roomId = chat.chatRoom.id;
      const msgs = await this.chatMessageRepository
        .createQueryBuilder('message')
        .where('message.chatRoomId = :roomId', { roomId })
        .orderBy('message.createdAt', 'DESC')
        .take(10)
        .getMany();

      console.log('LAST 10 MESSAGES:');
      msgs.forEach((msg) => {
        console.log('User ID:', msg.userId);
        console.log('Message:', msg.message);
      });
      return msgs;
    } catch (error) {
      console.log(error);
    }
  }

  // find the last 10 messages in this chatRoom
  async findOldMsg(roomId: string) {
    try {
      const msgs = await this.chatMessageRepository.find({
        where: {
          chatRoomId: { id: roomId },
        },
        // in descending order
        order: {
          id: 'DESC',
        },
        take: 10,
        // relations: ['user'],
      });
      // console.log(
      //   'FIND OLD MSG:',
      //   msgs.map((msg) => msg.message),
      // );
      return msgs;
    } catch (error) {
      console.log(error);
    }
  }

  // Open the chat. If not exist, create one.
  async openDirectChat(senderLogin: string, reciverId: string) {
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
        console.log('El chat NO existe');
        await this.createSaveChat(senderLogin, reciverId);
        return [];
      }
      console.log('EXISTE EL CHAT');
      // await this.findOldMsg(chat.chatRoom.id);
      return chat;
    } catch (error) {
      console.log(error);
    }
  }

  // no existe el chat grupal
  async createSaveGroupChat(
    nameGroup: string,
    sendersLog: string[],
    reciverId: string,
    type: string,
  ) {
    const newChat = await this.chatRoomRepository.create({
      name: nameGroup,
      type: type,
    });
    console.log({ newChat });
    const room = await this.chatRoomRepository.save(newChat);
    console.log({ room });

    const user1 = sendersLog.map((senderLog) =>
      this.chatUserRepository.create({
        chatRoom: room,
        user: { login: senderLog },
        isAdmin: false,
        isOwner: false,
      }),
    );
    const user2 = await this.chatUserRepository.create({
      chatRoom: room,
      user: { login: reciverId },
      isAdmin: true,
      isOwner: true,
    });
    await this.chatUserRepository.save([...user1, user2]);
    console.log('NUEVO CHAT GRUPAL CREADO');
  }

  // open a group chat. If doesn't exist, I create it, I'm the owner and administrator
  // TODO aqui ponemos name: chatName para poder hacer la llamada con el thunder, pero deberemos cambiarlo a la ID, ahora no se
  // puede porque con el Thunder deberiamos enviar un UUID
  async openGroupChat(
    chatName: string,
    sendersLog: string[],
    reciverId: string,
    msg: string,
  ) {
    if (sendersLog.length < 3) {
      console.log('Un chat grupal debe contener al menos 3 personas');
      return [];
    }
    try {
      const chat = await this.chatRoomRepository.findOne({
        where: [
          {
            name: chatName,
            // id: chatName,
          },
        ],
      });
      if (!chat) {
        console.log('NO EXISTE EL CHAT');
        return [];
      }
      console.log('EL CHAT SI EXISTE');
      await this.findOldMsg(chat.id);
    } catch (error) {
      console.log(error);
    }
  }

  // add a user to a group chat
  // TODO aqui ponemos name: chatName para poder hacer la llamada con el thunder, pero deberemos cambiarlo a la ID, ahora no se
  // puede porque con el Thunder deberiamos enviar un UUID
  async addUser(newUser: string, chatName: string) {
    console.log('newUser: ', newUser, 'chatName: ', chatName);
    try {
      const chat = await this.chatUserRepository.findOne({
        where: [
          {
            chatRoom: { name: chatName },
            // chatRoom: { id: chatName },
          },
        ],
      });
      // si ese usuario ya está dentro
      if (chat) {
        console.log('Ese usuario ya está en el grupo');
        return [];
      }
      const findRoom = await this.chatRoomRepository.findOne({
        where: [
          {
            name: chatName,
          },
        ],
      });
      // si no existe el grupo
      if (!findRoom) {
        console.log('No existe el grupo');
        return [];
      }
      // si no estaba dentro previamente, lo insertamos
      const user1 = await this.chatUserRepository.create({
        chatRoom: findRoom,
        user: { login: newUser },
        isAdmin: false,
        isOwner: false,
      });
      await this.chatUserRepository.save([user1]);
      console.log('USUARIO AÑADIDO AL GRUPO');
    } catch (error) {
      console.log(error);
    }
  }

  async deleteUser(deleteUser: string, chatName: string) {
    try {
      const findRoom = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: deleteUser },
            chatRoom: { name: chatName },
          },
        ],
      });
      if (!findRoom) {
        console.log('Este usuario no está en el grupo');
        return [];
      }
      await this.chatUserRepository.remove(findRoom);
      console.log('Usuario eliminado del grupo');
    } catch (error) {
      console.log(error);
    }
  }

  async mutexUser(silencedUser: string) {
    try {
      const findUser = await this.chatUserRepository.findOne({
        where: [
          {
            user: { login: silencedUser },
          },
        ],
      });
      if (!findUser) {
        console.log('Este usuario no existe');
        return [];
      }
      //TODO mutear el usuario
    } catch (error) {
      console.log(error);
    }
  }

  // async encriptKey(key: string) {
  //   const round = 10;
  //   const encript = await bcrypt.hash(key, round, (err, ok) => {
  //     if (err) {
  //       console.log('Error hasheando:', err);
  //       return [];
  //     } else {
  //       console.log('Y hasheada es: ' + ok);
  //     }
  //   });
  //   return encript;
  // }

  // Comparamos si la contraseña que nos envían para determinado nameRoom coincide
  // TODO cambiar nameRoom por la id, ahora no me deja para hacer la peti en Thunder y ver que todo funciona
  // async compareKeys(key: string, nameRoom: string) {
  //   const valid = await bcrypt.compare(key, nameRoom, (err, coinciden) => {
  //     if (err) {
  //       console.log('Error en la contraseña');
  //       return [];
  //     }
  //     console.log('Coincidencia: ', coinciden);
  //   });
  //   return valid;
  // }

  // https://www.youtube.com/watch?v=vGikkrp-HPM
  async createSockets() {
    const http = require('http');
    const express = require('express');
    const app = express();
    const socketio = require('socket.io');
    const server = http.createServer(app);
    const io = socketio.listen(server);

    // cuando hay una nueva conexion de sockers y se conecta un nuevo servidor
    io.on('connection', (socket) => {
      console.log('New user connected');
    });

    // static files
    app.use(express.static('public'));

    // start the server
    server.listen(3000, () => {
      console.log('Server in 3000');
    });
  }
}
