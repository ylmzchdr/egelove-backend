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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
let MessageController = class MessageController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrGetConversation(user, otherUserId) {
        const existing = await this.prisma.conversation.findFirst({
            where: {
                OR: [
                    { user1Id: user.sub, user2Id: otherUserId },
                    { user1Id: otherUserId, user2Id: user.sub },
                ],
            },
            include: this.conversationInclude(),
        });
        if (existing)
            return existing;
        const conv = await this.prisma.conversation.create({
            data: { user1Id: user.sub, user2Id: otherUserId },
            include: this.conversationInclude(),
        });
        await this.prisma.conversationRead.create({
            data: { userId: user.sub, conversationId: conv.id },
        });
        return conv;
    }
    async getMyConversations(user, page, limit) {
        const pageNum = Math.max(Number(page) || 1, 1);
        const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);
        const skip = (pageNum - 1) * limitNum;
        const [conversations, total] = await Promise.all([
            this.prisma.conversation.findMany({
                where: { OR: [{ user1Id: user.sub }, { user2Id: user.sub }] },
                include: this.conversationInclude(),
                orderBy: { updatedAt: "desc" },
                skip,
                take: limitNum,
            }),
            this.prisma.conversation.count({
                where: { OR: [{ user1Id: user.sub }, { user2Id: user.sub }] },
            }),
        ]);
        return { conversations, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) };
    }
    async getMessages(user, conversationId, page, limit) {
        const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation || (conversation.user1Id !== user.sub && conversation.user2Id !== user.sub)) {
            throw new common_1.ForbiddenException("Erişim reddedildi");
        }
        const pageNum = Math.max(Number(page) || 1, 1);
        const limitNum = Math.min(Math.max(Number(limit) || 50, 1), 200);
        const skip = (pageNum - 1) * limitNum;
        const [messages, total] = await Promise.all([
            this.prisma.message.findMany({
                where: { conversationId },
                orderBy: { createdAt: "desc" },
                skip,
                take: limitNum,
                include: { sender: { select: { id: true, name: true, avatar: true } } },
            }),
            this.prisma.message.count({ where: { conversationId } }),
        ]);
        return { messages: messages.reverse(), total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) };
    }
    async sendMessage(user, conversationId, content) {
        const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation)
            throw new common_1.NotFoundException("Konuşma bulunamadı");
        if (conversation.user1Id !== user.sub && conversation.user2Id !== user.sub) {
            throw new common_1.ForbiddenException("Erişim reddedildi");
        }
        const otherId = conversation.user1Id === user.sub ? conversation.user2Id : conversation.user1Id;
        const isMutual = await this.prisma.match.findFirst({
            where: { OR: [{ senderId: user.sub, receiverId: otherId }, { senderId: otherId, receiverId: user.sub }], isMutual: true },
        });
        if (!isMutual)
            throw new common_1.ForbiddenException("Karşılıklı eşleşme olmadan mesaj gönderemezsiniz");
        const message = await this.prisma.message.create({
            data: { content, senderId: user.sub, conversationId },
            include: { sender: { select: { id: true, name: true, avatar: true } } },
        });
        await this.prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
        return message;
    }
    conversationInclude() {
        return {
            user1: {
                select: {
                    id: true, name: true, surname: true, birthDate: true, avatar: true,
                    city: { select: { name: true } },
                    district: { select: { name: true } },
                },
            },
            user2: {
                select: {
                    id: true, name: true, surname: true, birthDate: true, avatar: true,
                    city: { select: { name: true } },
                    district: { select: { name: true } },
                },
            },
            messages: { take: 1, orderBy: { createdAt: "desc" }, include: { sender: { select: { id: true, name: true, avatar: true } } } },
            reads: { select: { userId: true, lastReadAt: true } },
            _count: { select: { messages: true } },
        };
    }
};
exports.MessageController = MessageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createOrGetConversation", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMyConversations", null);
__decorate([
    (0, common_1.Get)(":id/messages"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("page")),
    __param(3, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)(":id/messages"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("content")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessage", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)("conversations"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessageController);
//# sourceMappingURL=message.controller.js.map