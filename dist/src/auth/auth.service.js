"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon2 = __importStar(require("argon2"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../common/audit/audit.service");
const email_service_1 = require("../email/email.service");
const twofa_service_1 = require("../twofa/twofa.service");
const constants_1 = require("../common/constants");
let AuthService = class AuthService {
    prisma;
    jwtService;
    audit;
    email;
    twofa;
    constructor(prisma, jwtService, audit, email, twofa) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.audit = audit;
        this.email = email;
        this.twofa = twofa;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException("Bu e-posta zaten kayıtlı");
        const passwordHash = await argon2.hash(dto.password);
        const emailVerifyToken = crypto.randomBytes(32).toString("hex");
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                surname: dto.surname,
                email: dto.email,
                phone: dto.phone,
                passwordHash,
                birthDate: new Date(dto.birthDate),
                gender: dto.gender,
                cityId: 1,
                districtId: 1,
                emailVerifyToken,
                emailVerifySentAt: new Date(),
            },
        });
        await this.email.sendVerificationEmail(user.email, emailVerifyToken);
        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        this.audit.log({ action: "USER_REGISTER", userId: user.id, metadata: { email: dto.email } });
        return { user: this.sanitizeUser(user), ...tokens, emailVerificationSent: true };
    }
    async login(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.emailOrPhone }, { phone: dto.emailOrPhone }],
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException("Geçersiz kimlik bilgileri");
        const valid = await argon2.verify(user.passwordHash, dto.password);
        if (!valid)
            throw new common_1.UnauthorizedException("Geçersiz kimlik bilgileri");
        const requires2FA = await this.twofa.loginRequires2FA(user.id);
        if (requires2FA) {
            if (!dto.twoFactorToken) {
                return { requires2FA: true, tempToken: this.generateTempToken(user.id) };
            }
            const verified = await this.twofa.verifyToken(user.id, dto.twoFactorToken);
            if (!verified)
                throw new common_1.UnauthorizedException("Geçersiz 2FA kodu");
        }
        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        this.audit.log({ action: "USER_LOGIN", userId: user.id });
        return { user: this.sanitizeUser(user), ...tokens };
    }
    async googleLogin(profile) {
        let user = await this.prisma.user.findUnique({ where: { email: profile.email } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    name: profile.firstName,
                    surname: profile.lastName || "",
                    email: profile.email,
                    passwordHash: await argon2.hash(crypto.randomBytes(32).toString("hex")),
                    birthDate: new Date("1990-01-01"),
                    gender: "OTHER",
                    cityId: 1,
                    districtId: 1,
                    isEmailVerified: true,
                    avatar: profile.picture,
                },
            });
        }
        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        this.audit.log({ action: "GOOGLE_LOGIN", userId: user.id, metadata: { email: profile.email } });
        return tokens;
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: constants_1.jwtConstants.refreshSecret });
            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user || user.refreshToken !== refreshToken)
                throw new common_1.UnauthorizedException();
            const tokens = await this.generateTokens(user.id, user.email);
            await this.updateRefreshToken(user.id, tokens.refreshToken);
            return { user: this.sanitizeUser(user), ...tokens };
        }
        catch {
            throw new common_1.UnauthorizedException("Geçersiz refresh token");
        }
    }
    async logout(userId) {
        await this.prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
        this.audit.log({ action: "USER_LOGOUT", userId });
    }
    async verifyEmail(token) {
        const user = await this.prisma.user.findFirst({ where: { emailVerifyToken: token } });
        if (!user)
            throw new common_1.BadRequestException("Geçersiz doğrulama linki");
        const sentAt = user.emailVerifySentAt;
        if (sentAt && Date.now() - sentAt.getTime() > 24 * 60 * 60 * 1000) {
            throw new common_1.BadRequestException("Doğrulama linkinin süresi dolmuş. Yeniden gönder.");
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { isEmailVerified: true, emailVerifyToken: null },
        });
        this.audit.log({ action: "EMAIL_VERIFIED", userId: user.id });
        return { verified: true };
    }
    async resendVerification(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException("Kullanıcı bulunamadı");
        if (user.isEmailVerified)
            throw new common_1.BadRequestException("E-posta zaten doğrulanmış");
        const emailVerifyToken = crypto.randomBytes(32).toString("hex");
        await this.prisma.user.update({
            where: { id: userId },
            data: { emailVerifyToken, emailVerifySentAt: new Date() },
        });
        await this.email.sendVerificationEmail(user.email, emailVerifyToken);
        return { sent: true };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { sent: true };
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenHash = await argon2.hash(resetToken);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { resetPasswordToken: resetTokenHash, resetPasswordSentAt: new Date() },
        });
        const baseUrl = process.env.CORS_ORIGIN || "http://localhost:3001";
        await this.email.send({
            to: email,
            subject: "Egelove - Şifre Sıfırlama",
            html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:20px;background:#1a0a1e;border-radius:12px;color:white">
        <h1 style="color:#ec4899">egelove</h1>
        <p>Şifreni sıfırlamak için aşağıdaki kodu kullan:</p>
        <div style="background:#222;padding:16px;border-radius:8px;font-size:24px;text-align:center;letter-spacing:4px;font-family:monospace;margin:16px 0">
          ${resetToken.slice(0, 8).toUpperCase()}
        </div>
        <p style="color:#a1a1aa;font-size:12px">Bu kod 1 saat geçerlidir.</p>
      </div>`,
        });
        return { sent: true };
    }
    async resetPassword(email, code, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.resetPasswordToken)
            throw new common_1.BadRequestException("Geçersiz kod");
        const valid = await argon2.verify(user.resetPasswordToken, code.toUpperCase());
        if (!valid)
            throw new common_1.BadRequestException("Geçersiz kod");
        const sentAt = user.resetPasswordSentAt;
        if (sentAt && Date.now() - sentAt.getTime() > 60 * 60 * 1000) {
            throw new common_1.BadRequestException("Kodun süresi dolmuş");
        }
        const passwordHash = await argon2.hash(newPassword);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash, resetPasswordToken: null, resetPasswordSentAt: null, refreshToken: null },
        });
        this.audit.log({ action: "PASSWORD_RESET", userId: user.id });
        return { reset: true };
    }
    async generateTokens(userId, email) {
        const payload = { sub: userId, email };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { secret: constants_1.jwtConstants.secret, expiresIn: "15m" }),
            this.jwtService.signAsync(payload, { secret: constants_1.jwtConstants.refreshSecret, expiresIn: "7d" }),
        ]);
        return { accessToken, refreshToken };
    }
    async updateRefreshToken(userId, refreshToken) {
        await this.prisma.user.update({ where: { id: userId }, data: { refreshToken } });
    }
    generateTempToken(userId) {
        return this.jwtService.sign({ sub: userId, temp: true }, { secret: constants_1.jwtConstants.secret, expiresIn: "5m" });
    }
    sanitizeUser(user) {
        const { passwordHash, refreshToken, turnstileToken, twoFactorSecret, emailVerifyToken, resetPasswordToken, ...safe } = user;
        return safe;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        audit_service_1.AuditService,
        email_service_1.EmailService,
        twofa_service_1.TwofaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map