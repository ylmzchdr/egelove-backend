import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/audit/audit.service";
import { EmailService } from "../email/email.service";
import { TwofaService } from "../twofa/twofa.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { jwtConstants } from "../common/constants";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private audit: AuditService,
    private email: EmailService,
    private twofa: TwofaService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException("Bu e-posta zaten kayıtlı");

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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.emailOrPhone }, { phone: dto.emailOrPhone }],
      },
    });
    if (!user) throw new UnauthorizedException("Geçersiz kimlik bilgileri");

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) throw new UnauthorizedException("Geçersiz kimlik bilgileri");

    const requires2FA = await this.twofa.loginRequires2FA(user.id);

    if (requires2FA) {
      if (!dto.twoFactorToken) {
        return { requires2FA: true, tempToken: this.generateTempToken(user.id) };
      }
      const verified = await this.twofa.verifyToken(user.id, dto.twoFactorToken);
      if (!verified) throw new UnauthorizedException("Geçersiz 2FA kodu");
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    this.audit.log({ action: "USER_LOGIN", userId: user.id });

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async googleLogin(profile: { email: string; firstName: string; lastName: string; picture?: string }) {
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

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: jwtConstants.refreshSecret });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user || user.refreshToken !== refreshToken) throw new UnauthorizedException();

      const tokens = await this.generateTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return { user: this.sanitizeUser(user), ...tokens };
    } catch {
      throw new UnauthorizedException("Geçersiz refresh token");
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
    this.audit.log({ action: "USER_LOGOUT", userId });
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({ where: { emailVerifyToken: token } });
    if (!user) throw new BadRequestException("Geçersiz doğrulama linki");

    const sentAt = user.emailVerifySentAt;
    if (sentAt && Date.now() - sentAt.getTime() > 24 * 60 * 60 * 1000) {
      throw new BadRequestException("Doğrulama linkinin süresi dolmuş. Yeniden gönder.");
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, emailVerifyToken: null },
    });

    this.audit.log({ action: "EMAIL_VERIFIED", userId: user.id });
    return { verified: true };
  }

  async resendVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException("Kullanıcı bulunamadı");
    if (user.isEmailVerified) throw new BadRequestException("E-posta zaten doğrulanmış");

    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerifyToken, emailVerifySentAt: new Date() },
    });

    await this.email.sendVerificationEmail(user.email, emailVerifyToken);
    return { sent: true };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { sent: true };

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

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.resetPasswordToken) throw new BadRequestException("Geçersiz kod");

    const valid = await argon2.verify(user.resetPasswordToken, code.toUpperCase());
    if (!valid) throw new BadRequestException("Geçersiz kod");

    const sentAt = user.resetPasswordSentAt;
    if (sentAt && Date.now() - sentAt.getTime() > 60 * 60 * 1000) {
      throw new BadRequestException("Kodun süresi dolmuş");
    }

    const passwordHash = await argon2.hash(newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetPasswordToken: null, resetPasswordSentAt: null, refreshToken: null },
    });

    this.audit.log({ action: "PASSWORD_RESET", userId: user.id });
    return { reset: true };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { secret: jwtConstants.secret, expiresIn: "15m" }),
      this.jwtService.signAsync(payload, { secret: jwtConstants.refreshSecret, expiresIn: "7d" }),
    ]);
    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshToken } });
  }

  private generateTempToken(userId: string) {
    return this.jwtService.sign({ sub: userId, temp: true }, { secret: jwtConstants.secret, expiresIn: "5m" });
  }

  private sanitizeUser(user: any) {
    const { passwordHash, refreshToken, turnstileToken, twoFactorSecret, emailVerifyToken, resetPasswordToken, ...safe } = user;
    return safe;
  }
}
