"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const cities_1 = require("./cities");
const prisma = new client_1.PrismaClient();
async function main() {
    for (const city of cities_1.cities) {
        await prisma.city.create({
            data: {
                name: city.name,
                districts: {
                    create: city.districts.map((name) => ({ name })),
                },
            },
        });
    }
    console.log(`${cities_1.cities.length} şehir ve ilçeleri eklendi.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map