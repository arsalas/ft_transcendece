import {
  IsString,
  IsBoolean,
  MinLength,
  IsAlphanumeric,
} from 'class-validator';

export class ConfirmTFADto {
  @IsString()
  readonly token: string;

  @IsString()
  readonly login: string;

  @IsString()
  readonly avatar42: string;
}
