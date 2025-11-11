import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
	try {
		const session = await getServerSession(authOptions as any);
		const userId = session?.user?.id;

		if (!userId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const interviews = await prisma.interview.findMany({
			where: {
				userId,
				isDeleted: false,
				status: {
					in: ["COMPLETED", "PENDING", "INCOMPLETE"],
				},
			},
			include: {
				template: {
					include: {
						tags: true,
					},
				},
				feedback: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		const mapItem = (it: any) => {
			const title =
				it?.template?.title ?? (it?.role ? it.role : "Personalized Interview");
			const tags =
				it?.template?.tags?.length
					? it.template.tags.map((t: any) => t.name)
					: ["personalized"];
			const score = it?.feedback?.overallScore ?? null;
			const feedbackId = it?.feedback?.feedbackId ?? null;
			return {
				id: it.interviewId,
				title,
				tags,
				score,
				status: it.status as "COMPLETED" | "PENDING" | "INCOMPLETE",
				createdAt: it.createdAt,
				feedbackId,
			};
		};

		const completed = interviews
			.filter((i) => i.status === "COMPLETED")
			.map(mapItem);
		const pending = interviews.filter((i) => i.status === "PENDING").map(mapItem);
		const incomplete = interviews
			.filter((i) => i.status === "INCOMPLETE")
			.map(mapItem);

		return NextResponse.json({
			success: true,
			data: { completed, pending, incomplete },
		});
	} catch (error) {
		console.error("Failed to fetch interviews:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}


