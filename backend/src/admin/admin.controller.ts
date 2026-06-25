import { Controller, Get, Post, Param, UseGuards, Body, UnauthorizedException } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/audit/audit.service";

@Controller("admin")
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  private async checkAdmin(user: any) {
    const dbUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: user.sub },
          { email: user.email },
        ],
      },
      select: {
        id: true,
        email: true,
        isAdmin: true,
      },
    });

    if (!dbUser?.isAdmin) {
      throw new UnauthorizedException("Admin yetkisi gerekli");
    }
  }

  @Get("stats")
  async getStats(@CurrentUser() user: any) {
    await this.checkAdmin(user);

    const [
      totalUsers,
      pendingPhotos,
      totalMatches,
      premiumUsers,
      totalConversations,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.photo.count({ where: { status: "PENDING" } }),
      this.prisma.match.count(),
      this.prisma.user.count({ where: { isPremiumCandidate: true } }),
      this.prisma.conversation.count(),
    ]);

    return {
      totalUsers,
      pendingPhotos,
      totalMatches,
      premiumUsers,
      totalConversations,
    };
  }

  @Get("users")
  async getUsers(@CurrentUser() user: any) {
    await this.checkAdmin(user);

    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        gender: true,
        birthDate: true,
        isPremiumCandidate: true,
        isVerified: true,
        isEmailVerified: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        city: { select: { name: true } },
      },
    });
  }

  @Post("users/:id/toggle-active")
  async toggleUserActive(
    @CurrentUser() user: any,
    @Param("id") targetId: string,
  ) {
    await this.checkAdmin(user);

    const target = await this.prisma.user.findUnique({
      where: { id: targetId },
    });

    if (!target) return { error: "Kullanıcı bulunamadı" };

    const updated = await this.prisma.user.update({
      where: { id: targetId },
      data: { isActive: !target.isActive },
    });

    this.audit.log({
      action: "USER_TOGGLE_ACTIVE",
      userId: user.sub,
      targetId,
      metadata: { newStatus: updated.isActive },
    });

    return { isActive: updated.isActive };
  }

  @Post("photos/approve/:id")
  async approvePhoto(
    @CurrentUser() user: any,
    @Param("id") photoId: string,
  ) {
    await this.checkAdmin(user);

    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) return { error: "Fotoğraf bulunamadı" };

    const updated = await this.prisma.photo.update({
      where: { id: photoId },
      data: {
        status: "APPROVED",
        moderatedAt: new Date(),
        moderatedBy: user.sub,
      },
    });

    this.audit.log({
      action: "PHOTO_APPROVE",
      userId: user.sub,
      targetId: photoId,
    });

    return updated;
  }

  @Post("photos/reject/:id")
  async rejectPhoto(
    @CurrentUser() user: any,
    @Param("id") photoId: string,
    @Body("reason") reason?: string,
  ) {
    await this.checkAdmin(user);

    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) return { error: "Fotoğraf bulunamadı" };

    const updated = await this.prisma.photo.update({
      where: { id: photoId },
      data: {
        status: "REJECTED",
        rejectedReason: reason,
        moderatedAt: new Date(),
        moderatedBy: user.sub,
      },
    });

    this.audit.log({
      action: "PHOTO_REJECT",
      userId: user.sub,
      targetId: photoId,
      metadata: { reason },
    });

    return updated;
  }

  @Get("photos/pending")
  async getPendingPhotos(@CurrentUser() user: any) {
    await this.checkAdmin(user);

    return this.prisma.photo.findMany({
      where: { status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
          },
        },
      },
    });
  }
}