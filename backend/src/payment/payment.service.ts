import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";

export enum PremiumPackage {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMI_ANNUAL = "SEMI_ANNUAL",
  ANNUAL = "ANNUAL",
}

const PACKAGE_DURATION: Record<PremiumPackage, number> = {
  [PremiumPackage.MONTHLY]: 30,
  [PremiumPackage.QUARTERLY]: 90,
  [PremiumPackage.SEMI_ANNUAL]: 180,
  [PremiumPackage.ANNUAL]: 365,
};

const PACKAGE_PRICES: Record<PremiumPackage, number> = {
  [PremiumPackage.MONTHLY]: 399.99,
  [PremiumPackage.QUARTERLY]: 999,
  [PremiumPackage.SEMI_ANNUAL]: 999,
  [PremiumPackage.ANNUAL]: 1599,
};

@Injectable()
export class PaymentService {
  private readonly shopierSecretKey = process.env.SHOPIER_SECRET_KEY || "";

  constructor(private prisma: PrismaService) {}

  getPackagePrice(pkg: PremiumPackage): number {
    return PACKAGE_PRICES[pkg];
  }

  getPackageDuration(pkg: PremiumPackage): number {
    return PACKAGE_DURATION[pkg];
  }

  async handleWebhook(rawBody: string, signature: string, ipAddress?: string) {
    const expectedSignature = crypto
      .createHmac("sha256", this.shopierSecretKey)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      throw new UnauthorizedException("Geçersiz Shopier imzası");
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new BadRequestException("Geçersiz webhook body");
    }

    const existing = await this.prisma.paymentWebhookLog.findUnique({
      where: { platformOrderId: payload.platform_order_id },
    });
    if (existing) return { status: "already_processed" };

    const userId = payload.userId || payload.user_id;
    if (!userId) throw new BadRequestException("userId gerekli");

    const pkg = payload.package_type as PremiumPackage;
    const durationDays = PACKAGE_DURATION[pkg];
    if (!durationDays) throw new BadRequestException("Geçersiz paket");

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
}
