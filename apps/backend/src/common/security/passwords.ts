import * as bcrypt from "bcrypt";
import { PASSWORD_BCRYPT_ROUNDS } from "./constants";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, PASSWORD_BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export function needsRehash(passwordHash: string): boolean {
  const rounds = bcrypt.getRounds(passwordHash);

  return rounds !== PASSWORD_BCRYPT_ROUNDS;
}
