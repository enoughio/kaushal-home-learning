/*
  Warnings:

  - You are about to drop the column `month` on the `FeePayment` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `FeePayment` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `SalaryPayment` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `SalaryPayment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,date]` on the table `FeePayment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[teacherId,date]` on the table `SalaryPayment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `FeePayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `SalaryPayment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."FeePayment_month_year_idx";

-- DropIndex
DROP INDEX "public"."FeePayment_studentId_month_year_key";

-- DropIndex
DROP INDEX "public"."SalaryPayment_month_year_idx";

-- DropIndex
DROP INDEX "public"."SalaryPayment_teacherId_month_year_key";

-- AlterTable
ALTER TABLE "FeePayment" DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SalaryPayment" DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';

-- CreateIndex
CREATE INDEX "FeePayment_date_idx" ON "FeePayment"("date");

-- CreateIndex
CREATE UNIQUE INDEX "FeePayment_studentId_date_key" ON "FeePayment"("studentId", "date");

-- CreateIndex
CREATE INDEX "SalaryPayment_date_idx" ON "SalaryPayment"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SalaryPayment_teacherId_date_key" ON "SalaryPayment"("teacherId", "date");
