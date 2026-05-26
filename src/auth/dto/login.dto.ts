import { IsString, MinLength, IsOptional } from "class-validator";

export class LoginDto {
  @IsString()
  emailOrPhone: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  twoFactorToken?: string;
}
