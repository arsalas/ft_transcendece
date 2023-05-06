import {
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { NotificationsWsService } from './notifications-ws.service';
import { JwtPayload } from 'src/auth/interfaces';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true, namespace: '/notifications' })
export class NotificationsWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly notificationsWsService: NotificationsWsService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);

      client.join(payload.login);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.notificationsWsService.registerClient(client, payload.login);

    // client.broadcast.emit('user-connected', { user: client.id });
    this.wss.emit('clients-connect', { userId: payload.login });
  }

  handleDisconnect(client: Socket) {
    const userId = this.notificationsWsService.getUserIdByClient(client.id);
    this.notificationsWsService.removeClient(client.id);
    this.wss.emit('clients-disconect', { userId });
  }

  @SubscribeMessage('send-request')
  async handleMessageFromClient(client: Socket, username: string) {
    console.log('send-request')
	const newFriend = await this.notificationsWsService.sendRequest(
      client.id,
      username,
    );
    const userId = this.notificationsWsService.getUserIdByClient(client.id);
	this.wss
      .to(userId)
      .emit('request-recived', newFriend);
	  this.wss.to(newFriend.profile.login).emit('refresh-friends');
  }
}
