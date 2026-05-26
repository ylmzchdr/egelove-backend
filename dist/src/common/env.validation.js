"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
function validateEnv() {
    const required = [
        "DATABASE_URL",
        "JWT_SECRET",
        "JWT_REFRESH_SECRET",
        "SHOPIER_SECRET_KEY",
        "TURNSTILE_SECRET_KEY",
        "CORS_ORIGIN",
    ];
    const missing = required.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Eksik çevre değişkenleri: ${missing.join(", ")}`);
    }
}
//# sourceMappingURL=env.validation.js.map