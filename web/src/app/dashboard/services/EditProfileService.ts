
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
}