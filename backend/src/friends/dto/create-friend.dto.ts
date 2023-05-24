import { IsString, MinLength } from 'class-validator';

export class CreateFriendDto {
  @IsString()
  @MinLength(1)
  readonly reciverId: string;
}
