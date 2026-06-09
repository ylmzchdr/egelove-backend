// backend/src/main.ts

// NOT: Canlıda veritabanı URL'si Render/Google Cloud ortam değişkenlerinden (process.env.DATABASE_URL) otomatik okunur.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "mysql://root:@127.0.0.1:3306/egelove";
}

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import * as express from "express";
import * as path from "path";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { HttpsRedirectMiddleware } from "./common/middleware/https-redirect.middleware";
import { validateEnv } from "./common/env.validation";

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // Uploads klasörünü dışarıya açma (Mevcut kodunuzdaki yapı korundu)
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // HELMET GÜVENLİK AYARLARI (TypeScript tip uyumluluğu için kısıtlamalar kaldırıldı ve esnetildi)
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https:", "data:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https:", "data:"],
        // DÜZELTME: TypeScript hatasını önlemek için Regex kaldırıldı, geniş wildcard (*.vercel.app) ve canlı adresler eklendi
        connectSrc: [
          "'self'", 
          "https://onrender.com", 
          "https://egelove.tr", 
          "https://egelove.tr",
          "https://*.vercel.app",
          "http://localhost:5000", 
          "http://127.0.0.1:5000", 
          "http://localhost:3000", 
          "http://127.0.0.1:3000",
          "http://localhost:3001",
          "http://localhost:3002"
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    }),
  );
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
  app.use(helmet.referrerPolicy({ policy: "strict-origin-when-cross-origin" }));
  app.use(helmet.frameguard({ action: "deny" }));
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());

  // Canlı ortamda (Render/Vercel üzerinde) HTTPS zorunluluğunu aktifleştiriyoruz
  if (process.env.NODE_ENV === "production") {
    app.use(new HttpsRedirectMiddleware().use);
  }

  // CORS AYARLARI (Gelişmiş Canlı Ortam Desteği)
  const defaultOrigins = [
    "https://egelove.tr",
    "https://egelove.tr",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:5000",
    "http://127.0.0.1:5000"
  ];

  const envOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [];

  const corsOrigins = [...defaultOrigins, ...envOrigins];

  app.enableCors({
    // origin ve callback parametrelerine açıkça tipler atanarak uyumluluk sağlandı
    origin: (origin: any, callback: any) => {
      if (!origin || corsOrigins.indexOf(origin) !== -1 || /\.vercel\.app$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Engeli: Bu domainden gelen isteklere izin verilmiyor."));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-shopier-signature", "Accept-Language", "accept-language"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  // DÜZELTME: Render'ın atadığı dinamik portu dinle, yoksa yerelde 5000'den ayağa kalk.
  const port = process.env.PORT || 5000;
  await app.listen(port, "0.0.0.0"); // 0.0.0.0 dış dünya bağlantılarını dinlemesini sağlar
  console.log(`Backend canlı dinlemede. Port: ${port}`);
}
bootstrap();
