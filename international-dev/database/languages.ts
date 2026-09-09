export type SpokenLanguage = {
  code: string;
  name: {
    TR: string;
    EN: string;
    RU: string;
    AR: string;
  };
};

export const SPOKEN_LANGUAGES: SpokenLanguage[] = [
  {
    code: "tr",
    name: {
      TR: "Türkçe",
      EN: "Turkish",
      RU: "Турецкий",
      AR: "التركية",
    },
  },
  {
    code: "en",
    name: {
      TR: "İngilizce",
      EN: "English",
      RU: "Английский",
      AR: "الإنجليزية",
    },
  },
  {
    code: "de",
    name: {
      TR: "Almanca",
      EN: "German",
      RU: "Немецкий",
      AR: "الألمانية",
    },
  },
  {
    code: "ru",
    name: {
      TR: "Rusça",
      EN: "Russian",
      RU: "Русский",
      AR: "الروسية",
    },
  },
  {
    code: "ar",
    name: {
      TR: "Arapça",
      EN: "Arabic",
      RU: "Арабский",
      AR: "العربية",
    },
  },
  {
    code: "fr",
    name: {
      TR: "Fransızca",
      EN: "French",
      RU: "Французский",
      AR: "الفرنسية",
    },
  },
  {
    code: "nl",
    name: {
      TR: "Felemenkçe",
      EN: "Dutch",
      RU: "Нидерландский",
      AR: "الهولندية",
    },
  },
  {
    code: "az",
    name: {
      TR: "Azerbaycanca",
      EN: "Azerbaijani",
      RU: "Азербайджанский",
      AR: "الأذربيجانية",
    },
  },
  {
    code: "uk",
    name: {
      TR: "Ukraynaca",
      EN: "Ukrainian",
      RU: "Украинский",
      AR: "الأوكرانية",
    },
  },
];

export function getSpokenLanguageByCode(
  code: string,
): SpokenLanguage | undefined {
  return SPOKEN_LANGUAGES.find(
    (language) => language.code === code.toLowerCase(),
  );
}