import { IsString, IsBoolean,MinLength } from 'class-validator';

export class CreateUserDto {

	@IsString()
	readonly login: string;

	@IsString()
	@MinLength(4)
	readonly username: string;

	@IsBoolean()
	readonly twoFactorAuth: boolean;

	@IsString()
	readonly avatar: string;

	@IsString()
	readonly status: string;
}
