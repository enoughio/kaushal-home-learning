-- AlterTable
ALTER TABLE "students" ALTER COLUMN "fee_due_date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';
