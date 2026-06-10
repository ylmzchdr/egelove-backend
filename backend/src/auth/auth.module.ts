import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TwofaService } from "../twofa/twofa.service";
import { EmailModule } from "../email/email.module";
import { GoogleStrategy } from "./google.strategy";
import { JwtStrategy } from "./jwt.strategy";
// İŞTE SİNSİ 404 HATASINI BİTİREN GOOGLE CONTROLLER IMPORTU
import { GoogleAuthController } from "./auth.controller.google";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({}),
    EmailModule,
  ],
  // BURAYA GoogleAuthController'I DA EKLEYEREK KAPILARI SONUNA KADAR AÇTIK ORTAK!
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, TwofaService, GoogleStrategy, JwtStrategy],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
