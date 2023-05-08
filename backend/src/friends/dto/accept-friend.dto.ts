import { IsString, MinLength } from 'class-validator';

export class AcceptFriendDto {
  @IsString()
  @MinLength(1)
  readonly senderId: string;
}
