import { OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private connected;
    constructor();
    onModuleInit(): Promise<void>;
    get isConnected(): boolean;
    onModuleDestroy(): Promise<void>;
}
