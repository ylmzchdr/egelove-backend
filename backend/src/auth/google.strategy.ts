import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/auth/google/callback",
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<void> {
    console.log("GOOGLE VALIDATE ÇALIŞTI");
    console.log("PROFILE =", profile);

    try {
      const user = {
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.name?.givenName || profile.displayName,
        surname: profile.name?.familyName || "",
        photo: profile.photos?.[0]?.value,
      };

      const result = await this.authService.googleLogin(user);

      done(null, {
        id: result.user.id,
        email: result.user.email,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
    } catch (error) {
      done(error);
    }
  }
}