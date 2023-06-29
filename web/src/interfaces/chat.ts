export interface IChat {
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: string;
}

export enum EChatType {
  Direct = 'direct',
  Public = 'public',
  Private = 'private',
  Protected = 'protected',
}

export interface IChatRoomResponse {
  name: string;
  id: string;
  type: EChatType;
}

export interface IResponseChatRoom {
  id: string;
  name: string;
  type: EChatType;
  messages: IMessage[];
  users?: IUserChat[]; // solo cuando no sea directo
}

export interface IMessage {
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string; // es el login del usuario
}

export interface IUserChat {
  login: string;
  username: string;
  avatar: string | null;
  avatar42: string;
  status: string;
  isAdmin: boolean;
  isOwner: boolean;
}
