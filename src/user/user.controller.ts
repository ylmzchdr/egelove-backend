import { Controller, Get, Put, Body, UseGuards, Param } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: any) {
    const profile = await this.prisma.user.findUnique({
      where: { id: user.sub },
      include: { photos: true, city: true, district: true },
    });
    const { passwordHash, refreshToken, turnstileToken, ...safe } = profile!;
    return safe;
  }

  @Put("me")
  @UseGuards(JwtAuthGuard)
  async updateMe(@CurrentUser() user: any, @Body() data: UpdateUserDto) {
    const updated = await this.prisma.user.update({
      where: { id: user.sub },
      data,
    });
    const { passwordHash, refreshToken, turnstileToken, ...safe } = updated;
    return safe;
  }

  @Get("search")
  @UseGuards(JwtAuthGuard)
  async searchUsers(@CurrentUser() user: any) {
    const users = await this.prisma.user.findMany({
      where: { id: { not: user.sub }, isActive: true },
      take: 20,
      select: {
        id: true, name: true, birthDate: true, cityId: true,
        gender: true, bio: true, avatar: true, isVerified: true,
      },
    });
    return users;
  }

  @Get("search/filter")
  @UseGuards(JwtAuthGuard)
  async filterUsers(
    @CurrentUser() user: any,
    @Body() filters: {
      city?: number; gender?: string; minAge?: number; maxAge?: number;
      education?: string; smoking?: string; alcohol?: string;
      maritalStatus?: string; children?: string; religion?: string;
      minHeight?: number; maxHeight?: number; bodyType?: string;
    },
  ) {
    const where: any = { id: { not: user.sub }, isActive: true };

    if (filters.gender) where.gender = filters.gender;
    if (filters.city) where.cityId = filters.city;
    if (filters.education) where.education = filters.education;
    if (filters.smoking) where.smoking = filters.smoking;
    if (filters.alcohol) where.alcohol = filters.alcohol;
    if (filters.maritalStatus) where.maritalStatus = filters.maritalStatus;
    if (filters.children) where.children = filters.children;
    if (filters.religion) where.religion = filters.religion;
    if (filters.bodyType) where.bodyType = filters.bodyType;
    if (filters.minHeight || filters.maxHeight) {
      where.height = {};
      if (filters.minHeight) where.height.gte = filters.minHeight;
      if (filters.maxHeight) where.height.lte = filters.maxHeight;
    }

    const users = await this.prisma.user.findMany({
      where,
      take: 50,
      select: {
        id: true, name: true, birthDate: true, cityId: true,
        gender: true, bio: true, avatar: true, isVerified: true,
        education: true, smoking: true, alcohol: true, height: true,
      },
    });

    return users.map((u) => ({
      ...u,
      age: Math.floor((Date.now() - new Date(u.birthDate).getTime()) / 31557600000),
      birthDate: undefined,
    }));
  }

  @Get(":id")
  async getProfile(@Param("id") id: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id },
      include: { photos: { where: { status: "APPROVED" } }, city: true, district: true },
    });
    if (!profile) return { error: "Kullanıcı bulunamadı" };
    const { passwordHash, refreshToken, turnstileToken, twoFactorSecret, emailVerifyToken, ...safe } = profile;
    return safe;
  }
}
