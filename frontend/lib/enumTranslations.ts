export const enumTR: Record<string, string> = {
  PRIMARY: "İlkokul",
  SECONDARY: "Ortaokul",
  HIGH_SCHOOL: "Lise",
  ASSOCIATE: "Ön Lisans",
  BACHELOR: "Lisans",
  MASTER: "Yüksek Lisans",
  DOCTORATE: "Doktora",

  VERY_LOW: "Çok Düşük",
  LOW: "Düşük",
  MEDIUM: "Orta",
  HIGH: "Yüksek",
  VERY_HIGH: "Çok Yüksek",

  NEVER_MARRIED: "Hiç Evlenmedi",
  DIVORCED: "Boşanmış",
  WIDOWED: "Dul",
  SEPARATED: "Ayrı Yaşıyor",

  HAS_LIVING_WITH: "Var, Yanımda",
  HAS_NOT_LIVING: "Var, Yanımda Değil",
  NONE: "Yok",

  VERY_RELIGIOUS: "Çok Dindar",
  RELIGIOUS: "Dindar",
  MODERATE: "Orta",
  NOT_RELIGIOUS: "Dindar Değil",
  ATHEIST: "Ateist",

  NEVER: "Hiç",
  QUIT: "Bıraktı",
  OCCASIONAL: "Ara Sıra",
  REGULAR: "Düzenli",

  SLIM: "Zayıf",
  ATHLETIC: "Atletik",
  NORMAL: "Normal",
  CURVY: "Balık Etli",
  PLUS: "Kilolu",

  BROWN: "Kahverengi",
  BLUE: "Mavi",
  GREEN: "Yeşil",
  HAZEL: "Ela",
  BLACK: "Siyah",
  OTHER: "Diğer",

  BLOND: "Sarı",
  RED: "Kızıl",
  WHITE: "Beyaz",
  BALD: "Kel",

  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  ZERO_POSITIVE: "0+",
  ZERO_NEGATIVE: "0-",
};

export function enumLabel(value?: string | null) {
  if (!value) return "-";
  return enumTR[value] || value;
}