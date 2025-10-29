/*
  Warnings:

  - You are about to drop the column `base_salary` on the `SalaryPayment` table. All the data in the column will be lost.
  - You are about to drop the column `bonus` on the `SalaryPayment` table. All the data in the column will be lost.
  - You are about to drop the column `deductions` on the `SalaryPayment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeePayment" ALTER COLUMN "due_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SalaryPayment" DROP COLUMN "base_salary",
DROP COLUMN "bonus",
DROP COLUMN "deductions";

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
