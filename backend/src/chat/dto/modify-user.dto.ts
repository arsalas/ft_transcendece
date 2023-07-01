import { IsString, MinLength, IsOptional, IsDate, MinDate, IsNumber, Min } from 'class-validator';

export class ModifyUserDto {
  @IsString()
  @MinLength(1)
  readonly chatId: string;

  @IsString()
  @MinLength(1)
  readonly userId: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  readonly time: number;
  
}