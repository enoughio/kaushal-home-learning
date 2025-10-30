-- AlterTable
ALTER TABLE "students" ADD COLUMN     "fee_assigned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
