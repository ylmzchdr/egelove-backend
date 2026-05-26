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
exports.TwofaService = void 0;
const common_1 = require("@nestjs/common");
const speakeasy = __importStar(require("speakeasy"));
const qrcode = __importStar(require("qrcode"));
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../common/audit/audit.service");
const email_service_1 = require("../email/email.service");
let TwofaService = class TwofaService {
    prisma;
    audit;
    email;
    constructor(prisma, audit, email) {
        this.prisma = prisma;
        this.audit = audit;
        this.email = email;
    }
    async generateSecret(userId) {
        const secret = speakeasy.generateSecret({
            name: `egelove:${userId.slice(0, 8)}`,
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret.base32 },
        });
        const qrCode = await qrcode.toDataURL(secret.otpauth_url);
        this.audit.log({ action: "2FA_SECRET_GENERATED", userId });
        return { secret: secret.base32, qrCode };
    }
    async enable(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.twoFactorSecret)
            throw new common_1.BadRequestException("Önce 2FA secret oluşturulmalı");
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token,
        });
        if (!verified)
            throw new common_1.BadRequestException("Geçersiz doğrulama kodu");
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true },
        });
        const backupCode = crypto.randomBytes(4).toString("hex").toUpperCase();
        this.audit.log({ action: "2FA_ENABLED", userId });
        await this.email.send2FABackupCode(user.email, backupCode);
        return { enabled: true, backupCode };
    }
    async disable(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.twoFactorEnabled)
            throw new common_1.BadRequestException("2FA zaten kapalı");
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token,
            window: 2,
        });
        if (!verified)
            throw new common_1.BadRequestException("Geçersiz kod");
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: false, twoFactorSecret: null },
        });
        this.audit.log({ action: "2FA_DISABLED", userId });
        return { disabled: true };
    }
    async verifyToken(userId, token) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.twoFactorSecret)
            return false;
        return speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: "base32",
            token,
            window: 2,
        });
    }
    async loginRequires2FA(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        return user?.twoFactorEnabled ?? false;
    }
};
exports.TwofaService = TwofaService;
exports.TwofaService = TwofaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        email_service_1.EmailService])
], TwofaService);
//# sourceMappingURL=twofa.service.js.map