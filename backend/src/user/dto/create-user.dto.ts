import { IsString, IsBoolean, MinLength } from 'class-validator';
import { UserStatus } from '../entities';

export class CreateUserDto {
  @IsString()
  readonly login: string;

  @IsString()
  @MinLength(4)
  readonly username: string;

  @IsString()
  readonly avatar: string;

  @IsString()
  readonly status: UserStatus;
}
