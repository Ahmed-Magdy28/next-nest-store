/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "deviceName" TEXT,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "lastUsedAt" TIMESTAMP(3),
ADD COLUMN     "userAgent" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");
