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
    getMyMatches(user: any): Promise<({
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
    getMutualMatches(user: any): Promise<({
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
