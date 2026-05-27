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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const constants_1 = require("../common/constants");
let ChatGateway = class ChatGateway {
    jwtService;
    prisma;
    server;
    constructor(jwtService, prisma) {
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token || client.handshake.query.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token, { secret: constants_1.jwtConstants.secret });
            client.data.userId = payload.sub;
            await this.prisma.userPresence.upsert({
                where: { userId: payload.sub },
                update: { isOnline: true, lastSeen: new Date() },
                create: { userId: payload.sub, isOnline: true },
            });
            client.join(`user:${payload.sub}`);
            this.server.emit("user:online", { userId: payload.sub });
        }
        catch {
            client.disconnect();
        }
    }
    async handleDisconnect(client) {
        const userId = client.data.userId;
        if (userId) {
            await this.prisma.userPresence.upsert({
                where: { userId },
                update: { isOnline: false, lastSeen: new Date() },
                create: { userId, isOnline: false },
            });
            this.server.emit("user:offline", { userId });
        }
    }
    async handleMessage(client, data) {
        const userId = client.data.userId;
        const conversation = await this.prisma.conversation.findUnique({ where: { id: data.conversationId } });
        if (!conversation)
            return;
        const receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
        const isMutual = await this.prisma.match.findFirst({
            where: { OR: [{ senderId: userId, receiverId }, { senderId: receiverId, receiverId: userId }], isMutual: true },
        });
        if (!isMutual)
            return;
        const message = await this.prisma.message.create({
            data: { content: data.content, senderId: userId, conversationId: data.conversationId },
            include: { sender: { select: { id: true, name: true, avatar: true } } },
        });
        this.server.to(`user:${receiverId}`).emit("message:new", message);
        client.emit("message:sent", message);
    }
    async handleJoinConversation(client, conversationId) {
        const userId = client.data.userId;
        const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation)
            return;
        if (conversation.user1Id !== userId && conversation.user2Id !== userId)
            return;
        client.join(`conversation:${conversationId}`);
    }
    async handleRead(client, conversationId) {
        const userId = client.data.userId;
        await this.prisma.conversationRead.upsert({
            where: { userId_conversationId: { userId, conversationId } },
            update: { lastReadAt: new Date() },
            create: { userId, conversationId },
        });
    }
    async handleTypingStart(client, conversationId) {
        const userId = client.data.userId;
        const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation)
            return;
        const receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
        this.server.to(`user:${receiverId}`).emit("typing:update", { conversationId, userId, isTyping: true });
    }
    async handleTypingStop(client, conversationId) {
        const userId = client.data.userId;
        const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation)
            return;
        const receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
        this.server.to(`user:${receiverId}`).emit("typing:update", { conversationId, userId, isTyping: false });
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("message:send"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("conversation:join"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleJoinConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("message:read"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleRead", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("typing:start"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTypingStart", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("typing:stop"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleTypingStop", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: (process.env.CORS_ORIGIN || "http://localhost:3001,http://localhost:3002,http://localhost:3000").split(",").map((s) => s.trim()), credentials: true },
        namespace: "/chat",
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        prisma_service_1.PrismaService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map