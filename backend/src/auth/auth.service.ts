import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { IOauth, IUser42 } from './interfaces';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {

	constructor(@InjectRepository(User) private userRepository: Repository<User>, private jwtService: JwtService) { }

	private async signIn42(code: string):Promise<IUser42> {
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

			const response: AxiosResponse<IOauth> = await axios.post("https://api.intra.42.fr/oauth/token", body);
			const data = response.data;
			const resp: AxiosResponse<IUser42> = await axios.get("https://api.intra.42.fr/v2/me", { headers: { Authorization: "Bearer " + data.access_token } })
			
			return resp.data;
		}
		catch (error) {
			throw new HttpException('ERROR', 403) 
		}
	}

	async signIn(code: string) {
		try {
			const user42 = await this.signIn42(code);
			let user = await this.userRepository.findOneBy({ login: user42.login });
			// no existe el usuario
			if (!user) {
				// TODO habra que crear todos los registros de todas las tablas del usuario con una transaccion
				console.log("no existe usuario");
				const userRepo = this.userRepository.create({
					login: user42.login
				})
				user = await this.userRepository.save(userRepo);
			}
			//existe el usuario
			const payload = { id: user.id, name: user.login };
			const token = this.jwtService.sign(payload);
			return {token, user}


		} catch (error) {
			console.log("ERROR");
			console.log(error);
			console.log(error.response.data);
			throw new HttpException('ERROR', 403) // TODO poner codigo correcto
		}


	}

	findOne(id: number) {
		return `This action returns a #${id} user`;
	}


}
