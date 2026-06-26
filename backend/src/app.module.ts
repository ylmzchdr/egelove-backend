import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { MatchModule } from "./match/match.module";
import { MessageModule } from "./message/message.module";
import { ChatModule } from "./chat/chat.module";
import { PaymentModule } from "./payment/payment.module";
import { PhotoModule } from "./photo/photo.module";
import { CityModule } from "./city/city.module";
import { AuditModule } from "./common/audit/audit.module";
import { EmailModule } from "./email/email.module";
import { TwofaModule } from "./twofa/twofa.module";
import { AdminModule } from "./admin/admin.module";
import { TranslateModule } from "./translate/translate.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ThrottlerModule.forRoot([
      { name: "default", ttl: 60000, limit: 100 },
      { name: "auth", ttl: 60000, limit: 10 },
      { name: "register", ttl: 60000, limit: 5 },
      { name: "upload", ttl: 60000, limit: 20 },
    ]),

    PrismaModule,
    AuthModule,
    UserModule,
    MatchModule,
    MessageModule,
    ChatModule,
    PaymentModule,
    PhotoModule,
    CityModule,
    AuditModule,
    EmailModule,
    TwofaModule,
    AdminModule,
    TranslateModule,
  ],
})
export class AppModule {}