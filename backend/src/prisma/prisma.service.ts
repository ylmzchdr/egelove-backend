import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Sürüm fark etmeksizin constructor kontrolünü devre dışı bırakıyoruz
    super({
      errorFormat: 'pretty'
    } as any);

    // Bağlantı dizesini doğrudan çalışma zamanı nesnesine gömüyoruz
    (this as any)._datasourceUrl = "mysql://root:@127.0.0.1:3306/egelove";
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
