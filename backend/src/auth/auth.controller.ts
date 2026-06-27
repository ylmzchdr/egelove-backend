import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Query, Req, Res } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUser } from "./current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body("refreshToken") refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: any) {
    return this.authService.logout(user.sub);
  }

  @Get("verify-email")
  async verifyEmail(@Query("token") token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async resendVerification(@CurrentUser() user: any) {
    return this.authService.resendVerification(user.sub);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async forgotPassword(@Body("email") email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async resetPassword(
    @Body("email") email: string, 
    @Body("code") code: string, 
    @Body("newPassword") newPassword: string
  ) {
    return this.authService.resetPassword(email, code, newPassword);
  }

  // === GOOGLE INTERNET GİRİŞ KAPISI ===
    // === GOOGLE INTERNET GİRİŞ KAPISI ===
    // === PEMBE PANJUR TARZI GOOGLE GİRİŞ KAPISI ===
  @Get("login/google") // <-- Burayı "login/google" yaptık ortak!
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    return { message: "Google auth tetiklendi" };
  }

  // === GOOGLE DOĞRULAMA DÖNÜŞ NOKTASI ===
 @Get("google/callback")
@UseGuards(AuthGuard("google"))
async googleAuthRedirect(@Req() req: any, @Res() res: any) {
  const result = await this.authService.googleLogin(req.user);

  const frontendUrl = "https://egelove.tr";

  return res.redirect(
    `${frontendUrl}/auth/callback?accessToken=${encodeURIComponent(
      result.accessToken,
    )}&refreshToken=${encodeURIComponent(result.refreshToken)}`
  );
}
}
