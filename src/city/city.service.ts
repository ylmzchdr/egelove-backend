import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async getAllCities() {
    return this.prisma.city.findMany({ include: { districts: true } });
  }

  async getDistricts(cityId: number) {
    return this.prisma.district.findMany({ where: { cityId } });
  }
}
