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
import { UserStatus } from 'src/user/entities';

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
  async handleAcceptRequest(client: Socket, username: string) {
    console.log(username);
    this.wss.to(username).emit('refresh-friends');
  }

  @SubscribeMessage('refuse-request')
  async handleRefuseRequest(client: Socket, username: string) {
    this.wss.to(username).emit('refresh-friends');
  }

  @SubscribeMessage('invite-game')
  async handleInviteGame(
    client: Socket,
    { userId, typeGame, user }: { userId: string; typeGame: string; user: any },
  ) {
    this.wss.to(userId).emit('invite-game', { typeGame, user });
  }



  @SubscribeMessage('change-status')
  async handleChangeStatus(client: Socket, status: UserStatus) {
    if (
      status != UserStatus.ONLINE &&
      status != UserStatus.OFFLINE &&
      status != UserStatus.AWAY &&
      status != UserStatus.GAME
    )
      return;
    await this.notificationsWsService.changeStatus(client.id, status);
    this.wss.emit('refresh-friends');
  }

  @SubscribeMessage('force-diconnect')
  forceDisconnect(@MessageBody() userId: string) {}
}
