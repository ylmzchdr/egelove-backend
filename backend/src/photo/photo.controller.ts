import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Throttle } from "@nestjs/throttler";
import { diskStorage } from "multer";
import { extname } from "path";
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
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (_req: any, file: any, cb: any) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadPhoto(@CurrentUser() user: any, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException("Fotoğraf dosyası gelmedi");
    }

    const error = validateImageFile(file.mimetype, file.size);
    if (error) {
      throw new BadRequestException(error);
    }

    const photo = await this.prisma.photo.create({
      data: {
        url: `/uploads/${file.filename}`,
        userId: user.sub,
        status: "APPROVED",
      },
    });

    this.audit.log({
      action: "PHOTO_UPLOAD",
      userId: user.sub,
      targetId: photo.id,
    });

    return photo;
  }

  @Get()
  async getMyPhotos(@CurrentUser() user: any) {
    return this.prisma.photo.findMany({ where: { userId: user.sub } });
  }

  @Post("approve/:id")
  async approvePhoto(@CurrentUser() user: any, @Param("id") photoId: string) {
    const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
    if (!photo || (photo.userId !== user.sub && !user.isAdmin)) return { error: "Erişim reddedildi" };

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
    if (!photo || (photo.userId !== user.sub && !user.isAdmin)) return { error: "Erişim reddedildi" };

    const updated = await this.prisma.photo.update({
      where: { id: photoId },
      data: { status: "REJECTED", rejectedReason: reason, moderatedAt: new Date(), moderatedBy: user.sub },
    });

    this.audit.log({ action: "PHOTO_REJECT", userId: user.sub, targetId: photoId, metadata: { reason } });
    return updated;
  }

  @Get("pending")
  async getPendingPhotos(@CurrentUser() user: any) {
    if (user.isAdmin) {
      return this.prisma.photo.findMany({
        where: { status: "PENDING" },
        include: { user: { select: { id: true, name: true, surname: true, email: true } } },
      });
    }
    return this.prisma.photo.findMany({ where: { userId: user.sub, status: "PENDING" } });
  }
}