import type { CountryCode } from "../country/country.types";
import { CountryService } from "../country/country.service";
import { CityService } from "../city/city.service";
import { LanguageService } from "../language/language.service";
import type { SearchFilters } from "./search.types";

export type SearchValidationResult = {
  valid: boolean;
  errors: string[];
};

export class SearchService {
  private readonly countryService = new CountryService();
  private readonly cityService = new CityService();
  private readonly languageService = new LanguageService();

  validateFilters(filters: SearchFilters): SearchValidationResult {
    const errors: string[] = [];

    // -----------------------------------------------------
    // YAŞ KONTROLLERİ
    // -----------------------------------------------------

    if (
      filters.minAge !== undefined &&
      (filters.minAge < 18 || filters.minAge > 100)
    ) {
      errors.push("Minimum yaş 18 ile 100 arasında olmalıdır.");
    }

    if (
      filters.maxAge !== undefined &&
      (filters.maxAge < 18 || filters.maxAge > 100)
    ) {
      errors.push("Maksimum yaş 18 ile 100 arasında olmalıdır.");
    }

    if (
      filters.minAge !== undefined &&
      filters.maxAge !== undefined &&
      filters.minAge > filters.maxAge
    ) {
      errors.push("Minimum yaş maksimum yaştan büyük olamaz.");
    }

    // -----------------------------------------------------
    // ÜLKE KONTROLÜ
    // -----------------------------------------------------

    if (
      filters.countryCode &&
      !this.countryService.isValidCountryCode(filters.countryCode)
    ) {
      errors.push("Geçersiz ülke kodu.");
    }

    // -----------------------------------------------------
    // ŞEHİR KONTROLÜ
    // -----------------------------------------------------

    if (filters.city && !filters.countryCode) {
      errors.push("Şehir filtresi için önce ülke seçilmelidir.");
    }

    if (
      filters.city &&
      filters.countryCode &&
      this.countryService.isValidCountryCode(filters.countryCode)
    ) {
      const countryCode = filters.countryCode as CountryCode;

      if (!this.cityService.isValidCity(countryCode, filters.city)) {
        errors.push("Seçilen şehir bu ülkeye ait değildir.");
      }
    }

    // -----------------------------------------------------
    // KONUŞULAN DİL KONTROLÜ
    // -----------------------------------------------------

    if (filters.spokenLanguages !== undefined) {
      if (filters.spokenLanguages.length === 0) {
        errors.push("Konuşulan dil filtresi boş olamaz.");
      } else {
        const invalidLanguages = filters.spokenLanguages.filter(
          (code) => !this.languageService.isValidLanguageCode(code),
        );

        if (invalidLanguages.length > 0) {
          errors.push(
            `Geçersiz konuşulan dil kodu: ${invalidLanguages.join(", ")}`,
          );
        }
      }
    }

    // -----------------------------------------------------
    // SONUÇ
    // -----------------------------------------------------

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}