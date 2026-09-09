import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsInt,
  IsDateString,
  IsIn,
  IsArray,
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
  @IsOptional()
  countryId?: number;

  @IsInt()
  cityId!: number;

  @IsInt()
  districtId!: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  spokenLanguages?: string[];

  @IsDateString()
  birthDate!: string;

  @IsIn(["MALE", "FEMALE", "OTHER"])
  gender!: "MALE" | "FEMALE" | "OTHER";

  @IsIn(["MALE", "FEMALE"])
  seekingGender!: "MALE" | "FEMALE";

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}