import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { TwofaService } from "./twofa.service";

@Controller("2fa")
@UseGuards(JwtAuthGuard)
export class TwofaController {
  constructor(private twofaService: TwofaService) {}

  @Post("generate")
  async generate(@CurrentUser() user: any) {
    return this.twofaService.generateSecret(user.sub);
  }

  @Post("enable")
  async enable(@CurrentUser() user: any, @Body("token") token: string) {
    return this.twofaService.enable(user.sub, token);
  }

  @Post("disable")
  async disable(@CurrentUser() user: any, @Body("token") token: string) {
    return this.twofaService.disable(user.sub, token);
  }

  @Post("verify")
  async verify(@CurrentUser() user: any, @Body("token") token: string) {
    const valid = await this.twofaService.verifyToken(user.sub, token);
    return { valid };
  }
}
