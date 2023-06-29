import { IsString, MinLength, IsOptional, IsDate, MinDate } from 'class-validator';

export class ModifyUserDto {
  @IsString()
  @MinLength(1)
  readonly chatId: string;

  @IsString()
  @MinLength(1)
  readonly userId: string;

  @IsDate()
  @IsOptional()
  @MinDate(new Date())
  readonly time: Date;
  
}