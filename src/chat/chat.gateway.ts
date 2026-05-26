import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { jwtConstants } from "../common/constants";

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN || "http://localhost:3001", credentials: true },
  namespace: "/chat",
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.query.token;
      if (!token) { client.disconnect(); return; }

      const payload = this.jwtService.verify(token, { secret: jwtConstants.secret });
      client.data.userId = payload.sub;

      await this.prisma.userPresence.upsert({
        where: { userId: payload.sub },
        update: { isOnline: true, lastSeen: new Date() },
        create: { userId: payload.sub, isOnline: true },
      });

      client.join(`user:${payload.sub}`);
      this.server.emit("user:online", { userId: payload.sub });
    } catch {
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
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

  @SubscribeMessage("message:send")
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: { conversationId: string; content: string }) {
    const userId = client.data.userId;

    const conversation = await this.prisma.conversation.findUnique({ where: { id: data.conversationId } });
    if (!conversation) return;

    const receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
    const isMutual = await this.prisma.match.findFirst({
      where: { OR: [{ senderId: userId, receiverId }, { senderId: receiverId, receiverId: userId }], isMutual: true },
    });
    if (!isMutual) return;

    const message = await this.prisma.message.create({
      data: { content: data.content, senderId: userId, conversationId: data.conversationId },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });

    this.server.to(`user:${receiverId}`).emit("message:new", message);
    client.emit("message:sent", message);
  }

  @SubscribeMessage("conversation:join")
  async handleJoinConversation(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    const userId = client.data.userId;
    const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation) return;
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) return;
    client.join(`conversation:${conversationId}`);
  }

  @SubscribeMessage("message:read")
  async handleRead(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    const userId = client.data.userId;
    await this.prisma.conversationRead.upsert({
      where: { userId_conversationId: { userId, conversationId } },
      update: { lastReadAt: new Date() },
      create: { userId, conversationId },
    });
  }

  @SubscribeMessage("typing:start")
  async handleTypingStart(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    const userId = client.data.userId;
    const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation) return;
    const receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
    this.server.to(`user:${receiverId}`).emit("typing:update", { conversationId, userId, isTyping: true });
  }

  @SubscribeMessage("typing:stop")
  async handleTypingStop(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    const userId = client.data.userId;
    const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation) return;
    const receiverId = conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
    this.server.to(`user:${receiverId}`).emit("typing:update", { conversationId, userId, isTyping: false });
  }
}
