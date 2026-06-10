import { Controller, Post, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { MatchService } from "./match.service";

@Controller("matches")
@UseGuards(JwtAuthGuard)
export class MatchController {
  constructor(private matchService: MatchService) {}

  @Post("like/:targetUserId")
  async likeUser(@CurrentUser() user: any, @Param("targetUserId") targetUserId: string) {
    return this.matchService.likeUser(user.sub, targetUserId);
  }

  @Post("unlike/:targetUserId")
  async unlikeUser(@CurrentUser() user: any, @Param("targetUserId") targetUserId: string) {
    return this.matchService.unlikeUser(user.sub, targetUserId);
  }

  @Get()
  async getMyMatches(@CurrentUser() user: any) {
    return this.matchService.getMyMatches(user.sub);
  }

  @Get("mutual")
  async getMutualMatches(@CurrentUser() user: any) {
    return this.matchService.getMutualMatches(user.sub);
  }
}
