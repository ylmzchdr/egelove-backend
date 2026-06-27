import * as dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import * as express from "express";
import { join } from "path";

import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  // SECURITY
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    }),
  );

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https:", "data:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
      },
    }),
  );

  app.use(
    helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    }),
  );

  app.use(
    helmet.referrerPolicy({
      policy: "strict-origin-when-cross-origin",
    }),
  );

  app.use(helmet.frameguard({ action: "deny" }));

  // STATIC FILES
  app.use(
    "/uploads",
    express.static(join(process.cwd(), "uploads")),
  );

  // CORS
app.enableCors({
  origin: [
    "https://egelove.tr",
    "https://www.egelove.tr",
    "https://egelove.vercel.app",
    "https://api.egelove.tr",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

  // VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // GLOBAL ERROR HANDLER
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3001;

  await app.listen(port);

  console.log(`🚀 Backend çalışıyor: http://localhost:${port}`);
}

bootstrap();