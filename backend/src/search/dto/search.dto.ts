import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import {
  AlcoholStatus,
  BodyType,
  ChildrenStatus,
  EducationLevel,
  Gender,
  IncomeLevel,
  MaritalStatus,
  ReligionLevel,
  SmokingStatus,
} from "@prisma/client";

export class SearchDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cityId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  districtId?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  @Max(99)
  minAge?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(18)
  @Max(99)
  maxAge?: number;

  @IsOptional()
  @IsEnum(EducationLevel)
  education?: EducationLevel;

  @IsOptional()
  @IsEnum(SmokingStatus)
  smoking?: SmokingStatus;

  @IsOptional()
  @IsEnum(AlcoholStatus)
  alcohol?: AlcoholStatus;

  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsEnum(ChildrenStatus)
  children?: ChildrenStatus;

  @IsOptional()
  @IsEnum(ReligionLevel)
  religion?: ReligionLevel;

  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType;

  @IsOptional()
  @IsEnum(IncomeLevel)
  income?: IncomeLevel;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(250)
  minHeight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(100)
  @Max(250)
  maxHeight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(30)
  @Max(300)
  minWeight?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(30)
  @Max(300)
  maxWeight?: number;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  online?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  premium?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  verified?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasPhoto?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isNewMember?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit = 20;
}