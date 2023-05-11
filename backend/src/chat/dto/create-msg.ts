import { IsString, MinLength } from 'class-validator';

export class CreateMsgDto {
  @IsString()
  @MinLength(1)
  readonly message: string;
}
