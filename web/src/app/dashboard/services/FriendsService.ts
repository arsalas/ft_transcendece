import { HttpService } from '../../../api/http';
import { IProfile } from '../../../interfaces';
import { IFriend } from '../../../interfaces/friends';

export class FriendsService {
  constructor(private http: HttpService) {}

  async get() {
    try {
      return await this.http.get<IFriend[]>('/friends');
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async sendRequest(reciverId: string) {
    try {
      return await this.http.post<IFriend>('/friends', { reciverId });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async acceptRequest(senderId: string) {
    try {
      return await this.http.patch<void>('/friends', { senderId });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async unfriend(userId: string) {
    try {
      return await this.http.delete<void>('/friends/' + userId);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async block(userId: string) {
    try {
      return await this.http.post<void>('/friends/block/' + userId, {});
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async unblock(userId: string) {
    try {
      return await this.http.delete<void>('/friends/block/' + userId);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
