import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prismadb";
import { Readable } from "stream";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { resumeAnalyseQueue, resumeProcessingQueue } from "@/lib/queues";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const session = {
    //   user : {
    //     id : "cmdtwaovc0000wfagrbld46w3"
    //   }
    // }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user) return null;

    const resumeCount = await prisma.resume.count({
      where: { userId: session.user.id, isDeleted: false },
    });

    const isSubscribed =
      user.subscription?.status === "ACTIVE" &&
      (!user.subscription.endDate || user.subscription.endDate > new Date());

    if (!isSubscribed && resumeCount >= 3) {
      return new Response(
        JSON.stringify({
          error:
            "You have reached the free limit of 3 resumes. Upgrade to upload more.",
        }),
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const originalFileName = file.name.replace(/\.[^/.]+$/, ""); // keep unmodified name
    const uniqueFileName = `${session.user.id}-${uniqueId}-${originalFileName}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary with custom filename
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            public_id: uniqueFileName,
            resource_type: "raw",
            overwrite: false,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(buffer).pipe(stream);
      });

    const result: any = await uploadStream();
    console.log("Cloudinary PDF URL:", result.secure_url);

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        QdrantStatus: "uploaded", // Initial Qdrant status
        AnalysisStatus: "pending", // Initial analysis status
      },
    });

    await prisma.userActivity.create({
      data: {
        userId: session.user.id,
        action: "RESUME_UPLOADED",
        targetType: "RESUME",
        targetId: resume.id,
        details: resume.fileName,
      },
    });

    await resumeProcessingQueue.add("process-resume", {
      resumeId: resume.id,
      fileUrl: resume.fileUrl,
      userId: resume.userId,
      publicId: resume.publicId,
      fileName: resume.fileName,
    });

    await resumeAnalyseQueue.add("resume-analyse", {
      resumeId: resume.id,
      fileUrl: resume.fileUrl,
      userId: resume.userId,
      publicId: resume.publicId,
      fileName: resume.fileName,
    });

    return NextResponse.json({ success: true, resume: resume });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
