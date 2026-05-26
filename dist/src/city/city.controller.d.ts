import { CityService } from "./city.service";
export declare class CityController {
    private cityService;
    constructor(cityService: CityService);
    getAll(): Promise<({
        districts: {
            name: string;
            id: number;
            cityId: number;
        }[];
    } & {
        name: string;
        id: number;
    })[]>;
    getDistricts(id: string): Promise<{
        name: string;
        id: number;
        cityId: number;
    }[]>;
}
