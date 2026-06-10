import { Controller, Get, Param } from "@nestjs/common";
import { CityService } from "./city.service";

@Controller("cities")
export class CityController {
  constructor(private cityService: CityService) {}

  @Get()
  async getAll() {
    return this.cityService.getAllCities();
  }

  @Get(":id/districts")
  async getDistricts(@Param("id") id: string) {
    return this.cityService.getDistricts(Number(id));
  }
}
