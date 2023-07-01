import { HttpService } from '../../../api/http';
import { IAchivements } from '../../../interfaces';

export class AchivementsService {
  constructor(private http: HttpService) {}

  async get() {
    try {
      return await this.http.get<IAchivements>('/achivements');
    } catch (error) {
      throw new Error(error as string);
    }
  }

  
}
