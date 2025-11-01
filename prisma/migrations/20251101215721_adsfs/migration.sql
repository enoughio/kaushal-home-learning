/*
  Warnings:

  - You are about to drop the column `graded_at` on the `assignment_submissions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignment_id,student_id]` on the table `assignment_submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "assignment_submissions" DROP COLUMN "graded_at",
ADD COLUMN     "file_name" TEXT,
ADD COLUMN     "file_url" TEXT,
ADD COLUMN     "file_url_publicId" TEXT,
ADD COLUMN     "mime_type" TEXT;

-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';

-- CreateIndex
CREATE UNIQUE INDEX "assignment_submissions_assignment_id_student_id_key" ON "assignment_submissions"("assignment_id", "student_id");
