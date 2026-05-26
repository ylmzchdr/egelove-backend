import { Controller, Post, Get, Param, UseGuards, Body } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/audit/audit.service";
import { validateImageFile } from "../common/helpers";

@Controller("photos")
@UseGuards(JwtAuthGuard)
export class PhotoController {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  @Post("upload")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async uploadPhoto(@CurrentUser() user: any, @Body("url") url: string, @Body("mimetype") mimetype?: string, @Body("size") size?: number) {
    if (mimetype && size) {
      const error = validateImageFile(mimetype, size);
      if (error) return { error };
    }

    const photo = await this.prisma.photo.create({
      data: { url, userId: user.sub, status: "PENDING" },
    });

    this.audit.log({ action: "PHOTO_UPLOAD", userId: user.sub, targetId: photo.id });
    return photo;
  }

  @Get()
  async getMyPhotos(@CurrentUser() user: any) {
    return this.prisma.photo.findMany({ where: { userId: user.sub } });
  }

  @Post("approve/:id")
  async approvePhoto(@CurrentUser() user: any, @Param("id") photoId: string) {
    const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
    if (!photo || photo.userId !== user.sub) return { error: "Erişim reddedildi" };

    const updated = await this.prisma.photo.update({
      where: { id: photoId },
      data: { status: "APPROVED", moderatedAt: new Date(), moderatedBy: user.sub },
    });

    this.audit.log({ action: "PHOTO_APPROVE", userId: user.sub, targetId: photoId });
    return updated;
  }

  @Post("reject/:id")
  async rejectPhoto(@CurrentUser() user: any, @Param("id") photoId: string, @Body("reason") reason?: string) {
    const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
    if (!photo || photo.userId !== user.sub) return { error: "Erişim reddedildi" };

    const updated = await this.prisma.photo.update({
      where: { id: photoId },
      data: { status: "REJECTED", rejectedReason: reason, moderatedAt: new Date(), moderatedBy: user.sub },
    });

    this.audit.log({ action: "PHOTO_REJECT", userId: user.sub, targetId: photoId, metadata: { reason } });
    return updated;
  }

  @Get("pending")
  async getPendingPhotos(@CurrentUser() user: any) {
    return this.prisma.photo.findMany({ where: { status: "PENDING" } });
  }
}
