import { Controller, Get, UseGuards, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";

@Controller()
export class GoogleAuthController {
  
  @Get("auth/google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Req() req: Request): Promise<void> {
    // Google yönlendirmesi otomatik tetiklenir
  }

  @Get("auth/google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = req.user as any;

    if (!user || !user.accessToken) {
      return res.redirect("http://localhost:3000?error=google_auth_failed");
    }

    // Token'ları query parameter'a ekle
    return res.redirect(
      `http://localhost:3000/callback?accessToken=${encodeURIComponent(user.accessToken)}&refreshToken=${encodeURIComponent(user.refreshToken)}`
    );
  }
}
