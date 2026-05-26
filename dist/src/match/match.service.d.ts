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
    getMyMatches(userId: string): Promise<({
        sender: {
            name: string;
            id: string;
            avatar: string | null;
            cityId: number;
        };
        receiver: {
            name: string;
            id: string;
            avatar: string | null;
            cityId: number;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        senderId: string;
        receiverId: string;
        isMutual: boolean;
    })[]>;
    getMutualMatches(userId: string): Promise<({
        sender: {
            name: string;
            id: string;
            avatar: string | null;
        };
        receiver: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        senderId: string;
        receiverId: string;
        isMutual: boolean;
    })[]>;
}
