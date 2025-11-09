/*
  Warnings:

  - The primary key for the `cids` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `medications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `patients` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `prescriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cids" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_cids" ("code", "created_at", "description", "id") SELECT "code", "created_at", "description", "id" FROM "cids";
DROP TABLE "cids";
ALTER TABLE "new_cids" RENAME TO "cids";
CREATE UNIQUE INDEX "cids_code_key" ON "cids"("code");
CREATE TABLE "new_medications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "information" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_medications" ("created_at", "id", "information", "name") SELECT "created_at", "id", "information", "name" FROM "medications";
DROP TABLE "medications";
ALTER TABLE "new_medications" RENAME TO "medications";
CREATE UNIQUE INDEX "medications_name_key" ON "medications"("name");
CREATE TABLE "new_patients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rg" TEXT,
    "gender" TEXT,
    "cpf" TEXT,
    "birth_date" TEXT,
    "phone" TEXT,
    "zipcode" TEXT,
    "street" TEXT,
    "district" TEXT,
    "house_number" TEXT,
    "additional_info" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "medical_history" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_patients" ("additional_info", "birth_date", "city", "country", "cpf", "created_at", "district", "gender", "house_number", "id", "medical_history", "name", "phone", "rg", "state", "street", "zipcode") SELECT "additional_info", "birth_date", "city", "country", "cpf", "created_at", "district", "gender", "house_number", "id", "medical_history", "name", "phone", "rg", "state", "street", "zipcode" FROM "patients";
DROP TABLE "patients";
ALTER TABLE "new_patients" RENAME TO "patients";
CREATE UNIQUE INDEX "patients_cpf_key" ON "patients"("cpf");
CREATE TABLE "new_prescriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "date_prescribed" TEXT NOT NULL,
    "json_form_info" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "prescriptions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_prescriptions" ("created_at", "date_prescribed", "id", "json_form_info", "patient_id") SELECT "created_at", "date_prescribed", "id", "json_form_info", "patient_id" FROM "prescriptions";
DROP TABLE "prescriptions";
ALTER TABLE "new_prescriptions" RENAME TO "prescriptions";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("created_at", "id", "password_hash", "role", "username") SELECT "created_at", "id", "password_hash", "role", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
