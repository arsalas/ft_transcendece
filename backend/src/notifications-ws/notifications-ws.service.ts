import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { FriendsService } from 'src/friends/friends.service';
import { Profile } from 'src/user/entities';
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
    return this.connectedClients[clientId].userId;
  }

  async registerClient(client: Socket, userId: string) {
    this.checkUserConnection(userId);

    await this.profileRepository.save({ login: userId, status: 'online' });

    this.connectedClients[client.id] = {
      socket: client,
      userId,
    };
  }

  async removeClient(clientId: string) {
    await this.profileRepository.save({
      login: this.connectedClients[clientId].userId,
      status: 'offline',
    });
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
