import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import * as speakeasy from "speakeasy";
import * as qrcode from "qrcode";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/audit/audit.service";
import { EmailService } from "../email/email.service";

@Injectable()
export class TwofaService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private email: EmailService,
  ) {}

  async generateSecret(userId: string) {
    const secret = speakeasy.generateSecret({
      name: `egelove:${userId.slice(0, 8)}`,
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    const qrCode = await qrcode.toDataURL(secret.otpauth_url!);

    this.audit.log({ action: "2FA_SECRET_GENERATED", userId });

    return { secret: secret.base32, qrCode };
  }

  async enable(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) throw new BadRequestException("Önce 2FA secret oluşturulmalı");

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (!verified) throw new BadRequestException("Geçersiz doğrulama kodu");

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });

    const backupCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    this.audit.log({ action: "2FA_ENABLED", userId });

    await this.email.send2FABackupCode(user.email, backupCode);

    return { enabled: true, backupCode };
  }

  async disable(userId: string, token: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorEnabled) throw new BadRequestException("2FA zaten kapalı");

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret!,
      encoding: "base32",
      token,
      window: 2,
    });

    if (!verified) throw new BadRequestException("Geçersiz kod");

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });

    this.audit.log({ action: "2FA_DISABLED", userId });
    return { disabled: true };
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) return false;

    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
      window: 2,
    });
  }

  async loginRequires2FA(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user?.twoFactorEnabled ?? false;
  }
}
