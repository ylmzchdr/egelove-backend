export const jwtConstants = {
  secret: process.env.JWT_SECRET || "egelove-super-secret-jwt-key",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "egelove-super-secret-refresh-key",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
};
