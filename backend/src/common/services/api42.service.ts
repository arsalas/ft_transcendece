import { firstValueFrom } from 'rxjs';

import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { Coallition, IAuth42, IOauth, IUser42 } from '../interfaces';

@Injectable()
export class Api42Service {
	private readonly url = 'https://api.intra.42.fr';
	private readonly clientId = process.env.CLIENT_ID;
	private readonly clientSecret = process.env.CLIENT_SECRET;
	private readonly redirectUri = 'http://localhost:5173/auth/confirm';
	private access_token = '';

	constructor(private readonly httpService: HttpService) { }


	/**
	 * Obtiene la informacion de la coalicion del usuario
	 * @param id 
	 * @returns 
	 */
	async getCoallition(id: number): Promise<Coallition[]> {
		const { data } = await firstValueFrom(
			this.httpService.get<Coallition[]>(this.url + `/v2/users/${id}/coalitions`, {
				headers: { Authorization: 'Bearer ' + this.access_token },
			}),
		);
		return data
	}

	/**
	 * Obtiene los datos del usuario
	 * @returns 
	 */
	async getIdentity(): Promise<IUser42> {
		const { data } = await firstValueFrom(
			this.httpService.get<IUser42>(this.url + '/v2/me', {
				headers: { Authorization: 'Bearer ' + this.access_token },
			}),
		);
		return data
	}

	async auth(code: string) {
		const { data } = await firstValueFrom(
			this.httpService.post<IOauth>(this.url + '/oauth/token', {
				client_id: this.clientId,
				grant_type: 'authorization_code',
				client_secret: this.clientSecret,
				code, // su valor va a ser el mismo que la variable
				redirect_uri: this.redirectUri,
			}),
		);
		return data;
	}

	/**
	 * Hace signin a la api de 42
	 * @param code
	 * @returns el usuario de 42
	 */
	async signIn(code: string): Promise<IAuth42> {
		// Pedir a la api de 42 que identifique al usuario
		try {

			const auth = await this.auth(code);
			this.access_token = auth.access_token
			const profile = await this.getIdentity()
			const [coallition] = await this.getCoallition(profile.id)
			return {
				login: profile.login,
				avatar42: profile.image.link,
				coallition: coallition.slug,
				icon: coallition.image_url,
				background: coallition.cover_url,
				color: coallition.color,

			};
		} catch (error) {
			throw new HttpException('ERROR', 403);
		}
	}
}
