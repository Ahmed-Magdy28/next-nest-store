export default () => ({
  port: Number(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  corsOrigin:
    process.env.CORS_ORIGIN ??
    (process.env.NODE_ENV === "production"
      ? undefined
      : "http://localhost:4000"),
});
