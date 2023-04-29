import { PartialType } from '@nestjs/mapped-types';
import { IsString, MinLength, IsOptional } from 'class-validator';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}
export class UpdateUserDto {

	@IsOptional()
	@IsString()
	@MinLength(4)
	readonly username: string;
	
	@IsOptional()
	@IsString()
	readonly avatar: string;
	
	@IsOptional()
	@IsString()
	readonly status: string;
}

