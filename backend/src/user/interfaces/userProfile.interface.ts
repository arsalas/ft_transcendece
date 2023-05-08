import { Profile } from '../entities';

export interface IStadistics {
  win: number;
  lost: number;
  played: number;
}

export interface IHistory {
  date: string;
  player: string; 
}

export interface IUserProfile {
  profile: Profile;
  stadistics: IStadistics;
  history: IHistory[];
}
