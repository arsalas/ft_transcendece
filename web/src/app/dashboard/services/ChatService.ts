import { HttpService } from '../../../api/http';
import {
  EChatType,
  IChatRoomResponse,
  IResponseChatRoom,
} from '../../../interfaces';

export class ChatService {
  constructor(private http: HttpService) {}

  async getAllChatsByUser() {
    try {
      return await this.http.get<IChatRoomResponse[]>('/chat/chatrooms');
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getChat(chatId: string) {
    try {
      return await this.http.get<IResponseChatRoom>('/chat/chatroom/' + chatId);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getDirectChat(userId: string) {
    try {
      return await this.http.get<IResponseChatRoom>('/chat/direct/' + userId);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async createChat(payload: {
    name: string;
    type: EChatType;
    password?: string;
  }) {
    try {
      return await this.http.post<IChatRoomResponse>('/chat/group', payload);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async addUser(username: string, chatId: string) {
    try {
      return await this.http.post<IResponseChatRoom>('/chat/add', {
        userId: username,
        chatId,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async banUser(userId: string, chatId: string) {
    try {
      return await this.http.post<IResponseChatRoom>('/chat/ban', {
        userId,
        chatId,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async muteUser(userId: string, chatId: string, time: number) {
    try {
      return await this.http.post<IResponseChatRoom>('/chat/mute', {
        userId,
        chatId,
        time,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async addAdmin(userId: string, chatId: string) {
    try {
      return await this.http.post<IResponseChatRoom>('/chat/admin', {
        userId,
        chatId,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
