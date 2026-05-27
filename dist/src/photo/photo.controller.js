"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../common/audit/audit.service");
const helpers_1 = require("../common/helpers");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "photos");
let PhotoController = class PhotoController {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
        if (!fs.existsSync(UPLOAD_DIR))
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    async uploadFile(user, file) {
        if (!file)
            throw new common_1.BadRequestException("Dosya gerekli");
        const url = `/uploads/photos/${file.filename}`;
        const photo = await this.prisma.photo.create({
            data: { url, userId: user.sub, status: "PENDING", mimetype: file.mimetype },
        });
        this.audit.log({ action: "PHOTO_UPLOAD", userId: user.sub, targetId: photo.id });
        return photo;
    }
    async uploadPhoto(user, url, mimetype, size) {
        if (mimetype && size) {
            const error = (0, helpers_1.validateImageFile)(mimetype, size);
            if (error)
                throw new common_1.BadRequestException(error);
        }
        const photo = await this.prisma.photo.create({
            data: { url, userId: user.sub, status: "PENDING" },
        });
        this.audit.log({ action: "PHOTO_UPLOAD", userId: user.sub, targetId: photo.id });
        return photo;
    }
    async getMyPhotos(user) {
        return this.prisma.photo.findMany({ where: { userId: user.sub } });
    }
    async approvePhoto(user, photoId) {
        const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
        if (!photo || (photo.userId !== user.sub && !user.isAdmin))
            throw new common_1.BadRequestException("Erişim reddedildi");
        const updated = await this.prisma.photo.update({
            where: { id: photoId },
            data: { status: "APPROVED", moderatedAt: new Date(), moderatedBy: user.sub },
        });
        this.audit.log({ action: "PHOTO_APPROVE", userId: user.sub, targetId: photoId });
        return updated;
    }
    async rejectPhoto(user, photoId, reason) {
        const photo = await this.prisma.photo.findUnique({ where: { id: photoId } });
        if (!photo || (photo.userId !== user.sub && !user.isAdmin))
            throw new common_1.BadRequestException("Erişim reddedildi");
        const updated = await this.prisma.photo.update({
            where: { id: photoId },
            data: { status: "REJECTED", rejectedReason: reason, moderatedAt: new Date(), moderatedBy: user.sub },
        });
        this.audit.log({ action: "PHOTO_REJECT", userId: user.sub, targetId: photoId, metadata: { reason } });
        return updated;
    }
    async getPendingPhotos(user) {
        if (user.isAdmin) {
            return this.prisma.photo.findMany({ where: { status: "PENDING" }, include: { user: { select: { id: true, name: true, surname: true, email: true } } } });
        }
        return this.prisma.photo.findMany({ where: { userId: user.sub, status: "PENDING" } });
    }
};
exports.PhotoController = PhotoController;
__decorate([
    (0, common_1.Post)("upload"),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: UPLOAD_DIR,
            filename: (_req, file, cb) => {
                const ext = path.extname(file.originalname);
                cb(null, `${Date.now()}-${(0, helpers_1.sanitizeFilename)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (_req, file, cb) => {
            const error = (0, helpers_1.validateImageFile)(file.mimetype, 0);
            cb(error ? new common_1.BadRequestException(error) : null, !error);
        },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)("upload-url"),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)("url")),
    __param(2, (0, common_1.Body)("mimetype")),
    __param(3, (0, common_1.Body)("size")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getMyPhotos", null);
__decorate([
    (0, common_1.Post)("approve/:id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "approvePhoto", null);
__decorate([
    (0, common_1.Post)("reject/:id"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("reason")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "rejectPhoto", null);
__decorate([
    (0, common_1.Get)("pending"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "getPendingPhotos", null);
exports.PhotoController = PhotoController = __decorate([
    (0, common_1.Controller)("photos"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PhotoController);
//# sourceMappingURL=photo.controller.js.map