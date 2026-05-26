import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    private prisma;
    server: Server;
    constructor(jwtService: JwtService, prisma: PrismaService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleMessage(client: Socket, data: {
        conversationId: string;
        content: string;
    }): Promise<void>;
    handleJoinConversation(client: Socket, conversationId: string): Promise<void>;
    handleRead(client: Socket, conversationId: string): Promise<void>;
    handleTypingStart(client: Socket, conversationId: string): Promise<void>;
    handleTypingStop(client: Socket, conversationId: string): Promise<void>;
}
