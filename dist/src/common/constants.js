"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
exports.jwtConstants = {
    secret: process.env.JWT_SECRET || "egelove-super-secret-jwt-key",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "egelove-super-secret-refresh-key",
    accessTokenExpiry: "15m",
    refreshTokenExpiry: "7d",
};
//# sourceMappingURL=constants.js.map