/*
  Warnings:

  - You are about to drop the `cids` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medications` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `registered_by` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "registered_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "prescriptions" ADD COLUMN     "prescribed_by" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "cids";

-- DropTable
DROP TABLE "medications";

-- CreateTable
CREATE TABLE "formulas" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "information" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "formulas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "formulas_name_key" ON "formulas"("name");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_registered_by_fkey" FOREIGN KEY ("registered_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_prescribed_by_fkey" FOREIGN KEY ("prescribed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
