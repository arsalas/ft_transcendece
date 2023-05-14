import {
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
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

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);

      client.join(payload.login);
    } catch (error) {
      client.disconnect();
      return;
    }

    await this.notificationsWsService.registerClient(client, payload.login);

    // client.broadcast.emit('user-connected', { user: client.id });
    this.wss.emit('clients-connect', { userId: payload.login });
    this.wss.emit('refresh-friends');
  }

  async handleDisconnect(client: Socket) {
    const userId = this.notificationsWsService.getUserIdByClient(client.id);
    await this.notificationsWsService.removeClient(client.id);
    this.wss.emit('clients-disconect', { userId });
    this.wss.emit('refresh-friends');
  }

  @SubscribeMessage('send-request')
  async handleMessageFromClient(client: Socket, username: string) {
    console.log('send-request');
    const newFriend = await this.notificationsWsService.sendRequest(
      client.id,
      username,
    );
    const userId = this.notificationsWsService.getUserIdByClient(client.id);
    this.wss.to(userId).emit('request-recived', newFriend);
    this.wss.to(newFriend.profile.login).emit('refresh-friends');
  }

  @SubscribeMessage('accept-request')
  async handlAcceptRequest(client: Socket, username: string) {
    // const newFriend = await this.notificationsWsService.sendRequest(
    //   client.id,
    //   username,
    // );
    // const userId = this.notificationsWsService.getUserIdByClient(client.id);
    console.log(username);
    this.wss.to(username).emit('refresh-friends');
  }

  @SubscribeMessage('refuse-request')
  async handlRefuseRequest(client: Socket, username: string) {
    // const newFriend = await this.notificationsWsService.sendRequest(
    //   client.id,
    //   username,
    // );
    // const userId = this.notificationsWsService.getUserIdByClient(client.id);
    this.wss.to(username).emit('refresh-friends');
  }

  @SubscribeMessage('change-status')
  async handlChangeStatus(client: Socket, status: string) {
    if (
      status != 'online' &&
      status != 'offline' &&
      status != 'away' &&
      status != 'game'
    )
      return;
    await this.notificationsWsService.changeStatus(client.id, status);
    this.wss.emit('refresh-friends');
  }

  @SubscribeMessage('force-diconnect')
  forceDisconnect(@MessageBody() userId: string) {
    // this.notificationsWsService.disconnectClient(userId);
  }
}
