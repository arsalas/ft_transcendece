
import { HttpService } from '../../../api/http'

export class EditProfieService {
    constructor(private http: HttpService) { }


    async update(body: object) {
        try {
            const resp = await this.http.put('/user', body)

        } catch (error) {

        }
    }

}