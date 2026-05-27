import { Controller, Post, Get, Param, UseGuards, Body, UseInterceptors, UploadedFile, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Throttle } from "@nestjs/throttler";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/audit/audit.service";
import { validateImageFile, sanitizeFilename } from "../common/helpers";
import * as path from "path";
import * as fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "photos");

@Controller("photos")
@UseGuards(JwtAuthGuard)
export class PhotoController {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  @Post("upload")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: UPLOAD_DIR,
      filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${sanitizeFilename(file.originalname)}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const error = validateImageFile(file.mimetype, 0);
      cb(error ? new BadRequestException(error) : null, !error);
    },
  }))
  async uploadFile(@CurrentUser() user: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("Dosya gerekli");
    const url = `/uploads/photos/${file.filename}`;
    const photo = await this.prisma.photo.create({
      data: { url, userId: user.sub, status: "PENDING", mimetype: file.mimetype },
    });
    this.audit.log({ action: "PHOTO_UPLOAD", userId: user.sub, targetId: photo.id });
    return photo;
  }

  @Post("upload-url")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async uploadPhoto(@CurrentUser() user: any, @Body("url") url: string, @Body("mimetype") mimetype?: string, @Body("size") size?: number) {
    if (mimetype && size) {
      const error = validateImageFile(mimetype, size);
      if (error) throw new BadRequestException(error);
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
    if (!photo || (photo.userId !== user.sub && !user.isAdmin)) throw new BadRequestException("Erişim reddedildi");
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
    if (!photo || (photo.userId !== user.sub && !user.isAdmin)) throw new BadRequestException("Erişim reddedildi");
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
      return this.prisma.photo.findMany({ where: { status: "PENDING" }, include: { user: { select: { id: true, name: true, surname: true, email: true } } } });
    }
    return this.prisma.photo.findMany({ where: { userId: user.sub, status: "PENDING" } });
  }
}
