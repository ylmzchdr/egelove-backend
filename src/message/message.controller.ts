import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
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
    });
    if (existing) return existing;

    return this.prisma.conversation.create({
      data: { user1Id: user.sub, user2Id: otherUserId },
    });
  }

  @Get()
  async getMyConversations(@CurrentUser() user: any) {
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

  @Get(":id/messages")
  async getMessages(@CurrentUser() user: any, @Param("id") conversationId: string) {
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
}
