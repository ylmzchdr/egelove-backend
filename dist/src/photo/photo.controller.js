"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../common/audit/audit.service");
const helpers_1 = require("../common/helpers");
let PhotoController = class PhotoController {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async uploadPhoto(user, url, mimetype, size) {
        if (mimetype && size) {
            const error = (0, helpers_1.validateImageFile)(mimetype, size);
            if (error)
                return { error };
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
            return { error: "Erişim reddedildi" };
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
            return { error: "Erişim reddedildi" };
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