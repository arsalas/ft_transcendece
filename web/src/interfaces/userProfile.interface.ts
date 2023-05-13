import { IProfile } from './user';

export interface IStadistics {
  win: number;
  lost: number;
  played: number;
}

interface PlayerHistory {
  result: number;
  isWinner: boolean;
  profile: IProfile;
}
export interface IHistoryGame {
  id: string;
  date: Date;
  type: string;
  playerLeft: PlayerHistory;
  playerRight: PlayerHistory;
}

export interface IUserProfile {
  profile: IProfile;
  stadistics: IStadistics;
  history: IHistoryGame[];
}
