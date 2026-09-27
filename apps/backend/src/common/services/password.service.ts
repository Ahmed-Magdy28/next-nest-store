import { Injectable } from "@nestjs/common";
import { hashPassword, verifyPassword } from "../security";

@Injectable()
export class PasswordService {
  hash(password: string): Promise<string> {
    return hashPassword(password);
  }

  compare(password: string, passwordHash: string): Promise<boolean> {
    return verifyPassword(password, passwordHash);
  }
}
