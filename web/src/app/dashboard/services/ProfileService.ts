import { HttpService } from '../../../api/http';
import { IProfile, IUserProfile } from '../../../interfaces';

export class ProfileService {
  constructor(private http: HttpService) {}

  async get(username: string) {
    try {
      return await this.http.get<IUserProfile>('/user/' + username);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getLadder() {
    try {
      return await this.http.get<IProfile[]>('/user');
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
