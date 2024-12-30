/*
  Warnings:

  - You are about to drop the column `lymphocytesDiff` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `packedCellVolume` on the `MedicalRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MedicalRecord" DROP COLUMN "lymphocytesDiff",
DROP COLUMN "packedCellVolume";
