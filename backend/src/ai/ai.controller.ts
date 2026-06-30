import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
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

  @Get("egematch/:targetUserId")
  @UseGuards(JwtAuthGuard)
  async getUserToUserEgeMatch(
    @CurrentUser() user: any,
    @Param("targetUserId") targetUserId: string,
    @Query("lang") lang = "TR",
  ) {
    return this.aiService.calculateUserToUserEgeMatch(
      user.sub,
      targetUserId,
      lang,
    );
  }
}