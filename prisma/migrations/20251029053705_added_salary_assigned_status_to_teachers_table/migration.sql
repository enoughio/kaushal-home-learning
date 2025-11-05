/*
  Warnings:

  - The `status` column on the `FeePayment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FeePayment" DROP COLUMN "status",
ADD COLUMN     "status" "FeeStatus" NOT NULL DEFAULT 'DUE';

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "salary_assigned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
