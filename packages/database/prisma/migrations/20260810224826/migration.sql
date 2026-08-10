-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'ACTIVE', 'REVOKED');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE';
