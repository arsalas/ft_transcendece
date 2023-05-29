import { HttpService } from '../../../api/http';
import { IChat, IUser } from '../../../interfaces';

export class ChatService {
  constructor(private http: HttpService) {}

  // async open(body: object) {
  //   try {
  //   } catch (error) {
  //     throw new Error(error as string);
  //   }
  // }

  async sendMsg(message: string, reciverId: string) {
    try {
      return await this.http.post<void>('/chat/send', { message, reciverId });

      // // return await this.http.post<void>('send/' + reciverId, {
      // //   message,
      // //   reciverId,
      // // });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async openDirectChat() {
    try {
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
