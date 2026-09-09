import { CountryService } from "./country/country.service";
import { CityService } from "./city/city.service";
import { LanguageService } from "./language/language.service";
import { SearchService } from "./search/search.service";

const countryService = new CountryService();
const cityService = new CityService();
const languageService = new LanguageService();
const searchService = new SearchService();

console.log("====================================");
console.log("SENveBEN INTERNATIONAL SERVICE TEST");
console.log("====================================");

// -----------------------------------------------------
// 1. ÜLKE SERVİSİ
// -----------------------------------------------------

console.log("\n1 — ÜLKE SERVİSİ");

const countries = countryService.getAllCountries();

console.log("Toplam ülke:", countries.length);

console.log(
  countries
    .map((country) => `${country.flag} ${country.name.TR}`)
    .join(", "),
);

console.log(
  "DE Türkçe adı:",
  countryService.getCountryName("DE", "TR"),
);

console.log(
  "DE İngilizce adı:",
  countryService.getCountryName("DE", "EN"),
);

console.log(
  "TR geçerli mi?:",
  countryService.isValidCountryCode("TR"),
);

console.log(
  "XX geçerli mi?:",
  countryService.isValidCountryCode("XX"),
);

// -----------------------------------------------------
// 2. ŞEHİR SERVİSİ
// -----------------------------------------------------

console.log("\n2 — ŞEHİR SERVİSİ");

const turkeyCities = cityService.getCitiesByCountry("TR");
const germanyCities = cityService.getCitiesByCountry("DE");

console.log("Türkiye şehir sayısı:", turkeyCities.length);
console.log("Almanya şehir sayısı:", germanyCities.length);

console.log(
  "TR + Muğla geçerli mi?:",
  cityService.isValidCity("TR", "Muğla"),
);

console.log(
  "DE + Berlin geçerli mi?:",
  cityService.isValidCity("DE", "Berlin"),
);

console.log(
  "DE + Muğla geçerli mi?:",
  cityService.isValidCity("DE", "Muğla"),
);

// -----------------------------------------------------
// 3. DİL SERVİSİ
// -----------------------------------------------------

console.log("\n3 — DİL SERVİSİ");

console.log(
  "Toplam konuşulan dil:",
  languageService.getAllLanguages().length,
);

console.log(
  "tr geçerli mi?:",
  languageService.isValidLanguageCode("tr"),
);

console.log(
  "de geçerli mi?:",
  languageService.isValidLanguageCode("de"),
);

console.log(
  "uk geçerli mi?:",
  languageService.isValidLanguageCode("uk"),
);

console.log(
  "xx geçerli mi?:",
  languageService.isValidLanguageCode("xx"),
);

// -----------------------------------------------------
// 4. GEÇERLİ ULUSLARARASI ARAMA
// -----------------------------------------------------

console.log("\n4 — GEÇERLİ ULUSLARARASI ARAMA");

const validSearch = searchService.validateFilters({
  gender: "FEMALE",
  minAge: 35,
  maxAge: 50,
  countryCode: "DE",
  city: "Berlin",
  spokenLanguages: ["tr", "de"],
});

console.log(validSearch);

// -----------------------------------------------------
// 5. YANLIŞ ÜLKE / ŞEHİR
// -----------------------------------------------------

console.log("\n5 — YANLIŞ ÜLKE / ŞEHİR");

const wrongCity = searchService.validateFilters({
  minAge: 35,
  maxAge: 50,
  countryCode: "DE",
  city: "Muğla",
});

console.log(wrongCity);

// -----------------------------------------------------
// 6. ŞEHİR VAR / ÜLKE YOK
// -----------------------------------------------------

console.log("\n6 — ŞEHİR VAR / ÜLKE YOK");

const cityWithoutCountry = searchService.validateFilters({
  city: "Berlin",
});

console.log(cityWithoutCountry);

// -----------------------------------------------------
// 7. HATALI YAŞ
// -----------------------------------------------------

console.log("\n7 — HATALI YAŞ");

const invalidAge = searchService.validateFilters({
  minAge: 17,
  maxAge: 15,
});

console.log(invalidAge);

// -----------------------------------------------------
// 8. GEÇERSİZ KONUŞULAN DİL
// -----------------------------------------------------

console.log("\n8 — GEÇERSİZ KONUŞULAN DİL");

const invalidLanguage = searchService.validateFilters({
  countryCode: "DE",
  city: "Berlin",
  spokenLanguages: ["tr", "xx"],
});

console.log(invalidLanguage);

// -----------------------------------------------------
// 9. BOŞ DİL LİSTESİ
// -----------------------------------------------------

console.log("\n9 — BOŞ DİL LİSTESİ");

const emptyLanguages = searchService.validateFilters({
  countryCode: "TR",
  city: "Muğla",
  spokenLanguages: [],
});

console.log(emptyLanguages);

// -----------------------------------------------------
// 10. ÇOKLU DİL
// -----------------------------------------------------

console.log("\n10 — ÇOKLU DİL");

const multiLanguage = searchService.validateFilters({
  gender: "MALE",
  minAge: 40,
  maxAge: 60,
  countryCode: "TR",
  city: "Muğla",
  spokenLanguages: ["tr", "en", "de"],
});

console.log(multiLanguage);

console.log("\n====================================");
console.log("SERVICE TEST TAMAMLANDI");
console.log("====================================");