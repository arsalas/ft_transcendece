// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

import { IsString, IsBoolean, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {

	@IsOptional()
	@IsString()
	readonly username: string;

	@IsOptional()
	@IsString()
	readonly avatar: string;

	@IsOptional()
	@IsString()
	readonly status: string;
}
