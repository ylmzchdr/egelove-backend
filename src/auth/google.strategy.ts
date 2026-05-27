import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackURL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback";

    if (!clientID || !clientSecret) {
      super({ clientID: "dummy", clientSecret: "dummy", callbackURL, scope: ["email", "profile"] });
      return;
    }

    super({ clientID, clientSecret, callbackURL, scope: ["email", "profile"] });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return done(new Error("Google OAuth yapılandırılmamış"), false);
    }
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0]?.value,
      accessToken,
    };
    done(null, user);
  }
}