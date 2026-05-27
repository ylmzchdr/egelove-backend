import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private connected;
    lastError: string | null;
    constructor();
    onModuleInit(): Promise<void>;
    private seedCities;
    get isConnected(): boolean;
    onModuleDestroy(): Promise<void>;
}
