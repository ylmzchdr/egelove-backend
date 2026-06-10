import { PrismaClient } from "@prisma/client";
import { cities } from "./cities";

const prisma = new PrismaClient();

async function main() {
  for (const city of cities) {
    await prisma.city.create({
      data: {
        name: city.name,
        districts: {
          create: city.districts.map((name) => ({ name })),
        },
      },
    });
  }
  console.log(`${cities.length} şehir ve ilçeleri eklendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
