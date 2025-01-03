/*
  Warnings:

  - You are about to drop the column `CreatedAt` on the `Appointments` table. All the data in the column will be lost.
  - You are about to drop the column `Time` on the `Appointments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientId,hospitalId,time]` on the table `Appointments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `time` to the `Appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxAppointments` to the `Hospital` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('Scheduled', 'Completed', 'Cancelled', 'NoShow');

-- AlterTable
ALTER TABLE "Appointments" DROP COLUMN "CreatedAt",
DROP COLUMN "Time",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "AppointmentStatus" NOT NULL DEFAULT 'Scheduled',
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "maxAppointments" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Appointments_hospitalId_idx" ON "Appointments"("hospitalId");

-- CreateIndex
CREATE INDEX "Appointments_patientId_idx" ON "Appointments"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointments_patientId_hospitalId_time_key" ON "Appointments"("patientId", "hospitalId", "time");

-- CreateIndex
CREATE INDEX "MedicalRecord_patientId_idx" ON "MedicalRecord"("patientId");
