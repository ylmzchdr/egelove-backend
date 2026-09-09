import { PrismaClient } from "@prisma/client";
import { countriesSeed } from "./countries.seed";

const prisma = new PrismaClient();

async function main() {
  console.log("🌍 Ülke seed başlıyor...");

  for (const country of countriesSeed) {
    await prisma.country.upsert({
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

    console.log(
      `✓ ${country.code} - ${country.name}`,
    );
  }

  console.log("🌍 Ülke seed tamamlandı.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });