import { HttpService } from '../../../api/http';
import { IChat, IUser } from '../../../interfaces';

export class ChatService {
  constructor(private http: HttpService) {}

  async sendMyMsg(message: string, reciverId: string) {
    try {
      const payload = {
        message: message,
        reciverId: reciverId,
      };
      return await this.http.post<void>('/chat/send', payload);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async lastTenMsg(login: string) {
    try {
      return await this.http.post<void>('chat/tenMsg', login);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async openDirectChat(reciverId: string) {
    try {
      return await this.http.post<void>('/chat/direct', { reciverId });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
