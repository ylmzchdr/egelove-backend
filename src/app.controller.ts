import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma?: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("health")
  health() {
    const url = (process.env.DATABASE_URL || "").replace(/\/\/[^:]+:[^@]+@/, "//****:****@");
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: this.prisma?.isConnected ? "connected" : "disconnected",
      env: process.env.NODE_ENV || "development",
      dbUrl: url,
      dbError: (this.prisma as any)?.lastError || null,
    };
  }
}
