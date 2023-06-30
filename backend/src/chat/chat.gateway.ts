import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { ChatService } from './chat.service';
  import { Server, Socket } from 'socket.io';
  import { JwtService } from '@nestjs/jwt';
  import { JwtPayload } from 'src/auth/interfaces';
  import { Inject, forwardRef } from '@nestjs/common';
import { CreateMsgDto } from './dto/create-msg';
  
  @WebSocketGateway({ cors: true, namespace: '/chat' })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss: Server;
  
	constructor(
	  @Inject(forwardRef(() => ChatService))
	  private readonly chatService: ChatService,
	  private readonly jwtService: JwtService,
	) {}
  
	async handleConnection(client: Socket) {
	  const token = client.handshake.headers.authentication as string;
	  let payload: JwtPayload;
	  try {
		payload = this.jwtService.verify(token);
		client.join(payload.login);
		console.log('chat connect ', payload.login);
	  } catch (error) {
		console.log(error);
		client.disconnect();
		return;
	  }
	  this.chatService.registerClient(client, payload.login);
	}
  
	async handleDisconnect(client: Socket) {
	  this.chatService.removeClient(client.id);
	}
  
	@SubscribeMessage('send-message')
	sendMessage(client: Socket, payload: CreateMsgDto) {
		const userId = this.chatService.getUserIdByClient(client.id);
		this.chatService.sendMessage(userId, payload)
	}

	@SubscribeMessage('join-chat') 
	joinChat(client: Socket,chatId: string) {
		client.join(chatId);
	}

	@SubscribeMessage('leave-chat')
	chatDisconnect(client: Socket, chatId: string) {
		client.leave(chatId);
	}

}
  