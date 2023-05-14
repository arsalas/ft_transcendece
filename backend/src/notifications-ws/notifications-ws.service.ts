import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { FriendsService } from 'src/friends/friends.service';
import { Profile, UserStatus } from 'src/user/entities';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    userId: string;
  };
}

@Injectable()
export class NotificationsWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly friendsService: FriendsService,
  ) {}

  getUserIdByClient(clientId: string) {
    console.log({ clientId });
    return this.connectedClients[clientId].userId;
  }

  async registerClient(client: Socket, userId: string) {
    this.checkUserConnection(userId);
    this.connectedClients[client.id] = {
      socket: client,
      userId,
    };
    await this.changeStatus(client.id, UserStatus.ONLINE);
  }

  async removeClient(clientId: string) {
    await this.changeStatus(clientId, UserStatus.OFFLINE);
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }

  async sendRequest(clientId: string, username: string) {
    const userId = this.getUserIdByClient(clientId);
    return await this.friendsService.sendRequest(userId, {
      reciverId: username,
    });
  }

  async changeStatus(clientId: string, status: UserStatus) {
    const userId = this.getUserIdByClient(clientId);
    await this.profileRepository.save({ login: userId, status });
  }

  private checkUserConnection(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.userId === userId) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }
}
