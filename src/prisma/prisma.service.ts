import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

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
    } catch (e) {
      this.lastError = `${(e as Error).message} | ${JSON.stringify((e as any)?.response || {})}`;
      this.logger.warn(`Veritabanı bağlantısı başarısız: ${(e as Error).message}`);
      this.logger.warn(`Detay: ${JSON.stringify((e as any)?.response || {})}`);
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
