
import { HttpService } from '../../../api/http'
import { IProfile } from '../../../interfaces'

export class EditProfieService {
	constructor(private http: HttpService) { }


	async update(body: object) {
		try {
			return await this.http.put<IProfile>('/user', body)
		} catch (error) {
			throw new Error(error as string);
		}
	}


	async generateQRCode() {
		try {
			return await this.http.get<{ qr: string }>('/auth/generate-tfa')
		} catch (error) {
			throw new Error(error as string);
		}
	}

	async activateTFA(token: string) {
		try {
			return await this.http.post<{ qr: string }>('/auth/activate-tfa', { token })
		} catch (error) {
			throw new Error(error as string);
		}
	}

	async desactivateTFA(token: string) {
		try {
			return await this.http.post<{ qr: string }>('/auth/desactivate-tfa', { token })
		} catch (error) {
			throw new Error(error as string);
		}
	}
}