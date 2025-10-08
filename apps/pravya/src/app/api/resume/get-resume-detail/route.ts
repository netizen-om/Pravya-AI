import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { resumeId } = body;

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resumeDetails = await prisma.resume.findUnique({
    where: { id: resumeId },
    include: {
      ResumeAnalysis: {
        select: {
          atsScore: true,
        },
      },
    },
  });

// output : 
//   {
//     "resumeDetails": {
//         "id": "cmegmw4ma0001wfj0pxiyids1",
//         "userId": "cmdrfewt80006wfykbq6iaren",
//         "fileName": "om_resume.pdf",
//         "publicId": "resumes/cmdrfewt80006wfykbq6iaren-1755492468221-318-om_resume",
//         "fileUrl": "https://res.cloudinary.com/ddojayhow/raw/upload/v1755492471/resumes/cmdrfewt80006wfykbq6iaren-1755492468221-318-om_resume",
//         "QdrantStatus": "completed",
//         "AnalysisStatus": "completed",
//         "qdrantFileId": null,
//         "createdAt": "2025-08-18T04:47:52.017Z",
//         "updatedAt": "2025-08-18T04:48:08.132Z",
//         "ResumeAnalysis": {
//             "atsScore": 85
//         }
//     }
// }

  return NextResponse.json({ resumeDetails }, { status: 200 });
}
