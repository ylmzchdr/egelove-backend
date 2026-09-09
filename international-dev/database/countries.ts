export type CountryCode =
  | "TR"
  | "DE"
  | "GB"
  | "RU"
  | "UA"
  | "AZ";

export type Country = {
  code: CountryCode;
  name: {
    TR: string;
    EN: string;
    RU: string;
    AR: string;
  };
  flag: string;
};

export const COUNTRIES: Country[] = [
  {
    code: "TR",
    name: {
      TR: "Türkiye",
      EN: "Turkey",
      RU: "Турция",
      AR: "تركيا",
    },
    flag: "🇹🇷",
  },
  {
    code: "DE",
    name: {
      TR: "Almanya",
      EN: "Germany",
      RU: "Германия",
      AR: "ألمانيا",
    },
    flag: "🇩🇪",
  },
  {
    code: "GB",
    name: {
      TR: "İngiltere",
      EN: "United Kingdom",
      RU: "Великобритания",
      AR: "المملكة المتحدة",
    },
    flag: "🇬🇧",
  },
  {
    code: "RU",
    name: {
      TR: "Rusya",
      EN: "Russia",
      RU: "Россия",
      AR: "روسيا",
    },
    flag: "🇷🇺",
  },
  {
    code: "UA",
    name: {
      TR: "Ukrayna",
      EN: "Ukraine",
      RU: "Украина",
      AR: "أوكرانيا",
    },
    flag: "🇺🇦",
  },
  {
    code: "AZ",
    name: {
      TR: "Azerbaycan",
      EN: "Azerbaijan",
      RU: "Азербайджан",
      AR: "أذربيجان",
    },
    flag: "🇦🇿",
  },
];

export function getCountryByCode(
  code: string,
): Country | undefined {
  return COUNTRIES.find(
    (country) =>
      country.code === code.toUpperCase(),
  );
}