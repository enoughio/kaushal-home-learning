-- AlterTable
ALTER TABLE "students" ADD COLUMN     "assigned_teacher_id" INTEGER;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_assigned_teacher_id_fkey" FOREIGN KEY ("assigned_teacher_id") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
