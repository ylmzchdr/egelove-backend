import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CityService {
  constructor(private prisma: PrismaService) {}

  async getAllCities() {
    return this.prisma.city.findMany({
      include: {
        districts: true,
        country: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async getDistricts(cityId: number) {
    return this.prisma.district.findMany({
      where: {
        cityId,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async getCountries() {
    return this.prisma.country.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async getCitiesByCountry(countryId: number) {
    return this.prisma.city.findMany({
      where: {
        countryId,
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}