import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly appService;
    private readonly prisma?;
    constructor(appService: AppService, prisma?: PrismaService | undefined);
    getHello(): string;
    health(): {
        status: string;
        timestamp: string;
        uptime: number;
        database: string;
        env: string;
    };
}
