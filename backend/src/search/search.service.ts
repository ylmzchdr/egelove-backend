import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SearchDto } from "./dto/search.dto";
import { SearchQueryBuilder } from "./builders/search-query.builder";
import { SearchMapper } from "./helpers/search.mapper";

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(dto: SearchDto) {
   const where = new SearchQueryBuilder()
  .byUsername(dto.username)
  .byGender(dto.gender)
  .byCity(dto.cityId)
  .byDistrict(dto.districtId)
  .byAge(dto.minAge, dto.maxAge)
  .byEducation(dto.education)
  .bySmoking(dto.smoking)
  .byAlcohol(dto.alcohol)
  .byMaritalStatus(dto.maritalStatus)
  .byChildren(dto.children)
  .byReligion(dto.religion)
  .byBodyType(dto.bodyType)
  .byIncome(dto.income)
  .byHeight(dto.minHeight, dto.maxHeight)
  .byWeight(dto.minWeight, dto.maxWeight)
  .byOccupation(dto.occupation)
  .byVerified(dto.verified)
  .byPremium(dto.premium)
  .byOnline(dto.online)
  .byPhoto(dto.hasPhoto)
  .build();

    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;

    const [total, users] = await Promise.all([
      this.prisma.user.count({
        where,
      }),

      this.prisma.user.findMany({
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
      }),
    ]);

   return {
  total,
  page,
  limit,
  pages: Math.ceil(total / limit),
  users: users.map((user) => SearchMapper.user(user)),
};
  }
}