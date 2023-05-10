import { HttpService } from '../../../api/http';

interface GamePlayer {
  login: string;
  username: string;
  avatar: string;
  avatar42: string;
  coallition: string;
  icon: string;
  color: string;
}
export interface GameData {
  id: string;
  players: GamePlayer[];
}

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
}
