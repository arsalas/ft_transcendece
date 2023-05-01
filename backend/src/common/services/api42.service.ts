import { firstValueFrom } from 'rxjs';

import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { IOauth, IUser42 } from '../interfaces';

@Injectable()
export class Api42Service {
	private readonly url = 'https://api.intra.42.fr';
	private readonly clientId = process.env.CLIENT_ID;
	private readonly clientSecret = process.env.CLIENT_SECRET;
	private readonly redirectUri = 'http://localhost:5173/auth/confirm';

	constructor(private readonly httpService: HttpService) { }

	/**
	 * Hace signin a la api de 42
	 * @param code
	 * @returns el usuario de 42
	 */
	async signIn(code: string): Promise<IUser42> {
		// Pedir a la api de 42 que identifique al usuario
		try {
			const { data } = await firstValueFrom(
				this.httpService.post<IOauth>(this.url + '/oauth/token', {
					client_id: this.clientId,
					grant_type: 'authorization_code',
					client_secret: this.clientSecret,
					code, // su valor va a ser el mismo que la variable
					redirect_uri: this.redirectUri,
				}),
			);
			const { data: newData } = await firstValueFrom(
				this.httpService.get<IUser42>(this.url + '/v2/me', {
					headers: { Authorization: 'Bearer ' + data.access_token },
				}),
			);
			const { data: moreData } = await firstValueFrom(
				this.httpService.get<IUser42>(this.url + `/v2/users/${newData.id}/coalitions`, {
					headers: { Authorization: 'Bearer ' + data.access_token },
				}),
			);

			console.log(moreData)
			return newData;
		} catch (error) {
			throw new HttpException('ERROR', 403);
		}
	}
}
