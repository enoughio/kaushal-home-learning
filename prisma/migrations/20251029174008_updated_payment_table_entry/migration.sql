/*
  Warnings:

  - You are about to drop the column `amount` on the `FeePayment` table. All the data in the column will be lost.
  - Added the required column `total_amount` to the `FeePayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeePayment" DROP COLUMN "amount",
ADD COLUMN     "total_amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
