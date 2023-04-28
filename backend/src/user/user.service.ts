import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto';
import { Profile } from './entities';

@Injectable()
export class UserService {

	constructor(
		@InjectRepository(Profile) private profileRepository: Repository<Profile>,
	) { }
	findOne(id: number) {
		return `This action returns a #${id} user`;
	}

	async updateUser(user42: string, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<Profile> {
		let profile: Profile = await this.profileRepository.findOneBy({ login: user42 });
		if (!profile) throw new HttpException("User not found", 404);
		try {
			profile = { ...profile, ...updateUserDto };
			if (file)
				profile.avatar = file.filename;
			const res = await this.profileRepository.update({ login: user42 }, profile);
			// "generatedMaps": [],
			// "raw": [],
			// "affected": 1
			return profile;
		} catch (error) {
			console.log(error)
			throw new HttpException("Something is wrong", 500);
		}

	}

}
