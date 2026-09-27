import { Injectable } from "@nestjs/common";
import { PrismaService, SessionStatus, type Session } from "@repo/database";

@Injectable()
export class SessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    userId: string;
    refreshTokenHash: string | null;
    expiresAt: Date;
    status: SessionStatus;
    userAgent?: string | null;
    ipAddress?: string | null;
  }): Promise<Session> {
    return this.prisma.session.create({
      data,
    });
  }

  async findActiveByDevice(
    userId: string,
    userAgent: string,
    ipAddress?: string,
  ): Promise<Session | null> {
    return this.prisma.session.findFirst({
      where: {
        userId,
        status: "ACTIVE",
        userAgent,
        ...(ipAddress ? { ipAddress } : {}),
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  countPendingByUserId(userId: string): Promise<number> {
    return this.prisma.session.count({
      where: { userId, status: SessionStatus.PENDING },
    });
  }

  countRevokedByUserId(userId: string): Promise<number> {
    return this.prisma.session.count({
      where: { userId, status: SessionStatus.REVOKED },
    });
  }

  deleteExpiredByUserId(userId: string): Promise<{ count: number }> {
    return this.prisma.session.deleteMany({
      where: {
        userId,
        expiresAt: { lte: new Date() },
      },
    });
  }

  findById(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: { id },
    });
  }

  findByUserId(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
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

  touchLastUsed(id: string): Promise<Session> {
    return this.prisma.session.update({
      where: { id },
      data: { lastUsedAt: new Date() },
    });
  }

  findPendingByUserId(userId: string): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: {
        userId,
        status: SessionStatus.PENDING,
      },
      orderBy: {
        createdAt: "asc",
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
        status: SessionStatus.ACTIVE,
        revokedAt: null,
      },
    });
  }

  async revokeAndActivatePending(
    userId: string,
    sessionId: string,
  ): Promise<Session | null> {
    return this.prisma.$transaction(async (tx) => {
      const targetSession = await tx.session.findUnique({
        where: { id: sessionId },
      });

      if (!targetSession || targetSession.userId !== userId) {
        return null;
      }

      if (targetSession.status === SessionStatus.REVOKED) {
        return targetSession;
      }

      const revokedSession = await tx.session.update({
        where: { id: targetSession.id },
        data: {
          status: SessionStatus.REVOKED,
          revokedAt: new Date(),
        },
      });

      if (targetSession.status !== SessionStatus.ACTIVE) {
        return revokedSession;
      }

      const nextPendingSession = await tx.session.findFirst({
        where: {
          userId,
          status: SessionStatus.PENDING,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (!nextPendingSession) {
        return revokedSession;
      }

      return tx.session.update({
        where: { id: nextPendingSession.id },
        data: {
          status: SessionStatus.ACTIVE,
          revokedAt: null,
        },
      });
    });
  }
  countByUserId(userId: string): Promise<number> {
    return this.prisma.session.count({
      where: { userId },
    });
  }

  async deleteOldestRevoked(userId: string, count: number): Promise<void> {
    const oldest = await this.prisma.session.findMany({
      where: {
        userId,
        status: SessionStatus.REVOKED,
      },
      orderBy: { createdAt: "asc" },
      take: count,
      select: { id: true },
    });

    if (oldest.length === 0) return;

    await this.prisma.session.deleteMany({
      where: { id: { in: oldest.map((s) => s.id) } },
    });
  }

  revokeAllByUserId(userId: string): Promise<{ count: number }> {
    return this.prisma.session.updateMany({
      where: { userId },
      data: {
        status: SessionStatus.REVOKED,
        revokedAt: new Date(),
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
        status: SessionStatus.REVOKED,
        revokedAt: new Date(),
      },
    });
  }
}
