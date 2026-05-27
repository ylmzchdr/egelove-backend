import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  constructor() {
    const rawUrl = process.env.DATABASE_URL || "";
    const hasParams = rawUrl.includes("?");
    const sslUrl = rawUrl
      ? hasParams
        ? rawUrl.includes("sslmode")
          ? rawUrl
          : `${rawUrl}&sslmode=require`
        : `${rawUrl}?sslmode=require`
      : rawUrl;
    if (rawUrl && rawUrl !== sslUrl) {
      process.env.DATABASE_URL = sslUrl;
    }
    super({
      log: ["warn", "error"],
      errorFormat: "pretty",
      datasources: rawUrl ? { db: { url: sslUrl } } : undefined,
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.connected = true;
      this.logger.log("Veritabanına bağlanıldı");
    } catch (e) {
      this.logger.warn(`Veritabanı bağlantısı başarısız: ${(e as Error).message}`);
      this.logger.warn("Uygulama DB olmadan başlatılacak — sınırlı işlevsellik");
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
