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
      console.log('WHERE I SENND: ', 'send/' + reciverId);
      // return await this.http.post<void>('send/' + reciverId, {
      //   message,
      //   reciverId,
      // });
      return await this.http.post<void>('send/' + reciverId, { message });
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
