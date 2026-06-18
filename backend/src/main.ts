process.env.DATABASE_URL = "mysql://root:@127.0.0.1:3306/egelove";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { HttpsRedirectMiddleware } from "./common/middleware/https-redirect.middleware";
import { validateEnv } from "./common/env.validation";

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.use(helmet());
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
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
  app.use(helmet.referrerPolicy({ policy: "strict-origin-when-cross-origin" }));
  app.use(helmet.frameguard({ action: "deny" }));
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());

 // app.use(new HttpsRedirectMiddleware().use);

  app.enableCors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-shopier-signature"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend çalışıyor: http://localhost:${port}`);
}
bootstrap();
