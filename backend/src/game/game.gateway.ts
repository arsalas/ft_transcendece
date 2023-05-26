import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({ cors: true, namespace: '/game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  constructor(
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      client.join(payload.login);
    } catch (error) {
      console.log(error);
      client.disconnect();
      return;
    }
    console.log('game conected: ', payload.login);
    this.gameService.registerClient(client, payload.login);
    this.wss.emit('clients-connect', {
      userId: payload.login,
      msg: 'game connected',
    });
  }

  async handleDisconnect(client: Socket) {
    console.log('game disconnected');
    this.gameService.removeClient(client.id);
    this.wss.emit('clients-disconect', { msg: 'game disconected' });
  }

  @SubscribeMessage('playerLeft-move-up')
  moveUpLeft(@MessageBody() gameId: string) {
    this.wss.to(`room_${gameId}`).emit('playerLeft-move-up');
  }

  @SubscribeMessage('playerLeft-move-down')
  moveDownLeft(@MessageBody() gameId: string) {
    this.wss.to(`room_${gameId}`).emit('playerLeft-move-down');
  }

  @SubscribeMessage('playerLeft-stop')
  stopLeft(@MessageBody() gameId: string) {
    this.wss.to(`room_${gameId}`).emit('playerLeft-stop');
  }

  @SubscribeMessage('playerRight-move-up')
  moveUpRight(@MessageBody() gameId: string) {
    this.wss.to(`room_${gameId}`).emit('playerRight-move-up');
  }

  @SubscribeMessage('playerRight-move-down')
  moveDownRight(@MessageBody() gameId: string) {
    this.wss.to(`room_${gameId}`).emit('playerRight-move-down');
  }

  @SubscribeMessage('playerRight-stop')
  stopRight(@MessageBody() gameId: string) {
    this.wss.to(`room_${gameId}`).emit('playerRight-stop');
  }

  @SubscribeMessage('update-game')
  updateGame(@MessageBody() gameData: any) {
    this.wss.to(`room_${gameData.gameId}`).emit('update-game', gameData);
  }

  @SubscribeMessage('finish-game')
  finishGame(@MessageBody() gameData: any) {
    this.gameService.finishGame(gameData);
  }

  @SubscribeMessage('player-disconnect')
  playerDisconnect(@MessageBody() gameData: string | undefined) {
    console.log('disconnect: ', { gameData });
  }

  @SubscribeMessage('begin-game')
  beginGame(@MessageBody() gameId: string) {
    this.wss.to(`room_${gameId}`).emit('start-game');
  }

  @SubscribeMessage('force-diconnect')
  forceDisconnect(@MessageBody() userId: string) {
    this.gameService.disconnectClient(userId);
  }

  @SubscribeMessage('spectate-game')
  handleSpectateGame(client: Socket, gameId: string) {
    console.log('SPECTATE GAME');
    console.log({ client, gameId });
    client.join(`room_${gameId}`);
  }

  @SubscribeMessage('reject-game')
  async handleRejectGame(
    client: Socket,
    { userId1, userId2 }: { userId1: string; userId2: string },
  ) {
    this.wss.to(userId2).emit('reject-game', userId1);
  }
  @SubscribeMessage('accept-game')
  async handleAcceptGame(
    client: Socket,
    {
      type,
      userId1,
      userId2,
    }: { type: string; userId1: string; userId2: string },
  ) {
    this.gameService.createInviteGame(type, userId1, userId2);
  }
}
