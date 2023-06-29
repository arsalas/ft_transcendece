import { IsString, MinLength, IsOptional } from 'class-validator';

export class AddUserDto {
  @IsString()
  @MinLength(1)
  readonly userId: string;

  @IsString()
  @MinLength(1)
  readonly chatId: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  readonly password: string;
}