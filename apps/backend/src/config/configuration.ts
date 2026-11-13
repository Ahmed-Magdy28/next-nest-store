export default () => ({
  port: Number(process.env.PORT || process.env.BACKEND_PORT) || 3001,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  adminSecret: process.env.ADMIN_SECRET,
  enableGuestCart: process.env.ENABLE_GUEST_CART === "true",
  corsOrigin:
    process.env.CORS_ORIGIN ??
    (process.env.NODE_ENV === "production"
      ? undefined
      : "http://localhost:4000,http://localhost:4005"),
});
