/*
  Warnings:

  - The `status` column on the `SalaryPayment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SalaryStatus" AS ENUM ('PAID', 'UNPAID');

-- CreateEnum
CREATE TYPE "FeeStatus" AS ENUM ('DUE', 'PAID', 'OVERDUE');

-- AlterTable
ALTER TABLE "FeePayment" ALTER COLUMN "status" SET DEFAULT 'DUE';

-- AlterTable
ALTER TABLE "SalaryPayment" DROP COLUMN "status",
ADD COLUMN     "status" "SalaryStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
