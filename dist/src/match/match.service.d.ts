import { PrismaService } from "../prisma/prisma.service";
export declare class MatchService {
    private prisma;
    constructor(prisma: PrismaService);
    likeUser(senderId: string, receiverId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        senderId: string;
        receiverId: string;
        isMutual: boolean;
    }>;
    unlikeUser(senderId: string, receiverId: string): Promise<void>;
    getMyMatches(userId: string, page?: number, limit?: number): Promise<{
        matches: ({
            sender: {
                name: string;
                id: string;
                surname: string;
                birthDate: Date;
                bio: string | null;
                avatar: string | null;
                isVerified: boolean;
                city: {
                    name: string;
                };
                photos: {
                    url: string;
                }[];
                cityId: number;
                districtId: number;
                district: {
                    name: string;
                };
            };
            receiver: {
                name: string;
                id: string;
                surname: string;
                birthDate: Date;
                bio: string | null;
                avatar: string | null;
                isVerified: boolean;
                city: {
                    name: string;
                };
                photos: {
                    url: string;
                }[];
                cityId: number;
                districtId: number;
                district: {
                    name: string;
                };
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            senderId: string;
            receiverId: string;
            isMutual: boolean;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getMutualMatches(userId: string, page?: number, limit?: number): Promise<{
        matches: ({
            sender: {
                name: string;
                id: string;
                surname: string;
                birthDate: Date;
                bio: string | null;
                avatar: string | null;
                isVerified: boolean;
                city: {
                    name: string;
                };
                photos: {
                    url: string;
                }[];
                cityId: number;
                districtId: number;
                district: {
                    name: string;
                };
            };
            receiver: {
                name: string;
                id: string;
                surname: string;
                birthDate: Date;
                bio: string | null;
                avatar: string | null;
                isVerified: boolean;
                city: {
                    name: string;
                };
                photos: {
                    url: string;
                }[];
                cityId: number;
                districtId: number;
                district: {
                    name: string;
                };
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            senderId: string;
            receiverId: string;
            isMutual: boolean;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
