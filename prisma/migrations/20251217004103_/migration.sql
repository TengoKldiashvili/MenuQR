-- AlterTable
ALTER TABLE "EmailVerificationCode" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0;
