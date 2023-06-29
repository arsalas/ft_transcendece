import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateChatDto {
	@IsString()
	@MinLength(1)
	readonly name: string;

	@IsString()
  	@MinLength(1)
  	readonly type: string;

	@IsString()
  	@MinLength(1)
	@IsOptional()
  	readonly password: string;
}
