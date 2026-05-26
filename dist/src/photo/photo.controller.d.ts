import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../common/audit/audit.service";
export declare class PhotoController {
    private prisma;
    private audit;
    constructor(prisma: PrismaService, audit: AuditService);
    uploadPhoto(user: any, url: string, mimetype?: string, size?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        status: import("@prisma/client").$Enums.PhotoStatus;
        thumbnail: string | null;
        blurHash: string | null;
        isMain: boolean;
        userId: string;
        rejectedReason: string | null;
        moderatedBy: string | null;
        moderatedAt: Date | null;
    } | {
        error: string;
    }>;
    getMyPhotos(user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        status: import("@prisma/client").$Enums.PhotoStatus;
        thumbnail: string | null;
        blurHash: string | null;
        isMain: boolean;
        userId: string;
        rejectedReason: string | null;
        moderatedBy: string | null;
        moderatedAt: Date | null;
    }[]>;
    approvePhoto(user: any, photoId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        status: import("@prisma/client").$Enums.PhotoStatus;
        thumbnail: string | null;
        blurHash: string | null;
        isMain: boolean;
        userId: string;
        rejectedReason: string | null;
        moderatedBy: string | null;
        moderatedAt: Date | null;
    } | {
        error: string;
    }>;
    rejectPhoto(user: any, photoId: string, reason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        status: import("@prisma/client").$Enums.PhotoStatus;
        thumbnail: string | null;
        blurHash: string | null;
        isMain: boolean;
        userId: string;
        rejectedReason: string | null;
        moderatedBy: string | null;
        moderatedAt: Date | null;
    } | {
        error: string;
    }>;
    getPendingPhotos(user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        url: string;
        status: import("@prisma/client").$Enums.PhotoStatus;
        thumbnail: string | null;
        blurHash: string | null;
        isMain: boolean;
        userId: string;
        rejectedReason: string | null;
        moderatedBy: string | null;
        moderatedAt: Date | null;
    }[]>;
}
