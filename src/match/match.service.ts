import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MatchService {
  constructor(private prisma: PrismaService) {}

  async likeUser(senderId: string, receiverId: string) {
    if (senderId === receiverId) throw new ConflictException("Kendinizi beğenemezsiniz");

    const existing = await this.prisma.match.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
    });
    if (existing) throw new ConflictException("Zaten beğendiniz");

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

  async unlikeUser(senderId: string, receiverId: string) {
    const match = await this.prisma.match.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
    });
    if (!match) throw new NotFoundException("Beğeni bulunamadı");

    await this.prisma.match.delete({ where: { id: match.id } });

    if (match.isMutual) {
      await this.prisma.match.update({
        where: { senderId_receiverId: { senderId: receiverId, receiverId: senderId } },
        data: { isMutual: false },
      });
    }
  }

  async getMyMatches(userId: string) {
    return this.prisma.match.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      include: {
        sender: { select: { id: true, name: true, avatar: true, cityId: true } },
        receiver: { select: { id: true, name: true, avatar: true, cityId: true } },
      },
    });
  }

  async getMutualMatches(userId: string) {
    return this.prisma.match.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }], isMutual: true, isActive: true },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        receiver: { select: { id: true, name: true, avatar: true } },
      },
    });
  }
}
