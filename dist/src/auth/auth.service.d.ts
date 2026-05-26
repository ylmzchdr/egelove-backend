import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/audit/audit.service";
import { EmailService } from "../email/email.service";
import { TwofaService } from "../twofa/twofa.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    private prisma;
    private jwtService;
    private audit;
    private email;
    private twofa;
    constructor(prisma: PrismaService, jwtService: JwtService, audit: AuditService, email: EmailService, twofa: TwofaService);
    register(dto: RegisterDto): Promise<{
        emailVerificationSent: boolean;
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        requires2FA: boolean;
        tempToken: string;
    } | {
        accessToken: string;
        refreshToken: string;
        user: any;
        requires2FA?: undefined;
        tempToken?: undefined;
    }>;
    googleLogin(profile: {
        email: string;
        firstName: string;
        lastName: string;
        picture?: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    logout(userId: string): Promise<void>;
    verifyEmail(token: string): Promise<{
        verified: boolean;
    }>;
    resendVerification(userId: string): Promise<{
        sent: boolean;
    }>;
    forgotPassword(email: string): Promise<{
        sent: boolean;
    }>;
    resetPassword(email: string, code: string, newPassword: string): Promise<{
        reset: boolean;
    }>;
    private generateTokens;
    private updateRefreshToken;
    private generateTempToken;
    private sanitizeUser;
}
