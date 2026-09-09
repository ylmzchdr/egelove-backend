import { Controller, Get, Param } from "@nestjs/common";
import { CityService } from "./city.service";

@Controller("cities")
export class CityController {
  constructor(private cityService: CityService) {}

  @Get()
  async getAll() {
    return this.cityService.getAllCities();
  }

  @Get("countries")
  async getCountries() {
    return this.cityService.getCountries();
  }

  @Get("country/:id")
  async getCitiesByCountry(
    @Param("id") id: string,
  ) {
    return this.cityService.getCitiesByCountry(
      Number(id),
    );
  }

  @Get(":id/districts")
  async getDistricts(
    @Param("id") id: string,
  ) {
    return this.cityService.getDistricts(
      Number(id),
    );
  }
}