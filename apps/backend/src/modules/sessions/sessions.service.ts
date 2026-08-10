import { Injectable } from "@nestjs/common";
import type { Session, SessionStatus } from "@repo/database";

import { SessionsRepository } from "./repositories/sessions.repository";

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  create(data: {
    userId: string;
    refreshTokenHash: string | null;
    expiresAt: Date;
    status: SessionStatus;
  }): Promise<Session> {
    return this.sessionsRepository.create(data);
  }

  findById(id: string): Promise<Session | null> {
    return this.sessionsRepository.findById(id);
  }

  findActiveByUserId(userId: string): Promise<Session[]> {
    return this.sessionsRepository.findActiveByUserId(userId);
  }

  countActiveByUserId(userId: string): Promise<number> {
    return this.sessionsRepository.countActiveByUserId(userId);
  }

  activate(id: string): Promise<Session> {
    return this.sessionsRepository.activate(id);
  }

  updateRefreshTokenHash(
    id: string,
    refreshTokenHash: string,
  ): Promise<Session> {
    return this.sessionsRepository.updateRefreshTokenHash(id, refreshTokenHash);
  }

  revoke(id: string): Promise<Session> {
    return this.sessionsRepository.revoke(id);
  }
}
