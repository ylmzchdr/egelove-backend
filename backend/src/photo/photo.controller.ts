import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Throttle } from "@nestjs/throttler";
import { v2 as cloudinary } from "cloudinary";
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
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  @Post("upload")
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (_req: any, file: any, cb: any) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];

        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException("Sadece JPEG, PNG veya WebP fotoğraf yüklenebilir"),
            false,
          );
        }

        cb(null, true);
      },
    }),
  )
  async uploadPhoto(@CurrentUser() user: any, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException("Fotoğraf dosyası gelmedi");

    const error = validateImageFile(file.mimetype, file.size);
    if (error) throw new BadRequestException(error);

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new BadRequestException("Cloudinary ayarları eksik");
    }

    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `egelove/users/${user.sub}`,
          resource_type: "image",
          overwrite: false,
        },
        (err: any, result: any) => {
          if (err) return reject(err);
          resolve(result);
        },
      );

      stream.end(file.buffer);
    });

    const photoCount = await this.prisma.photo.count({
      where: { userId: user.sub },
    });

    const photo = await this.prisma.photo.create({
      data: {
        url: uploadResult.secure_url,
        userId: user.sub,
        status: "APPROVED",
        isMain: photoCount === 0,
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
    return this.prisma.photo.findMany({
      where: { userId: user.sub },
      orderBy: [{ isMain: "desc" }, { createdAt: "desc" }],
    });
  }

  @Delete(":id")
  async deletePhoto(@CurrentUser() user: any, @Param("id") photoId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) throw new NotFoundException("Fotoğraf bulunamadı");

    if (photo.userId !== user.sub && !user.isAdmin) {
      throw new ForbiddenException("Erişim reddedildi");
    }

    await this.prisma.photo.delete({
      where: { id: photoId },
    });

    this.audit.log({
      action: "PHOTO_DELETE",
      userId: user.sub,
      targetId: photoId,
    });

    return { success: true };
  }

  @Post("approve/:id")
  async approvePhoto(@CurrentUser() user: any, @Param("id") photoId: string) {
    const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });

    if (!photo || (photo.userId !== user.sub && !user.isAdmin)) {
      return { error: "Erişim reddedildi" };
    }

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

  @Post("reject/:id")
  async rejectPhoto(
    @CurrentUser() user: any,
    @Param("id") photoId: string,
    @Body("reason") reason?: string,
  ) {
    const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });

    if (!photo || (photo.userId !== user.sub && !user.isAdmin)) {
      return { error: "Erişim reddedildi" };
    }

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

  @Get("pending")
  async getPendingPhotos(@CurrentUser() user: any) {
    if (user.isAdmin) {
      return this.prisma.photo.findMany({
        where: { status: "PENDING" },
        include: {
          user: { select: { id: true, name: true, surname: true, email: true } },
        },
      });
    }

    return this.prisma.photo.findMany({
      where: { userId: user.sub, status: "PENDING" },
    });
  }
}