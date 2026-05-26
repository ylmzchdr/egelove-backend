import { PrismaService } from "../prisma/prisma.service";
export declare class MessageController {
    private prisma;
    constructor(prisma: PrismaService);
    createOrGetConversation(user: any, otherUserId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        user1Id: string;
        user2Id: string;
    }>;
    getMyConversations(user: any): Promise<({
        user1: {
            name: string;
            id: string;
            avatar: string | null;
        };
        user2: {
            name: string;
            id: string;
            avatar: string | null;
        };
        messages: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            senderId: string;
            content: string;
            conversationId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        user1Id: string;
        user2Id: string;
    })[]>;
    getMessages(user: any, conversationId: string): Promise<({
        sender: {
            name: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        senderId: string;
        content: string;
        conversationId: string;
    })[] | {
        error: string;
    }>;
}
