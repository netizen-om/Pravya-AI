/*
  Warnings:

  - You are about to drop the column `status` on the `Resume` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "status",
ADD COLUMN     "AnalysisStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "QdrantStatus" TEXT NOT NULL DEFAULT 'uploadeding';
