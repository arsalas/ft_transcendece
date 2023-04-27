export interface IUser {
	login: string,
	avatar42: string,
	username: string | undefined,
	avatar: string | undefined,
	twoFactorAuth: boolean,
	status: string
}