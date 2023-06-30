import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';
import { IsUUID, MinLength } from 'class-validator';

export class UpdateChatDto extends PartialType(CreateChatDto) {
	@IsUUID()
	@MinLength(1)
	id:string;
}
