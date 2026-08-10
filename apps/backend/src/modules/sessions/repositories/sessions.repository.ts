import { Injectable } from "@nestjs/common";
import { PrismaService } from "@repo/database";
import type { Session } from "@repo/database";

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    userId: string;
    refreshTokenHash: string | null;
    expiresAt: Date;
  }): Promise<Session> {
    return this.prisma.session.create({
      data,
    });
  }

  findById(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: { id },
    });
  }

  findActiveByUserId(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        userId,
        status: "ACTIVE",
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastUsedAt: "desc",
      },
    });
  }

  countActiveByUserId(userId: string): Promise<number> {
    return this.prisma.session.count({
      where: {
        userId,
        status: "ACTIVE",
        expiresAt: {
          gt: new Date(),
        },
      },
    });
  }

  activate(id: string): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data: {
        status: "ACTIVE",
        revokedAt: null,
      },
    });
  }

  updateRefreshTokenHash(
    id: string,
    refreshTokenHash: string,
  ): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data: { refreshTokenHash },
    });
  }

  revoke(id: string): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data: {
        status: "REVOKED",
        revokedAt: new Date(),
      },
    });
  }
}
