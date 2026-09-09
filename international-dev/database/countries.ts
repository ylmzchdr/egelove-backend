export type Country = {
  code: string;
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
      EN: "Türkiye",
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
    code: "NL",
    name: {
      TR: "Hollanda",
      EN: "Netherlands",
      RU: "Нидерланды",
      AR: "هولندا",
    },
    flag: "🇳🇱",
  },
  {
    code: "FR",
    name: {
      TR: "Fransa",
      EN: "France",
      RU: "Франция",
      AR: "فرنسا",
    },
    flag: "🇫🇷",
  },
  {
    code: "BE",
    name: {
      TR: "Belçika",
      EN: "Belgium",
      RU: "Бельгия",
      AR: "بلجيكا",
    },
    flag: "🇧🇪",
  },
  {
    code: "AT",
    name: {
      TR: "Avusturya",
      EN: "Austria",
      RU: "Австрия",
      AR: "النمسا",
    },
    flag: "🇦🇹",
  },
  {
    code: "CH",
    name: {
      TR: "İsviçre",
      EN: "Switzerland",
      RU: "Швейцария",
      AR: "سويسرا",
    },
    flag: "🇨🇭",
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
];