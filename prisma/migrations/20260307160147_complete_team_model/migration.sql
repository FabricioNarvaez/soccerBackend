/*
  Warnings:

  - A unique constraint covering the columns `[coachId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `acronym` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coachId` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "acronym" VARCHAR(3) NOT NULL,
ADD COLUMN     "coachId" INTEGER NOT NULL,
ADD COLUMN     "color" TEXT NOT NULL DEFAULT '#3b82f6',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "drawn" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "goalsFor" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "group" TEXT,
ADD COLUMN     "lost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "played" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teamPhoto" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "won" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dni" TEXT,
    "phoneNumber" TEXT,
    "role" TEXT NOT NULL DEFAULT 'COACH',
    "validated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Team_coachId_key" ON "Team"("coachId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
