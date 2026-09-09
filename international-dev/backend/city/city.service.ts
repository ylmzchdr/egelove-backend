import { CITIES } from "../../database/cities";
import type { CountryCode } from "../country/country.types";
import type { City } from "./city.types";

export class CityService {
  getAllCities(): City[] {
    return CITIES as City[];
  }

  getCitiesByCountry(countryCode: CountryCode): City[] {
    return (CITIES as City[]).filter(
      (city) => city.countryCode === countryCode,
    );
  }

  getCityByName(
    countryCode: CountryCode,
    cityName: string,
  ): City | undefined {
    const normalizedName = cityName.trim().toLocaleLowerCase("tr-TR");

    return this.getCitiesByCountry(countryCode).find(
      (city) =>
        city.name.toLocaleLowerCase("tr-TR") === normalizedName,
    );
  }

  isValidCity(
    countryCode: CountryCode,
    cityName: string,
  ): boolean {
    return this.getCityByName(countryCode, cityName) !== undefined;
  }
}