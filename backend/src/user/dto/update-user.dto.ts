import {
  IsString, IsOptional, IsEnum, IsInt, IsArray, IsDateString,
  MinLength, MaxLength, Min, Max, IsObject, IsBoolean,
} from "class-validator";
import {
  Gender, EducationLevel, IncomeLevel, ReligionLevel,
  SmokingStatus, AlcoholStatus, ChildrenStatus, BodyType,
  EyeColor, HairColor, BloodType, MaritalStatus,
} from "@prisma/client";

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  surname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsInt()
  @IsOptional()
  cityId?: number;

  @IsInt()
  @IsOptional()
  districtId?: number;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  bio?: string;

  @IsString()
  @MaxLength(2000)
  @IsOptional()
  aboutMe?: string;

  @IsString()
  @MaxLength(2000)
  @IsOptional()
  lookingFor?: string;

  @IsEnum(EducationLevel)
  @IsOptional()
  education?: EducationLevel;

  @IsEnum(IncomeLevel)
  @IsOptional()
  income?: IncomeLevel;

  @IsEnum(ReligionLevel)
  @IsOptional()
  religion?: ReligionLevel;

  @IsEnum(SmokingStatus)
  @IsOptional()
  smoking?: SmokingStatus;

  @IsEnum(AlcoholStatus)
  @IsOptional()
  alcohol?: AlcoholStatus;

  @IsEnum(ChildrenStatus)
  @IsOptional()
  children?: ChildrenStatus;

  @IsEnum(BodyType)
  @IsOptional()
  bodyType?: BodyType;

  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @IsInt()
  @Min(100)
  @Max(250)
  @IsOptional()
  height?: number;

  @IsInt()
  @Min(30)
  @Max(300)
  @IsOptional()
  weight?: number;

  @IsEnum(EyeColor)
  @IsOptional()
  eyeColor?: EyeColor;

  @IsEnum(HairColor)
  @IsOptional()
  hairColor?: HairColor;

  @IsEnum(BloodType)
  @IsOptional()
  bloodType?: BloodType;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  hobbies?: string[];

  @IsObject()
  @IsOptional()
  privacySettings?: Record<string, boolean>;

  @IsObject()
  @IsOptional()
  matchingPreferences?: Record<string, any>;
}
