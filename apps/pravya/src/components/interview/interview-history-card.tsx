"use client";

import { startTransition, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteInterview } from "@/actions/interview-action";
import { useRouter } from "next/navigation";

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
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const isFeedbackDisabled =
    disableFeedback || status === "INCOMPLETE" || !feedbackId;

  async function handleDelete() {
    try {
      setLoading(true);

      const res = await deleteInterview(id);

      if (!res.success) {
        toast.error(res.message ?? "Delete failed");
        return;
      }

      toast.success("Interview deleted successfully");
      router.push("/dashboard")
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
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

        <CardFooter className="flex flex-row items-center justify-between">
          {isFeedbackDisabled ? (
            <Button disabled variant="secondary">
              View Full Feedback
            </Button>
          ) : (
            <Button
              className="dark:bg-white hover:opacity-90 dark:text-neutral-900 bg-neutral-950 text-white"
              asChild
            >
              <Link href={`/interview/feedback/${feedbackId}`}>
                View Full Feedback
              </Link>
            </Button>
          )}

          {/* Delete icon button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-700 hover:text-red-800 hover:bg-destructive/40 transition-all duration-200 hover:scale-110"
            onClick={() => setOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          <DialogHeader>
            <DialogTitle>Delete Interview?</DialogTitle>
            <DialogDescription className="text-neutral-600 dark:text-neutral-300">
              Are you sure you want to delete this interview? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 text-sm space-y-1 text-neutral-700 dark:text-neutral-300">
            <p>
              <strong>Title:</strong> {title}
            </p>
            <p>
              <strong>Status:</strong> {status}
            </p>
            {typeof score === "number" && (
              <p>
                <strong>Score:</strong>{" "}
                <span className="text-emerald-500">{score}/100</span>
              </p>
            )}
          </div>

          <DialogFooter className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
