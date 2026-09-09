import {
  SPOKEN_LANGUAGES,
  type SpokenLanguage,
} from "../../database/languages";

export class LanguageService {
  getAllLanguages(): SpokenLanguage[] {
    return SPOKEN_LANGUAGES;
  }

  getLanguageByCode(code: string): SpokenLanguage | undefined {
    const normalizedCode = code.trim().toLowerCase();

    return SPOKEN_LANGUAGES.find(
      (language) => language.code === normalizedCode,
    );
  }

  isValidLanguageCode(code: string): boolean {
    return this.getLanguageByCode(code) !== undefined;
  }

  validateLanguageCodes(codes: string[]): boolean {
    return codes.every(
      (code) =>
        code.trim().length > 0 &&
        this.isValidLanguageCode(code),
    );
  }
}