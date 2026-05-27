"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
function validateEnv() {
    const required = [
        "DATABASE_URL",
        "JWT_SECRET",
        "JWT_REFRESH_SECRET",
        "CORS_ORIGIN",
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Eksik çevre değişkenleri: ${missing.join(", ")}`);
    }
    if (process.env.SHOPIER_SECRET_KEY && process.env.SHOPIER_SECRET_KEY === "your-shopier-secret-key") {
        console.warn("⚠  SHOPIER_SECRET_KEY varsayılan değerde — ödeme entegrasyonu çalışmaz");
    }
    if (process.env.NODE_ENV === "production" && !process.env.TURNSTILE_SECRET_KEY) {
        console.warn("⚠  TURNSTILE_SECRET_KEY eksik — Cloudflare Turnstile doğrulaması atlanacak");
    }
}
//# sourceMappingURL=env.validation.js.map