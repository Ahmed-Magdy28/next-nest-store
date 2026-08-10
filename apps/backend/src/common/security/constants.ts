export const CSV_DANGEROUS_PREFIXES = ["=", "+", "-", "@", "\t", "\r"] as const;
export const PASSWORD_BCRYPT_ROUNDS = 12;
export const ACCESS_TOKEN_TYPE = "access";
export const REFRESH_TOKEN_TYPE = "refresh";
export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";
export const REFRESH_TOKEN_SESSION_TTL = 7 * 24 * 60 * 60 * 1000;
