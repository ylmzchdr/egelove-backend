import { IsEmail, IsString, MinLength, IsEnum, IsDateString, IsOptional } from "class-validator";
import { Gender } from "@prisma/client";

export class RegisterDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  surname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsDateString()
  birthDate: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  turnstileToken: string;
}
