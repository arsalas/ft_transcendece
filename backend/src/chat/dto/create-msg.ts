import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMsgDto {
  @IsString()
  @MinLength(1)
  readonly message: string;

  @IsString()
  @MinLength(1)
  readonly chatId: string;

  @IsString()
  @MinLength(1)
  readonly type: string;

  @IsString()
  @IsOptional()
  readonly reciverId?: string;
}
