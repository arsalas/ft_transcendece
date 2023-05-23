import { HttpService } from '../../../api/http';
import { IChat } from '../../../interfaces';

export class ChatService {
  constructor(private http: HttpService) {}

  async open(body: object) {
    try {
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async sendMsg() {
    try {
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
