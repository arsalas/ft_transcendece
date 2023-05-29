import { HttpService } from '../../../api/http';
import { IChat, IUser } from '../../../interfaces';

export class ChatService {
  constructor(private http: HttpService) {}

  // async openDirMsg(body: object) {
  //   try {
  //   } catch (error) {
  //     throw new Error(error as string);
  //   }
  // }

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
  // console.log('IN CHATS. MESSAGE IS: ', message, 'REC: ', reciverId);
  // // return await this.http.post<void>('send/' + reciverId, {
  // //   message,
  // //   reciverId,
  // // });

  async openDirectChat(reciverId: string) {
    try {
      console.log('ABRIMOS EL CHAT DE: ', reciverId);
      return await this.http.post<void>('/chat/direct', { reciverId });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
