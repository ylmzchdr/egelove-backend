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

// In-memory mock users (dev purposes)
const mockUsers: any[] = [];

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
    try {
      const existing = mockUsers.find(u => u.email === dto.email);
      if (existing) throw new ConflictException("Bu e-posta zaten kayıtlı");

      const passwordHash = await argon2.hash(dto.password);
      const emailVerifyToken = crypto.randomBytes(32).toString("hex");

      const user = {
        id: crypto.randomBytes(16).toString("hex"),
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
        isEmailVerified: false,
        refreshToken: null,
        createdAt: new Date(),
      };

      mockUsers.push(user);

      const tokens = await this.generateTokens(user.id, user.email);

      console.log(`✅ Kullanıcı kaydedildi: ${dto.email}`);

      return { user: this.sanitizeUser(user), ...tokens, emailVerificationSent: true };
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = mockUsers.find(
        u => u.email === dto.emailOrPhone || u.phone === dto.emailOrPhone
      );
      if (!user) throw new UnauthorizedException("Geçersiz kimlik bilgileri");

      const valid = await argon2.verify(user.passwordHash, dto.password);
      if (!valid) throw new UnauthorizedException("Geçersiz kimlik bilgileri");

      const tokens = await this.generateTokens(user.id, user.email);
      user.refreshToken = tokens.refreshToken;

      console.log(`✅ Giriş başarılı: ${dto.emailOrPhone}`);

      return { user: this.sanitizeUser(user), ...tokens };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async googleLogin(user: any) {
    try {
      const email = user.email;

      if (!email) {
        throw new UnauthorizedException("Google e-posta bilgisi alınamadı");
      }

      let existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        let city = await this.prisma.city.findFirst({
          where: { name: "Varsayılan" },
        });

        if (!city) {
          city = await this.prisma.city.create({
            data: { name: "Varsayılan" },
          });
        }

        let district = await this.prisma.district.findFirst({
          where: {
            name: "Merkez",
            cityId: city.id,
          },
        });

        if (!district) {
          district = await this.prisma.district.create({
            data: {
              name: "Merkez",
              cityId: city.id,
            },
          });
        }

        existingUser = await this.prisma.user.create({
          data: {
            email,
            name: user.firstName || user.displayName || "Google User",
            surname: user.lastName || "",
            phone: null,
            passwordHash: await argon2.hash(crypto.randomBytes(16).toString("hex")),
            birthDate: new Date(),
            gender: "OTHER",
            cityId: city.id,
            districtId: district.id,
            avatar: user.picture || null,
            isEmailVerified: true,
            lastLoginAt: new Date(),
          },
        });

        console.log(`✅ Google kullanıcısı oluşturuldu: ${email}`);
      } else {
        console.log(`✅ Google giriş: ${email}`);

        existingUser = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { lastLoginAt: new Date() },
        });
      }

      const tokens = await this.generateTokens(
        String(existingUser.id),
        existingUser.email,
      );

      await this.prisma.user.update({
        where: { id: existingUser.id },
        data: { refreshToken: tokens.refreshToken },
      });

      return {
        user: this.sanitizeUser(existingUser),
        ...tokens,
      };
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: jwtConstants.refreshSecret });
      const user = mockUsers.find(u => u.id === payload.sub);
      if (!user) throw new UnauthorizedException();

      const tokens = await this.generateTokens(user.id, user.email);
      user.refreshToken = tokens.refreshToken;

      return { user: this.sanitizeUser(user), ...tokens };
    } catch {
      throw new UnauthorizedException("Geçersiz refresh token");
    }
  }

  async logout(userId: string) {
    const user = mockUsers.find(u => u.id === userId);
    if (user) user.refreshToken = null;
    console.log(`✅ Çıkış yapıldı: ${userId}`);
  }

  async verifyEmail(token: string) {
    const user = mockUsers.find(u => u.emailVerifyToken === token);
    if (!user) throw new BadRequestException("Geçersiz doğrulama linki");

    user.isEmailVerified = true;
    user.emailVerifyToken = null;
    console.log(`✅ E-posta doğrulandı: ${user.email}`);
    return { verified: true };
  }

  async resendVerification(userId: string) {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) throw new BadRequestException("Kullanıcı bulunamadı");
    if (user.isEmailVerified) throw new BadRequestException("E-posta zaten doğrulanmış");

    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerifyToken = emailVerifyToken;
    user.emailVerifySentAt = new Date();

    return { sent: true };
  }

  async forgotPassword(email: string) {
    const user = mockUsers.find(u => u.email === email);
    if (user) console.log(`✅ Şifre sıfırlama e-postası gönderildi: ${email}`);
    return { sent: true };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new BadRequestException("Kullanıcı bulunamadı");

    user.passwordHash = await argon2.hash(newPassword);
    user.emailVerifyToken = null;
    console.log(`✅ Şifre sıfırlandı: ${email}`);
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

  private sanitizeUser(user: any) {
    const { passwordHash, refreshToken, turnstileToken, twoFactorSecret, emailVerifyToken, ...safe } = user;
    return safe;
  }
}
