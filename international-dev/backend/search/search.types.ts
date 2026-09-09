import type { CountryCode } from "../country/country.types";

export type GenderFilter = "MALE" | "FEMALE";

export type SearchFilters = {
  gender?: GenderFilter;

  minAge?: number;
  maxAge?: number;

  countryCode?: CountryCode;

  city?: string;

  spokenLanguages?: string[];
};