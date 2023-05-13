import { Profile } from '../entities';

export interface IStadistics {
  win: number;
  lost: number;
  played: number;
}

interface PlayerHistory {
  result: number;
  isWinner: boolean;
  profile: Profile;
}
export interface IHistoryGame {
  id: string;
  date: Date;
  type: string;
  playerLeft?: PlayerHistory;
  playerRight?: PlayerHistory;
}

export interface IUserProfile {
  profile: Profile;
  stadistics: IStadistics;
  history: IHistoryGame[];
}
