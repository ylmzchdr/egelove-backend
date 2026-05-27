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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MatchService = class MatchService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async likeUser(senderId, receiverId) {
        if (senderId === receiverId)
            throw new common_1.ConflictException("Kendinizi beğenemezsiniz");
        const existing = await this.prisma.match.findUnique({
            where: { senderId_receiverId: { senderId, receiverId } },
        });
        if (existing)
            throw new common_1.ConflictException("Zaten beğendiniz");
        const reverseMatch = await this.prisma.match.findUnique({
            where: { senderId_receiverId: { senderId: receiverId, receiverId: senderId } },
        });
        const match = await this.prisma.match.create({
            data: {
                senderId,
                receiverId,
                isMutual: !!reverseMatch,
            },
        });
        if (reverseMatch) {
            await this.prisma.match.update({
                where: { senderId_receiverId: { senderId: receiverId, receiverId: senderId } },
                data: { isMutual: true },
            });
        }
        return match;
    }
    async unlikeUser(senderId, receiverId) {
        const match = await this.prisma.match.findUnique({
            where: { senderId_receiverId: { senderId, receiverId } },
        });
        if (!match)
            throw new common_1.NotFoundException("Beğeni bulunamadı");
        await this.prisma.match.delete({ where: { id: match.id } });
        if (match.isMutual) {
            await this.prisma.match.update({
                where: { senderId_receiverId: { senderId: receiverId, receiverId: senderId } },
                data: { isMutual: false },
            });
        }
    }
    async getMyMatches(userId) {
        return this.prisma.match.findMany({
            where: { OR: [{ senderId: userId }, { receiverId: userId }] },
            include: {
                sender: {
                    select: {
                        id: true, name: true, surname: true, birthDate: true, avatar: true,
                        bio: true, isVerified: true, cityId: true, districtId: true,
                        city: { select: { name: true } },
                        district: { select: { name: true } },
                        photos: { where: { isMain: true }, select: { url: true }, take: 1 },
                    },
                },
                receiver: {
                    select: {
                        id: true, name: true, surname: true, birthDate: true, avatar: true,
                        bio: true, isVerified: true, cityId: true, districtId: true,
                        city: { select: { name: true } },
                        district: { select: { name: true } },
                        photos: { where: { isMain: true }, select: { url: true }, take: 1 },
                    },
                },
            },
        });
    }
    async getMutualMatches(userId) {
        return this.prisma.match.findMany({
            where: { OR: [{ senderId: userId }, { receiverId: userId }], isMutual: true, isActive: true },
            include: {
                sender: {
                    select: {
                        id: true, name: true, surname: true, birthDate: true, avatar: true,
                        bio: true, isVerified: true, cityId: true, districtId: true,
                        city: { select: { name: true } },
                        district: { select: { name: true } },
                        photos: { where: { isMain: true }, select: { url: true }, take: 1 },
                    },
                },
                receiver: {
                    select: {
                        id: true, name: true, surname: true, birthDate: true, avatar: true,
                        bio: true, isVerified: true, cityId: true, districtId: true,
                        city: { select: { name: true } },
                        district: { select: { name: true } },
                        photos: { where: { isMain: true }, select: { url: true }, take: 1 },
                    },
                },
            },
        });
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchService);
//# sourceMappingURL=match.service.js.map