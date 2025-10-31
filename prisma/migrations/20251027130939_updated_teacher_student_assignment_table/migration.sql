/*
  Warnings:

  - You are about to drop the column `subject` on the `teacher_student_assignments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacher_id,student_id]` on the table `teacher_student_assignments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."teacher_student_assignments_teacher_id_student_id_subject_key";

-- AlterTable
ALTER TABLE "teacher_student_assignments" DROP COLUMN "subject";

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';

-- CreateIndex
CREATE UNIQUE INDEX "teacher_student_assignments_teacher_id_student_id_key" ON "teacher_student_assignments"("teacher_id", "student_id");
