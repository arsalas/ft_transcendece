export interface IOauth {
	access_token: string;
	token_type: string;
	expires_in: number;
	refresh_token: string;
	scope: string;
	created_at: number;
}

export interface IAuth42 {

	login: string,
	avatar42: string,
	coallition: string,
	icon: string,
	background: string,
	color: string,
}