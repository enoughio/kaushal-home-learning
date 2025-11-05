/*
  Warnings:

  - Made the column `fee_due_date` on table `students` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "students" ALTER COLUMN "fee_due_date" SET NOT NULL;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
