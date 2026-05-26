import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/audit/audit.service";
import { EmailService } from "../email/email.service";
export declare class TwofaService {
    private prisma;
    private audit;
    private email;
    constructor(prisma: PrismaService, audit: AuditService, email: EmailService);
    generateSecret(userId: string): Promise<{
        secret: string;
        qrCode: string;
    }>;
    enable(userId: string, token: string): Promise<{
        enabled: boolean;
        backupCode: string;
    }>;
    disable(userId: string, token: string): Promise<{
        disabled: boolean;
    }>;
    verifyToken(userId: string, token: string): Promise<boolean>;
    loginRequires2FA(userId: string): Promise<boolean>;
}
