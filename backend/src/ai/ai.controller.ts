import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import { AiService } from "./ai.service.js";

@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get("egematch/me")
  @UseGuards(JwtAuthGuard)
  async getMyEgeMatch(@CurrentUser() user: any) {
    return this.aiService.calculateMyEgeMatch(user.sub);
  }
}