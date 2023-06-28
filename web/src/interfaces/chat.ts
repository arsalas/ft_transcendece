export interface IChat {
  message: string;
  isRead: boolean;
  createdAt: Date;
  userId: string;
}




export enum EChatType {
	Direct = 'direct',
	Private = 'private',
	Protected = 'protected'
}
