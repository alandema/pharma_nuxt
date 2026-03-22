/*
  Warnings:

  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address_number` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birth_date` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `council` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `council_number` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `council_state` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cpf` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `full_name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `professional_type` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specialties` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `zipcode` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "address_number" SET NOT NULL,
ALTER COLUMN "birth_date" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "council" SET NOT NULL,
ALTER COLUMN "council_number" SET NOT NULL,
ALTER COLUMN "council_state" SET NOT NULL,
ALTER COLUMN "cpf" SET NOT NULL,
ALTER COLUMN "full_name" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "professional_type" SET NOT NULL,
ALTER COLUMN "specialties" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "zipcode" SET NOT NULL;
