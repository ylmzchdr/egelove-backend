import { Controller, Post, Headers, Req, HttpCode, HttpStatus } from "@nestjs/common";
import type { Request } from "express";
import { PaymentService } from "./payment.service";

@Controller("payments")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post("webhook")
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers("x-shopier-signature") signature: string,
    @Headers("x-forwarded-for") forwardedFor: string,
    @Req() req: Request,
  ) {
    const rawBody = (req as any).rawBody;
    return this.paymentService.handleWebhook(rawBody, signature, forwardedFor);
  }
}
