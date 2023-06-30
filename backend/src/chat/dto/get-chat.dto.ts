import { IsOptional, IsString, MinLength } from 'class-validator';

export class GetChatDto {
  @IsString()
  @MinLength(1)
  readonly chatId: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly password: string;
}
