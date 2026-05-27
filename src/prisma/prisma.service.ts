import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

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
