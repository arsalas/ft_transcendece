import { IsString, IsBoolean,MinLength } from 'class-validator';

export class ActivateTFADto {

	@IsString()
	readonly token: string;

}
