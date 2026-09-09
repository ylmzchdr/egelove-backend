import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COUNTRIES = [
  { code: "TR", name: "Türkiye" },
  { code: "DE", name: "Almanya" },
  { code: "GB", name: "İngiltere" },
  { code: "RU", name: "Rusya" },
  { code: "UA", name: "Ukrayna" },
  { code: "AZ", name: "Azerbaycan" },
] as const;

const FOREIGN_CITIES: Record<string, string[]> = {
  DE: [
    "Berlin",
    "Hamburg",
    "Munich",
    "Cologne",
    "Frankfurt",
    "Stuttgart",
    "Düsseldorf",
    "Dortmund",
    "Essen",
    "Bremen",
    "Hannover",
    "Nuremberg",
  ],

  GB: [
    "London",
    "Manchester",
    "Birmingham",
    "Liverpool",
    "Leeds",
    "Bristol",
    "Edinburgh",
  ],

  RU: [
    "Moscow",
    "Saint Petersburg",
    "Kazan",
    "Sochi",
    "Novosibirsk",
    "Yekaterinburg",
  ],

  UA: [
    "Kyiv",
    "Lviv",
    "Odesa",
    "Kharkiv",
    "Dnipro",
    "Zaporizhzhia",
  ],

  AZ: [
    "Baku",
    "Ganja",
    "Sumqayit",
    "Mingachevir",
  ],
};

async function main() {
  console.log("SENveBEN uluslararası seed başlıyor...");

  // =====================================================
  // 1. ÜLKELER
  // =====================================================

  const countryIds: Record<string, number> = {};

  for (const country of COUNTRIES) {
    const savedCountry = await prisma.country.upsert({
      where: {
        code: country.code,
      },
      update: {
        name: country.name,
      },
      create: {
        code: country.code,
        name: country.name,
      },
    });

    countryIds[country.code] = savedCountry.id;

    console.log(
      `Ülke hazır: ${savedCountry.code} - ${savedCountry.name}`,
    );
  }

  // =====================================================
  // 2. MEVCUT TÜRKİYE ŞEHİRLERİNİ TÜRKİYE'YE BAĞLA
  // =====================================================

  const turkeyId = countryIds.TR;

  const turkeyUpdate = await prisma.city.updateMany({
    where: {
      countryId: null,
    },
    data: {
      countryId: turkeyId,
    },
  });

  console.log(
    `${turkeyUpdate.count} mevcut şehir Türkiye'ye bağlandı.`,
  );

  // =====================================================
  // 3. YABANCI ŞEHİRLERİ EKLE
  // =====================================================

  for (const [countryCode, cityNames] of Object.entries(
    FOREIGN_CITIES,
  )) {
    const countryId = countryIds[countryCode];

    if (!countryId) {
      throw new Error(
        `Ülke bulunamadı: ${countryCode}`,
      );
    }

    for (const cityName of cityNames) {
      const existingCity = await prisma.city.findFirst({
        where: {
          name: cityName,
          countryId,
        },
      });

      if (existingCity) {
        continue;
      }

      await prisma.city.create({
        data: {
          name: cityName,
          countryId,
        },
      });
    }

    console.log(
      `${countryCode} şehirleri hazır: ${cityNames.length}`,
    );
  }

  // =====================================================
  // 4. MEVCUT KULLANICILARI TÜRKİYE'YE BAĞLA
  // =====================================================

  const userUpdate = await prisma.user.updateMany({
    where: {
      countryId: null,
    },
    data: {
      countryId: turkeyId,
    },
  });

  console.log(
    `${userUpdate.count} mevcut kullanıcı Türkiye'ye bağlandı.`,
  );

  // =====================================================
  // 5. SON KONTROL
  // =====================================================

  const countries = await prisma.country.findMany({
    orderBy: {
      id: "asc",
    },
    include: {
      _count: {
        select: {
          cities: true,
          users: true,
        },
      },
    },
  });

  console.log("");
  console.log("====================================");
  console.log("SENveBEN INTERNATIONAL SEED SONUCU");
  console.log("====================================");

  for (const country of countries) {
    console.log(
      `${country.code} ${country.name} | şehir: ${country._count.cities} | kullanıcı: ${country._count.users}`,
    );
  }

  console.log("====================================");
  console.log("Uluslararası seed tamamlandı.");
}

main()
  .catch((error) => {
    console.error("Seed hatası:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });