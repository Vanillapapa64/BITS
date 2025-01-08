/*
  Warnings:

  - You are about to drop the column `Albumin` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `GGTP` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `Globulin` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `Protein` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `SGOT` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `SGPT` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `neutrophils` on the `MedicalRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicalRecord" DROP COLUMN "Albumin",
DROP COLUMN "GGTP",
DROP COLUMN "Globulin",
DROP COLUMN "Protein",
DROP COLUMN "SGOT",
DROP COLUMN "SGPT",
DROP COLUMN "neutrophils",
ADD COLUMN     "leukocyte" DECIMAL(65,30);
