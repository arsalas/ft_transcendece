import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto';
import { Profile } from './entities';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User) private profileRepository: Repository<Profile>,
	) { }
	findOne(id: number) {
		return `This action returns a #${id} user`;
	}

	async updateUser(user42: string, updateUserDto: UpdateUserDto): Promise<Profile> {
		let profile: Profile = await this.profileRepository.findOneBy({ login: user42 });
		if (!profile) throw new HttpException("User not found", 404);
		try {
			profile = { ...profile, ...updateUserDto };
			return await this.profileRepository.save(profile);
		} catch (error) {
			console.log(error)
			throw new HttpException("Something is wrong", 500);
		}

	}

}
