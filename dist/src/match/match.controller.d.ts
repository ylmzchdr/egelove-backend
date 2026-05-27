import { MatchService } from "./match.service";
export declare class MatchController {
    private matchService;
    constructor(matchService: MatchService);
    likeUser(user: any, targetUserId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        senderId: string;
        receiverId: string;
        isMutual: boolean;
    }>;
    unlikeUser(user: any, targetUserId: string): Promise<void>;
    getMyMatches(user: any, page?: string, limit?: string): Promise<{
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
    getMutualMatches(user: any, page?: string, limit?: string): Promise<{
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
