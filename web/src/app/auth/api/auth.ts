import { AxiosResponse } from 'axios';

import api from '../../../api/axios'
import { IUser } from '../../../interfaces';


interface ISignin {
	token?: string;
	user?: IUser;
	twoFactorAuth?: boolean;
	login?: string;
	avatar42?: string;
}
export const signIn = async (code: string) => {
	try {
		const { data } = await api.get<ISignin>("/auth/signin/" + code);
		console.log(data);
		return data
	} catch (error) {
		throw new Error("error");
	}

}
export const confirmTFA = async (token: string, login: string, avatar42: string) => {
	try {
		const { data } = await api.post<ISignin>("/auth/confirm-tfa", {token, login, avatar42 });
		console.log(data);
		return data
	} catch (error) {
		throw new Error("error");
	}

}
