import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import { Repository } from 'typeorm';
import { User, Profile } from '../user/entities';
import { IOauth, IUser42 } from './interfaces';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {

	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Profile) private profileRepository: Repository<Profile>,
		private jwtService: JwtService
	) { }

	private async signIn42(code: string): Promise<IUser42> {
		// 1 - Pedir a la api de 42 que identifique al usuario
		try {
			const body = {
				client_id: "u-s4t2ud-002f8307ed61fa03609f72d495d3a6e7efe6c446b08744c9b33e4ea27e613829",
				grant_type: "authorization_code",
				client_secret: "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",
				code, // su valor va a ser el mismo que la variable
				redirect_uri: "http://localhost:5173/auth/confirm"
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
		// Intentamos hacer el signIn
		try {
			const user42 = await this.signIn42(code);
			let user: User = await this.userRepository.findOneBy({ login: user42.login });
			// Si no existe el usuario, se indica y se crea
			if (!user) {
				console.log("no existe usuario");
				const userRepo = this.userRepository.create({
					login: user42.login
				})
				const profileRepo = this.profileRepository.create({
					login: user42.login,

				})
				user = await this.userRepository.save(userRepo);
				const profile = await this.profileRepository.save(profileRepo);
			}
			// Tanto si existe el usuario como si se ha creado de nuevo, creamos el payload y el token
			const payload = { name: user.login };
			const token = this.jwtService.sign(payload);
			const profile: Profile = await this.profileRepository.findOneBy({ login: user42.login });
			return {
				token,
				user: {
					login: user.login,
					avatar42: user42.image.link,
					username: profile.username,
					avatar: profile.avatar,
					tfa: profile.tfa,
					status: profile.status
				}
			}
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
