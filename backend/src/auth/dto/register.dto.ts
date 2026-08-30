import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsInt,
  IsDateString,
  IsIn,
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

  @IsInt()
  cityId!: number;

  @IsInt()
  districtId!: number;

  @IsDateString()
  birthDate!: string;

  @IsIn(["MALE", "FEMALE", "OTHER"])
  gender!: "MALE" | "FEMALE" | "OTHER";

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}