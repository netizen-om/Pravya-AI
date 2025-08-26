import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import cloudinary from "@/lib/cloudinary";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // increase limit
    },
  },
};

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("profileImage") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "Pravya_profile_Image",
          resource_type: "auto", // This helps with different file types
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result as CloudinaryUploadResult);
          }
        }
      );
      uploadStream.end(buffer);
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        image: result.secure_url,
        imagePublicId: result.public_id,
      },
    });

    return NextResponse.json(
      { message: "Profile picture updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return NextResponse.json(
      { error: "Error updating profile picture" },
      { status: 500 }
    );
  }
}
