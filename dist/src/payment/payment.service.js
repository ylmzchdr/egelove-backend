"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = exports.PremiumPackage = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const prisma_service_1 = require("../prisma/prisma.service");
var PremiumPackage;
(function (PremiumPackage) {
    PremiumPackage["MONTHLY"] = "MONTHLY";
    PremiumPackage["QUARTERLY"] = "QUARTERLY";
    PremiumPackage["SEMI_ANNUAL"] = "SEMI_ANNUAL";
    PremiumPackage["ANNUAL"] = "ANNUAL";
})(PremiumPackage || (exports.PremiumPackage = PremiumPackage = {}));
const PACKAGE_DURATION = {
    [PremiumPackage.MONTHLY]: 30,
    [PremiumPackage.QUARTERLY]: 90,
    [PremiumPackage.SEMI_ANNUAL]: 180,
    [PremiumPackage.ANNUAL]: 365,
};
const PACKAGE_PRICES = {
    [PremiumPackage.MONTHLY]: 399.99,
    [PremiumPackage.QUARTERLY]: 999,
    [PremiumPackage.SEMI_ANNUAL]: 999,
    [PremiumPackage.ANNUAL]: 1599,
};
let PaymentService = class PaymentService {
    prisma;
    shopierSecretKey = process.env.SHOPIER_SECRET_KEY || "";
    constructor(prisma) {
        this.prisma = prisma;
    }
    getPackagePrice(pkg) {
        return PACKAGE_PRICES[pkg];
    }
    getPackageDuration(pkg) {
        return PACKAGE_DURATION[pkg];
    }
    async handleWebhook(rawBody, signature, ipAddress) {
        const expectedSignature = crypto
            .createHmac("sha256", this.shopierSecretKey)
            .update(rawBody)
            .digest("hex");
        if (signature !== expectedSignature) {
            throw new common_1.UnauthorizedException("Geçersiz Shopier imzası");
        }
        let payload;
        try {
            payload = JSON.parse(rawBody);
        }
        catch {
            throw new common_1.BadRequestException("Geçersiz webhook body");
        }
        const existing = await this.prisma.paymentWebhookLog.findUnique({
            where: { platformOrderId: payload.platform_order_id },
        });
        if (existing)
            return { status: "already_processed" };
        const userId = payload.userId || payload.user_id;
        if (!userId)
            throw new common_1.BadRequestException("userId gerekli");
        const pkg = payload.package_type;
        const durationDays = PACKAGE_DURATION[pkg];
        if (!durationDays)
            throw new common_1.BadRequestException("Geçersiz paket");
        const webhookLog = await this.prisma.paymentWebhookLog.create({
            data: {
                userId,
                platformOrderId: payload.platform_order_id,
                packageType: pkg,
                amount: payload.amount || PACKAGE_PRICES[pkg],
                currency: payload.currency || "TRY",
                status: "completed",
                rawBody,
                signature,
                ipAddress,
            },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const currentExpiry = user?.premiumExpiresAt || new Date();
        const newExpiry = new Date(Math.max(currentExpiry.getTime(), Date.now()));
        newExpiry.setDate(newExpiry.getDate() + durationDays);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                premiumExpiresAt: newExpiry,
                isPremiumCandidate: true,
            },
        });
        return { status: "success", webhookLogId: webhookLog.id, premiumExpiresAt: newExpiry };
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map