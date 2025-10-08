/*
  Warnings:

  - You are about to drop the column `cloudinaryId` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinaryUrl` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "cloudinaryId",
DROP COLUMN "cloudinaryUrl",
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL;
