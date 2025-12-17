/*
  Warnings:

  - The primary key for the `EmailVerificationCode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attempts` on the `EmailVerificationCode` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `EmailVerificationCode` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - Added the required column `passwordHash` to the `EmailVerificationCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "EmailVerificationCode_email_idx";

-- AlterTable
ALTER TABLE "EmailVerificationCode" DROP CONSTRAINT "EmailVerificationCode_pkey",
DROP COLUMN "attempts",
DROP COLUMN "id",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD CONSTRAINT "EmailVerificationCode_pkey" PRIMARY KEY ("email");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified";

-- CreateIndex
CREATE INDEX "EmailVerificationCode_expiresAt_idx" ON "EmailVerificationCode"("expiresAt");
