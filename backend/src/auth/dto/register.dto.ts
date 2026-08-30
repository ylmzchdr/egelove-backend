import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsInt,
  IsPositive,
} from "class-validator";

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(3)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsInt()
  cityId?: number;

  @IsOptional()
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}
