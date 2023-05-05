export interface IProfile {
  login: string;
  avatar42: string;
  username: string | undefined;
  avatar: string | undefined;
  twoFactorAuth: boolean;
  status: string;
}

export interface IUser extends IProfile {
  avatar42: string;
}
