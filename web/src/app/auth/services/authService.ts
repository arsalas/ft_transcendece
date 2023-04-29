
import { HttpService } from '../../../api/http'
import { IUser } from '../../../interfaces';


interface ISignin {
	token: string;
	user: IUser;
}

interface ITwoFactorAuth {
	twoFactorAuth: boolean;
	login: string;
	avatar42: string;

}


export class AuthService {
	constructor(private http: HttpService) { }


	async recoverSession() {
		try {
			return await this.http.get<ISignin>("/auth/recover-session")
		} catch (error) {
			throw new Error("error");
		}
	}

	async signIn(code: string) {
		try {
			return await this.http.get<ISignin & ITwoFactorAuth>("/auth/signin/" + code)

		} catch (error) {
			throw new Error("error");
		}
	}

	async confirmTFA({ token, login, avatar42 }: { token: string, login: string, avatar42: string }) {
		try {
			return await this.http.post<ISignin>("/auth/confirm-tfa", {token, login, avatar42 });
		} catch (error) {
			throw new Error("error");
		}
	}


}