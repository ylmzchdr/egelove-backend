import { PrismaService } from "../prisma/prisma.service";
export declare class CityService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllCities(): Promise<({
        districts: {
            name: string;
            id: number;
            cityId: number;
        }[];
    } & {
        name: string;
        id: number;
    })[]>;
    getDistricts(cityId: number): Promise<{
        name: string;
        id: number;
        cityId: number;
    }[]>;
}
