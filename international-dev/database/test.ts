import { COUNTRIES } from "./countries";
import { CITIES, getCitiesByCountry } from "./cities";
import {
  SPOKEN_LANGUAGES,
  getSpokenLanguageByCode,
} from "./languages";

console.log("====================================");
console.log("SENveBEN INTERNATIONAL TEST");
console.log("====================================");

console.log("\n1 — ÜLKE SAYISI");
console.log(COUNTRIES.length);

console.log("\n2 — TOPLAM ŞEHİR SAYISI");
console.log(CITIES.length);

console.log("\n3 — TÜRKİYE ŞEHİRLERİ");
const turkeyCities = getCitiesByCountry("TR");
console.log("Türkiye şehir sayısı:", turkeyCities.length);
console.log(turkeyCities.map((city) => city.name).join(", "));

console.log("\n4 — ALMANYA ŞEHİRLERİ");
const germanyCities = getCitiesByCountry("DE");
console.log(
  germanyCities.map((city) => city.name).join(", "),
);

console.log("\n5 — KONUŞULAN DİLLER");
console.log(
  SPOKEN_LANGUAGES.map(
    (language) => `${language.code} = ${language.name.TR}`,
  ).join(", "),
);

console.log("\n6 — UKRAYNACA DİL KODU TESTİ");
const ukrainian = getSpokenLanguageByCode("uk");
console.log(ukrainian);

console.log("\n7 — ÜLKE → ŞEHİR BAĞLANTI KONTROLÜ");

for (const country of COUNTRIES) {
  const cities = getCitiesByCountry(country.code);

  console.log(
    `${country.flag} ${country.name.TR} (${country.code}) → ${cities.length} şehir`,
  );
}

console.log("\n====================================");
console.log("TEST TAMAMLANDI");
console.log("====================================");