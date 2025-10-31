/*
  Warnings:

  - You are about to drop the column `date` on the `FeePayment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,paidAt]` on the table `FeePayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paidAt` to the `FeePayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."FeePayment_date_idx";

-- DropIndex
DROP INDEX "public"."FeePayment_studentId_date_key";

-- AlterTable
ALTER TABLE "FeePayment" DROP COLUMN "date",
ADD COLUMN     "paidAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';

-- CreateIndex
CREATE INDEX "FeePayment_paidAt_idx" ON "FeePayment"("paidAt");

-- CreateIndex
CREATE UNIQUE INDEX "FeePayment_studentId_paidAt_key" ON "FeePayment"("studentId", "paidAt");
