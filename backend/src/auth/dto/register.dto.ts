import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsInt,
  IsDateString,
  IsIn,
  Min,
  Max,
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

  @IsOptional()
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsInt()
  @Min(18)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsIn(["MALE", "FEMALE", "OTHER"])
  gender?: "MALE" | "FEMALE" | "OTHER";

  @IsOptional()
  @IsIn(["MALE", "FEMALE"])
  seekingGender?: "MALE" | "FEMALE";

  @IsOptional()
  @IsString()
  turnstileToken?: string;
}
