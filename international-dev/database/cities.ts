export type City = {
  countryCode: string;
  name: string;
};

export const CITIES: City[] = [
  // =====================================================
  // TÜRKİYE — 81 İL
  // =====================================================
  { countryCode: "TR", name: "Adana" },
  { countryCode: "TR", name: "Adıyaman" },
  { countryCode: "TR", name: "Afyonkarahisar" },
  { countryCode: "TR", name: "Ağrı" },
  { countryCode: "TR", name: "Aksaray" },
  { countryCode: "TR", name: "Amasya" },
  { countryCode: "TR", name: "Ankara" },
  { countryCode: "TR", name: "Antalya" },
  { countryCode: "TR", name: "Ardahan" },
  { countryCode: "TR", name: "Artvin" },
  { countryCode: "TR", name: "Aydın" },
  { countryCode: "TR", name: "Balıkesir" },
  { countryCode: "TR", name: "Bartın" },
  { countryCode: "TR", name: "Batman" },
  { countryCode: "TR", name: "Bayburt" },
  { countryCode: "TR", name: "Bilecik" },
  { countryCode: "TR", name: "Bingöl" },
  { countryCode: "TR", name: "Bitlis" },
  { countryCode: "TR", name: "Bolu" },
  { countryCode: "TR", name: "Burdur" },
  { countryCode: "TR", name: "Bursa" },
  { countryCode: "TR", name: "Çanakkale" },
  { countryCode: "TR", name: "Çankırı" },
  { countryCode: "TR", name: "Çorum" },
  { countryCode: "TR", name: "Denizli" },
  { countryCode: "TR", name: "Diyarbakır" },
  { countryCode: "TR", name: "Düzce" },
  { countryCode: "TR", name: "Edirne" },
  { countryCode: "TR", name: "Elazığ" },
  { countryCode: "TR", name: "Erzincan" },
  { countryCode: "TR", name: "Erzurum" },
  { countryCode: "TR", name: "Eskişehir" },
  { countryCode: "TR", name: "Gaziantep" },
  { countryCode: "TR", name: "Giresun" },
  { countryCode: "TR", name: "Gümüşhane" },
  { countryCode: "TR", name: "Hakkari" },
  { countryCode: "TR", name: "Hatay" },
  { countryCode: "TR", name: "Iğdır" },
  { countryCode: "TR", name: "Isparta" },
  { countryCode: "TR", name: "İstanbul" },
  { countryCode: "TR", name: "İzmir" },
  { countryCode: "TR", name: "Kahramanmaraş" },
  { countryCode: "TR", name: "Karabük" },
  { countryCode: "TR", name: "Karaman" },
  { countryCode: "TR", name: "Kars" },
  { countryCode: "TR", name: "Kastamonu" },
  { countryCode: "TR", name: "Kayseri" },
  { countryCode: "TR", name: "Kırıkkale" },
  { countryCode: "TR", name: "Kırklareli" },
  { countryCode: "TR", name: "Kırşehir" },
  { countryCode: "TR", name: "Kilis" },
  { countryCode: "TR", name: "Kocaeli" },
  { countryCode: "TR", name: "Konya" },
  { countryCode: "TR", name: "Kütahya" },
  { countryCode: "TR", name: "Malatya" },
  { countryCode: "TR", name: "Manisa" },
  { countryCode: "TR", name: "Mardin" },
  { countryCode: "TR", name: "Mersin" },
  { countryCode: "TR", name: "Muğla" },
  { countryCode: "TR", name: "Muş" },
  { countryCode: "TR", name: "Nevşehir" },
  { countryCode: "TR", name: "Niğde" },
  { countryCode: "TR", name: "Ordu" },
  { countryCode: "TR", name: "Osmaniye" },
  { countryCode: "TR", name: "Rize" },
  { countryCode: "TR", name: "Sakarya" },
  { countryCode: "TR", name: "Samsun" },
  { countryCode: "TR", name: "Siirt" },
  { countryCode: "TR", name: "Sinop" },
  { countryCode: "TR", name: "Sivas" },
  { countryCode: "TR", name: "Şanlıurfa" },
  { countryCode: "TR", name: "Şırnak" },
  { countryCode: "TR", name: "Tekirdağ" },
  { countryCode: "TR", name: "Tokat" },
  { countryCode: "TR", name: "Trabzon" },
  { countryCode: "TR", name: "Tunceli" },
  { countryCode: "TR", name: "Uşak" },
  { countryCode: "TR", name: "Van" },
  { countryCode: "TR", name: "Yalova" },
  { countryCode: "TR", name: "Yozgat" },
  { countryCode: "TR", name: "Zonguldak" },

  // =====================================================
  // ALMANYA
  // =====================================================
  { countryCode: "DE", name: "Berlin" },
  { countryCode: "DE", name: "Hamburg" },
  { countryCode: "DE", name: "München" },
  { countryCode: "DE", name: "Köln" },
  { countryCode: "DE", name: "Frankfurt" },
  { countryCode: "DE", name: "Stuttgart" },
  { countryCode: "DE", name: "Düsseldorf" },
  { countryCode: "DE", name: "Dortmund" },
  { countryCode: "DE", name: "Essen" },
  { countryCode: "DE", name: "Bremen" },
  { countryCode: "DE", name: "Hannover" },
  { countryCode: "DE", name: "Nürnberg" },

  // =====================================================
  // BİRLEŞİK KRALLIK
  // =====================================================
  { countryCode: "GB", name: "London" },
  { countryCode: "GB", name: "Birmingham" },
  { countryCode: "GB", name: "Manchester" },
  { countryCode: "GB", name: "Liverpool" },
  { countryCode: "GB", name: "Leeds" },
  { countryCode: "GB", name: "Bristol" },
  { countryCode: "GB", name: "Sheffield" },
  { countryCode: "GB", name: "Glasgow" },
  { countryCode: "GB", name: "Edinburgh" },

  // =====================================================
  // HOLLANDA
  // =====================================================
  { countryCode: "NL", name: "Amsterdam" },
  { countryCode: "NL", name: "Rotterdam" },
  { countryCode: "NL", name: "Den Haag" },
  { countryCode: "NL", name: "Utrecht" },
  { countryCode: "NL", name: "Eindhoven" },

  // =====================================================
  // FRANSA
  // =====================================================
  { countryCode: "FR", name: "Paris" },
  { countryCode: "FR", name: "Marseille" },
  { countryCode: "FR", name: "Lyon" },
  { countryCode: "FR", name: "Toulouse" },
  { countryCode: "FR", name: "Nice" },
  { countryCode: "FR", name: "Bordeaux" },
  { countryCode: "FR", name: "Strasbourg" },

  // =====================================================
  // BELÇİKA
  // =====================================================
  { countryCode: "BE", name: "Brussels" },
  { countryCode: "BE", name: "Antwerp" },
  { countryCode: "BE", name: "Ghent" },
  { countryCode: "BE", name: "Liège" },

  // =====================================================
  // AVUSTURYA
  // =====================================================
  { countryCode: "AT", name: "Vienna" },
  { countryCode: "AT", name: "Graz" },
  { countryCode: "AT", name: "Linz" },
  { countryCode: "AT", name: "Salzburg" },
  { countryCode: "AT", name: "Innsbruck" },

  // =====================================================
  // İSVİÇRE
  // =====================================================
  { countryCode: "CH", name: "Zürich" },
  { countryCode: "CH", name: "Geneva" },
  { countryCode: "CH", name: "Basel" },
  { countryCode: "CH", name: "Bern" },
  { countryCode: "CH", name: "Lausanne" },

  // =====================================================
  // AZERBAYCAN
  // =====================================================
  { countryCode: "AZ", name: "Baku" },
  { countryCode: "AZ", name: "Ganja" },
  { countryCode: "AZ", name: "Sumqayıt" },

  // =====================================================
  // RUSYA
  // =====================================================
  { countryCode: "RU", name: "Moscow" },
  { countryCode: "RU", name: "Saint Petersburg" },
  { countryCode: "RU", name: "Kazan" },
  { countryCode: "RU", name: "Sochi" },
  { countryCode: "RU", name: "Novosibirsk" },
  { countryCode: "RU", name: "Yekaterinburg" },

  // =====================================================
  // UKRAYNA
  // =====================================================
  { countryCode: "UA", name: "Kyiv" },
  { countryCode: "UA", name: "Lviv" },
  { countryCode: "UA", name: "Odesa" },
  { countryCode: "UA", name: "Kharkiv" },
  { countryCode: "UA", name: "Dnipro" },
];

export function getCitiesByCountry(countryCode: string): City[] {
  return CITIES.filter(
    (city) => city.countryCode === countryCode.toUpperCase(),
  );
}