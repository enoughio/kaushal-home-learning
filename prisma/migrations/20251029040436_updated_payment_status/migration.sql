/*
  Warnings:

  - The `status` column on the `Payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'PENDING', 'FAILED');

-- AlterTable
ALTER TABLE "Payments" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'SUCCESS';

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
