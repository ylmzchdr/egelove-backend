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
    async filterUsers(user, city, gender, minAge, maxAge, education, smoking, alcohol, maritalStatus, children, religion, bodyType, hairColor, eyeColor, bloodType, income, minHeight, maxHeight) {
        const where = { id: { not: user.sub }, isActive: true };
        if (gender)
            where.gender = gender;
        if (city)
            where.cityId = parseInt(city);
        if (education)
            where.education = education;
        if (smoking)
            where.smoking = smoking;
        if (alcohol)
            where.alcohol = alcohol;
        if (maritalStatus)
            where.maritalStatus = maritalStatus;
        if (children)
            where.children = children;
        if (religion)
            where.religion = religion;
        if (bodyType)
            where.bodyType = bodyType;
        if (hairColor)
            where.hairColor = hairColor;
        if (eyeColor)
            where.eyeColor = eyeColor;
        if (bloodType)
            where.bloodType = bloodType;
        if (income)
            where.income = income;
        if (minHeight || maxHeight) {
            where.height = {};
            if (minHeight)
                where.height.gte = parseInt(minHeight);
            if (maxHeight)
                where.height.lte = parseInt(maxHeight);
        }
        if (minAge || maxAge) {
            const now = new Date();
            if (maxAge) {
                const minDate = new Date(now.getFullYear() - parseInt(maxAge), now.getMonth(), now.getDate());
                where.birthDate = { ...where.birthDate, gte: minDate };
            }
            if (minAge) {
                const maxDate = new Date(now.getFullYear() - parseInt(minAge), now.getMonth(), now.getDate());
                where.birthDate = { ...where.birthDate, lte: maxDate };
            }
        }
        const users = await this.prisma.user.findMany({
            where,
            take: 50,
            include: { city: true, district: true },
        });
        return users.map((u) => {
            const { passwordHash, refreshToken, turnstileToken, twoFactorSecret, emailVerifyToken, emailVerifySentAt, ...safe } = u;
            return {
                ...safe,
                age: Math.floor((Date.now() - new Date(safe.birthDate).getTime()) / 31557600000),
                birthDate: undefined,
            };
        });
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
    __param(1, (0, common_1.Query)("city")),
    __param(2, (0, common_1.Query)("gender")),
    __param(3, (0, common_1.Query)("minAge")),
    __param(4, (0, common_1.Query)("maxAge")),
    __param(5, (0, common_1.Query)("education")),
    __param(6, (0, common_1.Query)("smoking")),
    __param(7, (0, common_1.Query)("alcohol")),
    __param(8, (0, common_1.Query)("maritalStatus")),
    __param(9, (0, common_1.Query)("children")),
    __param(10, (0, common_1.Query)("religion")),
    __param(11, (0, common_1.Query)("bodyType")),
    __param(12, (0, common_1.Query)("hairColor")),
    __param(13, (0, common_1.Query)("eyeColor")),
    __param(14, (0, common_1.Query)("bloodType")),
    __param(15, (0, common_1.Query)("income")),
    __param(16, (0, common_1.Query)("minHeight")),
    __param(17, (0, common_1.Query)("maxHeight")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, String, String, String, String, String, String, String, String, String, String]),
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