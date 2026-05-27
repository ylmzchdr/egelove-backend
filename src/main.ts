import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { validateEnv } from "./common/env.validation";
import * as express from "express";
import * as path from "path";

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3001,http://localhost:3002,http://localhost:3000")
    .split(",")
    .map((s) => s.trim());

  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "https:", "data:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "https:", "data:"],
        connectSrc: ["'self'", ...allowedOrigins, process.env.RENDER_EXTERNAL_URL || "https://egelove-backend.onrender.com"].filter(Boolean),
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
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, allowedOrigins[0]);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-shopier-signature"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend çalışıyor: http://localhost:${port}`);
}
bootstrap();
