import { PrismaService } from "../prisma/prisma.service";
export declare enum PremiumPackage {
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    SEMI_ANNUAL = "SEMI_ANNUAL",
    ANNUAL = "ANNUAL"
}
export declare class PaymentService {
    private prisma;
    private readonly shopierSecretKey;
    constructor(prisma: PrismaService);
    getPackagePrice(pkg: PremiumPackage): number;
    getPackageDuration(pkg: PremiumPackage): number;
    handleWebhook(rawBody: string, signature: string, ipAddress?: string): Promise<{
        status: string;
        webhookLogId?: undefined;
        premiumExpiresAt?: undefined;
    } | {
        status: string;
        webhookLogId: string;
        premiumExpiresAt: Date;
    }>;
}
