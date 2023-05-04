export interface IProfile {
  login: string;
  avatar42: string;
  username: string | undefined;
  avatar: string | undefined;
  twoFactorAuth: boolean;
  status: string;
  color: string;
  icon: string;
  background:string;
}

export interface IUser extends IProfile {
  avatar42: string;
}
