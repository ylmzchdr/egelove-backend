import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller()
export class GoogleAuthController {

  @Get("auth/google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    return;
  }
}
