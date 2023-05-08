import { IProfile } from "./user";

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
  profile: IProfile;
  stadistics: IStadistics;
  history: IHistory[];
}
