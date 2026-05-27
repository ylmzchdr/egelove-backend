import { PrismaService } from "../prisma/prisma.service";
export declare class MessageController {
    private prisma;
    constructor(prisma: PrismaService);
    createOrGetConversation(user: any, otherUserId: string): Promise<{
        _count: {
            messages: number;
        };
        user1: {
            name: string;
            id: string;
            surname: string;
            birthDate: Date;
            avatar: string | null;
            city: {
                name: string;
            };
            district: {
                name: string;
            };
        };
        user2: {
            name: string;
            id: string;
            surname: string;
            birthDate: Date;
            avatar: string | null;
            city: {
                name: string;
            };
            district: {
                name: string;
            };
        };
        messages: ({
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
            conversationId: string;
            content: string;
        })[];
        reads: {
            userId: string;
            lastReadAt: Date;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        user1Id: string;
        user2Id: string;
    }>;
    getMyConversations(user: any, page?: string, limit?: string): Promise<{
        conversations: ({
            _count: {
                messages: number;
            };
            user1: {
                name: string;
                id: string;
                surname: string;
                birthDate: Date;
                avatar: string | null;
                city: {
                    name: string;
                };
                district: {
                    name: string;
                };
            };
            user2: {
                name: string;
                id: string;
                surname: string;
                birthDate: Date;
                avatar: string | null;
                city: {
                    name: string;
                };
                district: {
                    name: string;
                };
            };
            messages: ({
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
                conversationId: string;
                content: string;
            })[];
            reads: {
                userId: string;
                lastReadAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            user1Id: string;
            user2Id: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getMessages(user: any, conversationId: string, page?: string, limit?: string): Promise<{
        messages: ({
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
            conversationId: string;
            content: string;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    sendMessage(user: any, conversationId: string, content: string): Promise<{
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
        conversationId: string;
        content: string;
    }>;
    private conversationInclude;
}
