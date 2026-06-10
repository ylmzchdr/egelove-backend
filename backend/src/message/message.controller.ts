import { Controller, Get, Post, Body, Param, UseGuards, NotFoundException, ForbiddenException } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { PrismaService } from "../prisma/prisma.service";

@Controller("conversations")
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async createOrGetConversation(@CurrentUser() user: any, @Body("userId") otherUserId: string) {
    const existing = await this.prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: user.sub, user2Id: otherUserId },
          { user1Id: otherUserId, user2Id: user.sub },
        ],
      },
      include: this.conversationInclude(),
    });
    if (existing) return existing;
    const conv = await this.prisma.conversation.create({
      data: { user1Id: user.sub, user2Id: otherUserId },
      include: this.conversationInclude(),
    });
    await this.prisma.conversationRead.create({
      data: { userId: user.sub, conversationId: conv.id },
    });
    return conv;
  }

  @Get()
  async getMyConversations(@CurrentUser() user: any) {
    return this.prisma.conversation.findMany({
      where: { OR: [{ user1Id: user.sub }, { user2Id: user.sub }] },
      include: this.conversationInclude(),
      orderBy: { updatedAt: "desc" },
    });
  }

  @Get(":id/messages")
  async getMessages(@CurrentUser() user: any, @Param("id") conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation || (conversation.user1Id !== user.sub && conversation.user2Id !== user.sub)) {
      throw new ForbiddenException("Erişim reddedildi");
    }
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });
  }

  @Post(":id/messages")
  async sendMessage(@CurrentUser() user: any, @Param("id") conversationId: string, @Body("content") content: string) {
    const conversation = await this.prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation) throw new NotFoundException("Konuşma bulunamadı");
    if (conversation.user1Id !== user.sub && conversation.user2Id !== user.sub) {
      throw new ForbiddenException("Erişim reddedildi");
    }
    const otherId = conversation.user1Id === user.sub ? conversation.user2Id : conversation.user1Id;
    const isMutual = await this.prisma.match.findFirst({
      where: { OR: [{ senderId: user.sub, receiverId: otherId }, { senderId: otherId, receiverId: user.sub }], isMutual: true },
    });
    if (!isMutual) throw new ForbiddenException("Karşılıklı eşleşme olmadan mesaj gönderemezsiniz");
    const message = await this.prisma.message.create({
      data: { content, senderId: user.sub, conversationId },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });
    await this.prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } });
    return message;
  }

  private conversationInclude() {
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
      messages: { take: 1, orderBy: { createdAt: "desc" as const }, include: { sender: { select: { id: true, name: true, avatar: true } } } },
      reads: { select: { userId: true, lastReadAt: true } },
      _count: { select: { messages: true } },
    };
  }
}
