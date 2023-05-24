import { IsString, MinLength } from 'class-validator';

export class UnfriendDto {
  @IsString()
  @MinLength(1)
  readonly userId: string;
}
