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
        });
        if (existing)
            return existing;
        return this.prisma.conversation.create({
            data: { user1Id: user.sub, user2Id: otherUserId },
        });
    }
    async getMyConversations(user) {
        return this.prisma.conversation.findMany({
            where: { OR: [{ user1Id: user.sub }, { user2Id: user.sub }] },
            include: {
                user1: { select: { id: true, name: true, avatar: true } },
                user2: { select: { id: true, name: true, avatar: true } },
                messages: { take: 1, orderBy: { createdAt: "desc" } },
            },
            orderBy: { updatedAt: "desc" },
        });
    }
    async getMessages(user, conversationId) {
        const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation || (conversation.user1Id !== user.sub && conversation.user2Id !== user.sub)) {
            return { error: "Erişim reddedildi" };
        }
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "asc" },
            include: { sender: { select: { id: true, name: true, avatar: true } } },
        });
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMyConversations", null);
__decorate([
    (0, common_1.Get)(":id/messages"),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "getMessages", null);
exports.MessageController = MessageController = __decorate([
    (0, common_1.Controller)("conversations"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessageController);
//# sourceMappingURL=message.controller.js.map