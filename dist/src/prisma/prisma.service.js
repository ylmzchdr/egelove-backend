"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    connected = false;
    constructor() {
        const rawUrl = process.env.DATABASE_URL || "";
        const hasParams = rawUrl.includes("?");
        const sslUrl = rawUrl
            ? hasParams
                ? rawUrl.includes("sslmode")
                    ? rawUrl
                    : `${rawUrl}&sslmode=require`
                : `${rawUrl}?sslmode=require`
            : rawUrl;
        if (rawUrl && rawUrl !== sslUrl) {
            process.env.DATABASE_URL = sslUrl;
        }
        super({
            log: ["warn", "error"],
            errorFormat: "pretty",
            datasources: rawUrl ? { db: { url: sslUrl } } : undefined,
        });
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.connected = true;
            this.logger.log("Veritabanına bağlanıldı");
        }
        catch (e) {
            this.logger.warn(`Veritabanı bağlantısı başarısız: ${e.message}`);
            this.logger.warn("Uygulama DB olmadan başlatılacak — sınırlı işlevsellik");
        }
    }
    get isConnected() {
        return this.connected;
    }
    async onModuleDestroy() {
        if (this.connected) {
            await this.$disconnect();
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map