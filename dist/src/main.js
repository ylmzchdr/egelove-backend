"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const env_validation_1 = require("./common/env.validation");
async function bootstrap() {
    (0, env_validation_1.validateEnv)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    app.use((0, helmet_1.default)());
    app.use(helmet_1.default.contentSecurityPolicy({
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
    }));
    app.use(helmet_1.default.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
    app.use(helmet_1.default.referrerPolicy({ policy: "strict-origin-when-cross-origin" }));
    app.use(helmet_1.default.frameguard({ action: "deny" }));
    app.use(helmet_1.default.noSniff());
    app.use(helmet_1.default.xssFilter());
    app.enableCors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3001",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "x-shopier-signature"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Backend çalışıyor: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map