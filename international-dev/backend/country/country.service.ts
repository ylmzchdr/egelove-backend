import { COUNTRIES } from "../../database/countries";
import type {
  Country,
  CountryCode,
  SupportedUiLanguage,
} from "./country.types";

export class CountryService {
  getAllCountries(): Country[] {
    return COUNTRIES as Country[];
  }

  getCountryByCode(code: string): Country | undefined {
    const normalizedCode = code.toUpperCase() as CountryCode;

    return (COUNTRIES as Country[]).find(
      (country) => country.code === normalizedCode,
    );
  }

  getCountryName(
    code: string,
    language: SupportedUiLanguage = "TR",
  ): string | undefined {
    const country = this.getCountryByCode(code);

    return country?.name[language];
  }

  isValidCountryCode(code: string): boolean {
    return this.getCountryByCode(code) !== undefined;
  }
}