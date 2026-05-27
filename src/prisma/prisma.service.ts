import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { cities } from "../../prisma/seed-data";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;
  lastError: string | null = null;

  constructor() {
    super();
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.connected = true;
      this.logger.log(`Veritabanına bağlanıldı: ${process.env.DATABASE_URL?.split("@")[1] || "unknown"}`);
      await this.seedCities();
    } catch (e) {
      this.lastError = `${(e as Error).message} | ${JSON.stringify((e as any)?.response || {})}`;
      this.logger.warn(`Veritabanı bağlantısı başarısız: ${(e as Error).message}`);
      this.logger.warn(`Detay: ${JSON.stringify((e as any)?.response || {})}`);
      this.logger.warn("Uygulama DB olmadan başlatılacak — sınırlı işlevsellik");
    }
  }

  private async seedCities() {
    try {
      const count = await this.city.count();
      if (count > 0) {
        this.logger.log(`Şehirler zaten mevcut (${count}), seed atlanıyor`);
        return;
      }
      this.logger.log(`${cities.length} şehir ekleniyor...`);
      for (const city of cities) {
        await this.city.create({
          data: {
            name: city.name,
            districts: {
              create: city.districts.map((d) => ({ name: d })),
            },
          },
        });
      }
      const totalCities = await this.city.count();
      const totalDistricts = await this.district.count();
      this.logger.log(`Seed tamamlandı: ${totalCities} şehir, ${totalDistricts} ilçe`);
    } catch (e) {
      this.logger.warn(`Seed hatası: ${(e as Error).message}`);
    }
  }

  get isConnected() {
    return this.connected;
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.$disconnect();
    }
  }
}
