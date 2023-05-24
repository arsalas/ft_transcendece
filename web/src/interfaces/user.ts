export type Status = 'online' | 'away' | 'offline' | 'game';

export interface IProfile {
  login: string;
  avatar42: string;
  username: string | undefined;
  avatar: string | undefined;
  twoFactorAuth: boolean;
  status: Status;
  color: string;
  coallition: string;
  icon: string;
  background: string;
  ladder: number;
}

export interface IUser extends IProfile {
  avatar42: string;
}
