/*
  Warnings:

  - You are about to drop the column `questionArray` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the `Interview_audio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interview_audio" DROP CONSTRAINT "Interview_audio_interviewId_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_userId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "questionArray",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSubscribed" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Interview_audio";

-- DropTable
DROP TABLE "payment";

-- CreateTable
CREATE TABLE "InterviewAudio" (
    "audioId" TEXT NOT NULL,
    "interviewId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "transcript" TEXT[],
    "audioUrl" TEXT NOT NULL,

    CONSTRAINT "InterviewAudio_pkey" PRIMARY KEY ("audioId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "paymentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT NOT NULL,
    "metadata" JSONB,
    "currency" TEXT NOT NULL DEFAULT 'INR',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("paymentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "InterviewAudio_interviewId_key" ON "InterviewAudio"("interviewId");

-- AddForeignKey
ALTER TABLE "InterviewAudio" ADD CONSTRAINT "InterviewAudio_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("interviewId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
