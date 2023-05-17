export interface IFriend {
  activedAt: string;
  isSender: boolean;
  isBlock: boolean;
  profile: IFriendProfile;
}

export interface IFriendProfile {
  login: string;
  username: string;
  avatar: string | null;
  avatar42: string;
  status: string;
}
