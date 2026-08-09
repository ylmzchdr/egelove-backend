import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class SearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async count(where: Prisma.UserWhereInput) {
    return this.prisma.user.count({
      where,
    });
  }

  async search(
    where: Prisma.UserWhereInput,
    page: number,
    limit: number,
  ) {
    return this.prisma.user.findMany({
      where,

      skip: (page - 1) * limit,

      take: limit,

      select: {
        id: true,
        username: true,
        name: true,
        birthDate: true,
        avatar: true,
        isVerified: true,
        premiumExpiresAt: true,
        lastLoginAt: true,

        city: {
          select: {
            id: true,
            name: true,
          },
        },

        district: {
          select: {
            id: true,
            name: true,
          },
        },

        presence: {
          select: {
            isOnline: true,
            lastSeen: true,
          },
        },

        photos: {
          where: {
            status: "APPROVED",
            isMain: true,
          },
          take: 1,
          select: {
            url: true,
            thumbnail: true,
          },
        },
      },

      orderBy: [
        {
          premiumExpiresAt: "desc",
        },
        {
          lastLoginAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  }
}