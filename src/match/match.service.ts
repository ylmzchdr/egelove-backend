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

  async getMyMatches(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
        where: { OR: [{ senderId: userId }, { receiverId: userId }] },
        skip,
        take: limit,
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
      orderBy: { createdAt: "desc" },
    }),
    this.prisma.match.count({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),
  ]);
  return { matches, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getMutualMatches(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [matches, total] = await Promise.all([
      this.prisma.match.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }], isMutual: true, isActive: true },
      skip,
      take: limit,
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
      orderBy: { createdAt: "desc" },
    }),
    this.prisma.match.count({
      where: { OR: [{ senderId: userId }, { receiverId: userId }], isMutual: true, isActive: true },
    }),
  ]);
  return { matches, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
