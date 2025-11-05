/*
  Warnings:

  - Made the column `home_latitude` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `home_longitude` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "temp_users" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '24 hours';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "home_latitude" SET NOT NULL,
ALTER COLUMN "home_longitude" SET NOT NULL;
