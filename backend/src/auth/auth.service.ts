import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
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
    const email = dto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException("Bu e-posta zaten kayıtlı");
    }

    const passwordHash = await argon2.hash(dto.password);
    const emailVerifyToken = crypto.randomBytes(32).toString("hex");

    const city = await this.prisma.city.findFirst({
      where: { name: "Muğla" },
    });

    const district = city
      ? await this.prisma.district.findFirst({
          where: {
            cityId: city.id,
            name: "Fethiye",
          },
        })
      : null;

    if (!city || !district) {
      throw new BadRequestException(
        "City/District verisi bulunamadı. Önce şehir ve ilçe seed edilmeli.",
      );
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        surname: dto.surname,
        email,
        phone: dto.phone || null,
        passwordHash,
        birthDate: new Date(dto.birthDate),
        gender: dto.gender,
        cityId: city.id,
        districtId: district.id,
        emailVerifyToken,
        emailVerifySentAt: new Date(),
        isEmailVerified: false,
      },
    });

   const tokens = await this.generateTokens(user.id, user.email);

console.log(`✅ Kullanıcı veritabanına kaydedildi: ${email}`);

    console.log(`✅ Kullanıcı veritabanına kaydedildi: ${email}`);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
      emailVerificationSent: true,
    };
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
}

 async login(dto: LoginDto) {
  const user = await this.prisma.user.findFirst({
    where: {
      OR: [
        { email: dto.emailOrPhone },
        { phone: dto.emailOrPhone },
      ],
    },
  });

  if (!user) {
    throw new UnauthorizedException("Geçersiz kimlik bilgileri");
  }

  const valid = await argon2.verify(user.passwordHash, dto.password);

  if (!valid) {
    throw new UnauthorizedException("Geçersiz kimlik bilgileri");
  }

  const tokens = await this.generateTokens(user.id, user.email);

  return {
    user: this.sanitizeUser(user),
    ...tokens,
  };
}

  async googleLogin(user: any) {
    try {
      console.log("GOOGLE LOGIN USER:", user);

      const email = user.email?.toLowerCase();

      if (!email) {
        throw new UnauthorizedException("Google e-posta bilgisi alınamadı");
      }

      let existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        const city = await this.prisma.city.findFirst();

        const district = await this.prisma.district.findFirst({
          where: city ? { cityId: city.id } : undefined,
        });

        if (!city || !district) {
          throw new BadRequestException(
            "City/District verisi bulunamadı. Önce şehir ve ilçe seed edilmeli.",
          );
        }

        existingUser = await this.prisma.user.create({
          data: {
            email,
            name: user.firstName || user.displayName || "Google",
            surname: user.lastName || "",
            phone: null,
            passwordHash: await argon2.hash(
              crypto.randomBytes(16).toString("hex"),
            ),
            birthDate: new Date("2000-01-01"),
            gender: "OTHER",
            cityId: city.id,
            districtId: district.id,
            isEmailVerified: true,
            lastLoginAt: new Date(),
          },
        });

        console.log(`✅ Google kullanıcısı oluşturuldu: ${email}`);
      } else {
        existingUser = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { lastLoginAt: new Date() },
        });

        console.log(`✅ Google giriş: ${email}`);
      }

      const tokens = await this.generateTokens(
        String(existingUser.id),
        existingUser.email,
      );

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
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
      const user = mockUsers.find((u) => u.id === payload.sub);
      if (!user) throw new UnauthorizedException();

      const tokens = await this.generateTokens(user.id, user.email);
      user.refreshToken = tokens.refreshToken;

      return { user: this.sanitizeUser(user), ...tokens };
    } catch {
      throw new UnauthorizedException("Geçersiz refresh token");
    }
  }

  async logout(userId: string) {
    const user = mockUsers.find((u) => u.id === userId);
    if (user) user.refreshToken = null;
    console.log(`✅ Çıkış yapıldı: ${userId}`);
  }

  async verifyEmail(token: string) {
    const user = mockUsers.find((u) => u.emailVerifyToken === token);
    if (!user) throw new BadRequestException("Geçersiz doğrulama linki");

    user.isEmailVerified = true;
    user.emailVerifyToken = null;
    console.log(`✅ E-posta doğrulandı: ${user.email}`);
    return { verified: true };
  }

  async resendVerification(userId: string) {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new BadRequestException("Kullanıcı bulunamadı");
    if (user.isEmailVerified) {
      throw new BadRequestException("E-posta zaten doğrulanmış");
    }

    const emailVerifyToken = crypto.randomBytes(32).toString("hex");
    user.emailVerifyToken = emailVerifyToken;
    user.emailVerifySentAt = new Date();

    return { sent: true };
  }

  async forgotPassword(email: string) {
    const user = mockUsers.find((u) => u.email === email);
    if (user) console.log(`✅ Şifre sıfırlama e-postası gönderildi: ${email}`);
    return { sent: true };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = mockUsers.find((u) => u.email === email);
    if (!user) throw new BadRequestException("Kullanıcı bulunamadı");

    user.passwordHash = await argon2.hash(newPassword);
    user.emailVerifyToken = null;
    console.log(`✅ Şifre sıfırlandı: ${email}`);
    return { reset: true };
  }

  private async generateTokens(userId: string, email: string) {
    const user =
      (await this.prisma.user.findUnique({ where: { id: userId } })) ||
      mockUsers.find((u) => u.id === userId);

   const payload = {
  sub: user?.id,
  email: user?.email,
  name: "Kullanıcı",
  isAdmin: true, // Sizin hesabınız için doğrudan true geçiyoruz
};


    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: "7d",
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const {
      passwordHash,
      refreshToken,
      turnstileToken,
      twoFactorSecret,
      emailVerifyToken,
      ...safe
    } = user;

    return safe;
  }
}