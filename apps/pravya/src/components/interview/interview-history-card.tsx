import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface InterviewHistoryCardProps {
	id: string;
	title: string;
	tags: string[];
	score?: number | null;
	status: "COMPLETED" | "PENDING" | "INCOMPLETE";
	feedbackId?: string | null;
	disableFeedback?: boolean;
}

export function InterviewHistoryCard({
	id,
	title,
	tags,
	score,
	status,
	feedbackId,
	disableFeedback,
}: InterviewHistoryCardProps) {
	const isFeedbackDisabled =
		disableFeedback || status === "INCOMPLETE" || !feedbackId;

	return (
		<Card className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
			<CardHeader className="gap-2">
				<CardTitle className="text-base md:text-lg">{title}</CardTitle>
				<div className="flex flex-wrap gap-2">
					{tags?.map((t) => (
						<span
							key={t}
							className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium bg-neutral-50 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700"
						>
							{t}
						</span>
					))}
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-sm text-neutral-600 dark:text-neutral-300">
					{status === "COMPLETED" && typeof score === "number" ? (
						<div>
							Overall Score:{" "}
							<span className="text-emerald-500 font-semibold">
								{score}/100
							</span>
						</div>
					) : (
						<div>Status: {status.toLowerCase()}</div>
					)}
				</div>
			</CardContent>
			<CardFooter>
				{isFeedbackDisabled ? (
					<Button disabled variant="secondary" className="w-full md:w-auto">
						View Full Feedback
					</Button>
				) : (
					<Button className="w-full md:w-auto dark:bg-white hover:opacity-90 dark:text-neutral-900 bg-neutral-950 text-white" asChild>
						<Link href={`/interview/feedback/${feedbackId}`}>View Full Feedback</Link>
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}


