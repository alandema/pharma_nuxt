/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address_number" TEXT,
ADD COLUMN     "birth_date" DATE,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "council" TEXT,
ADD COLUMN     "council_number" TEXT,
ADD COLUMN     "council_state" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "professional_type" TEXT,
ADD COLUMN     "specialties" JSONB,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "street" TEXT,
ADD COLUMN     "zipcode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
