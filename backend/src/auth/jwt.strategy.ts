import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service";
import { jwtConstants } from "../common/constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    console.log("========== JWT VALIDATE ==========");
    console.log("PAYLOAD:", payload);

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    console.log("DB USER:", {
      id: user?.id,
      email: user?.email,
      isAdmin: user?.isAdmin,
    });

    if (!user) {
      console.log("❌ USER BULUNAMADI");
      throw new UnauthorizedException();
    }

    const currentUser = {
      sub: user.id,
      email: user.email,
      role: user.isAdmin ? "admin" : "user",
      isAdmin: user.isAdmin,
    };

    console.log("REQUEST USER:", currentUser);
    console.log("==============================");

    return currentUser;
  }
}