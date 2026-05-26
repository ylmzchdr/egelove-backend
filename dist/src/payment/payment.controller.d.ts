import type { Request } from "express";
import { PaymentService } from "./payment.service";
export declare class PaymentController {
    private paymentService;
    constructor(paymentService: PaymentService);
    handleWebhook(signature: string, forwardedFor: string, req: Request): Promise<{
        status: string;
        webhookLogId?: undefined;
        premiumExpiresAt?: undefined;
    } | {
        status: string;
        webhookLogId: string;
        premiumExpiresAt: Date;
    }>;
}
