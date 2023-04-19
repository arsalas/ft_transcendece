import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class UserService {


  async signIn(code: string) {
    try {

      // 1 - Pedir ala api de 42 que identifique al usuario
      const body = {
        client_id: "u-s4t2ud-002f8307ed61fa03609f72d495d3a6e7efe6c446b08744c9b33e4ea27e613829",
        grant_type: "authorization_code",
        client_secret: "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",
        code, // su valor va a ser el mismo que la variable
        redirect_uri: "http://localhost"
      }
      console.log(body)
      const response:Axios<IOauth> = await axios.post("https://api.intra.42.fr/oauth/token", body);
      console.log(response)
    } catch (error) {
      console.log("ERROR");
      // console.log({error});
    }

    // 2 - Buscar en nuestra BBDD si existe el usuario
    // 3a - Si existe devolver el usuario
    // 3b - Crear un nuevo usuario

  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }


}
