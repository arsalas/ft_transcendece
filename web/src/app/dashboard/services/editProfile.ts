
import { HttpService } from '../../../api/http'

export class editProfieService {
    constructor(private http: HttpService) { }


    async update(body: object) {
        try {
            const resp = await this.http.put('/user', body)

        } catch (error) {

        }
    }

}