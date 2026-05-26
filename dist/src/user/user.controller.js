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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const update_user_dto_1 = require("./dto/update-user.dto");
let UserController = class UserController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMe(user) {
        const profile = await this.prisma.user.findUnique({
            where: { id: user.sub },
            include: { photos: true, city: true, district: true },
        });
        const { passwordHash, refreshToken, turnstileToken, ...safe } = profile;
        return safe;
    }
    async updateMe(user, data) {
        const updated = await this.prisma.user.update({
            where: { id: user.sub },
            data,
        });
        const { passwordHash, refreshToken, turnstileToken, ...safe } = updated;
        return safe;
    }
    async searchUsers(user) {
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
    async filterUsers(user, filters) {
        const where = { id: { not: user.sub }, isActive: true };
        if (filters.gender)
            where.gender = filters.gender;
        if (filters.city)
            where.cityId = filters.city;
        if (filters.education)
            where.education = filters.education;
        if (filters.smoking)
            where.smoking = filters.smoking;
        if (filters.alcohol)
            where.alcohol = filters.alcohol;
        if (filters.maritalStatus)
            where.maritalStatus = filters.maritalStatus;
        if (filters.children)
            where.children = filters.children;
        if (filters.religion)
            where.religion = filters.religion;
        if (filters.bodyType)
            where.bodyType = filters.bodyType;
        if (filters.minHeight || filters.maxHeight) {
            where.height = {};
            if (filters.minHeight)
                where.height.gte = filters.minHeight;
            if (filters.maxHeight)
                where.height.lte = filters.maxHeight;
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
    async getProfile(id) {
        const profile = await this.prisma.user.findUnique({
            where: { id },
            include: { photos: { where: { status: "APPROVED" } }, city: true, district: true },
        });
        if (!profile)
            return { error: "Kullanıcı bulunamadı" };
        const { passwordHash, refreshToken, turnstileToken, twoFactorSecret, emailVerifyToken, ...safe } = profile;
        return safe;
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)("me"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getMe", null);
__decorate([
    (0, common_1.Put)("me"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)("search"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Get)("search/filter"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "filterUsers", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserController);
//# sourceMappingURL=user.controller.js.map