-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('None', 'Male', 'Female');

-- CreateEnum
CREATE TYPE "Speciality" AS ENUM ('Multipspeciality', 'Eye', 'ENT', 'Heart', 'Gastric', 'Psychiatry', 'Dermatology', 'Dental', 'Cardiology');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('Low', 'Medium', 'High', 'Emergency');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'None',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "speciality" "Speciality" NOT NULL DEFAULT 'Multipspeciality',

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointments" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "Time" TEXT NOT NULL,
    "Date" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'Low',

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "reportDate" TEXT,
    "hemoglobin" DECIMAL(65,30),
    "packedCellVolume" DECIMAL(65,30),
    "rbcCount" DECIMAL(65,30),
    "mcv" DECIMAL(65,30),
    "lymphocytesDiff" DECIMAL(65,30),
    "neutrophils" DECIMAL(65,30),
    "lymphocytes" DECIMAL(65,30),
    "SGPT" DECIMAL(65,30),
    "SGOT" DECIMAL(65,30),
    "GGTP" DECIMAL(65,30),
    "Albumin" DECIMAL(65,30),
    "Protein" DECIMAL(65,30),
    "Globulin" DECIMAL(65,30),
    "severity" "Severity" NOT NULL DEFAULT 'Low',
    "summary" TEXT NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_name_key" ON "Hospital"("name");

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
