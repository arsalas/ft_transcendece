import { HttpService } from '../../../api/http';
import { GameData } from '../../../interfaces';

export class GameService {
  constructor(private http: HttpService) {}

  async searchGame(type: string) {
    try {
      return await this.http.post<any>('/game', { type });
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async get(gameId: string) {
    try {
      return await this.http.get<GameData>('/game/' + gameId);
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async getActiveGameId(username: string) {
    try {
      return await this.http.get<{ id: string }>('/game/spectate/' + username);
    } catch (error) {
      throw new Error(error as string);
    }
  }
}
