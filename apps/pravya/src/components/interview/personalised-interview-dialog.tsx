"use client";

import { useCallback, useEffect, useState } from "react";
import { Mic, Sparkles, Eye, FileText, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import GlobalLoader from "../loader/GlobalLoader";

interface Resume {
  id: string;
  fileName: string;
  fileUrl: string;
  QdrantStatus: string;
  AnalysisStatus: string;
  createdAt: string;
  updatedAt: string;
  qdrantFileId?: string;
  ResumeAnalysis?: {
    atsScore?: number;
    analysis?: Record<string, unknown>;
  };
}

const loadingStates = [
  { text: "Getting the AI ready for work..." },
  { text: "Pouring a virtual espresso shot..." },
  { text: "Cooking up some smart questions..." },
  { text: "Checking the mic — just in case..." },
  { text: "Boosting confidence levels..." },
  { text: "All set! Redirecting you shortly..." },
];

export function PersonalisedInterviewDialog() {
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(4);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const fetchResumes = useCallback(async () => {
    try {
      setIsLoadingResumes(true);

      const response = await fetch("/api/resume/get-all-user-resume", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch resumes");

      const data = await response.json();

      if (data.success && Array.isArray(data.resume)) {
        const sortedResumes = data.resume.sort(
          (a: Resume, b: Resume) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setResumes(sortedResumes);
      } else {
        setResumes([]);
      }
    } catch (err) {
      toast.error("Failed to fetch resume");
    } finally {
      setIsLoadingResumes(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, []);

  const openInGoogleViewer = (url: string) => {
    const viewerURL = `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
      url
    )}`;
    window.open(viewerURL, "_blank", "noopener,noreferrer");
  };

  const handleBeginInterview = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to start a session");
      return;
    }

    try {
      setIsLoading(true);

      const body = {
        userId: session.user.id,
        resumeId: selectedResume,
        noOfQuestions: questionCount,
      };

      const apiPromise = axios.post(
        `${process.env.NEXT_PUBLIC_WORKER_URL}/api/v1/interview/questions/generate-personalised-questions`,
        body
      );

      const loaderDuration = (loadingStates.length - 1) * 1450;
      const startTime = Date.now();

      const res = await apiPromise;

      const interviewId = res.data.data.interviewId;

      const elapsed = Date.now() - startTime;
      const remaining = loaderDuration - elapsed;

      setTimeout(
        () => {
          if (res.status === 200 || res.status === 201) {
            toast.success("Interview session created successfully!");
            router.push(`/interview/session/${interviewId}`);
          } else {
            toast.error("Failed to start interview session");
            setIsLoading(false);
          }
        },
        remaining > 0 ? remaining : 0
      );
    } catch (error: any) {
      console.error(error);

      const status = error?.response?.status;
      const backendError = error?.response?.data?.error;

      if (status === 403) {
        toast.error(backendError || "Interview limit reached", {
          duration: 9000,
          action: {
            label: "Upgrade",
            onClick: () => router.push("/subscriptions"),
          },
        });
        setIsLoading(false);
        setTimeout(() => {
          router.push("/subscriptions");
        }, 2000);
        return;
      } else {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!";
        toast.error(message);
      }

      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 dark:bg-white hover:opacity-90 dark:text-neutral-900 bg-neutral-950 text-white">
            <Sparkles className="w-4 h-4" />
            Start Personalised Interview
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 max-w-2xl">
          {isLoading && (
            <GlobalLoader
              loadingStates={loadingStates}
              loading={isLoading}
              loop={false}
            />
          )}
          <DialogHeader>
            <DialogTitle>Create Personalised Interview</DialogTitle>
            <DialogDescription>
              Select your resume and choose number of questions.
            </DialogDescription>
          </DialogHeader>

          {/* NUMBER OF QUESTIONS SELECT */}
          <div className="mt-2">
            <label className="text-sm font-medium mb-2 block">
              Number of Questions
            </label>
            <Select
              value={String(questionCount)}
              onValueChange={(value) => setQuestionCount(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select number of questions" />
              </SelectTrigger>
              <SelectContent>
                {[4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={String(num)}>
                    {num} Questions
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* RESUME LIST */}
          <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {/* LOADING STATE */}
            {isLoadingResumes && (
              <div className="flex gap-5 flex-col">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[500px]" />
                      <Skeleton className="h-4 w-[400px]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* EMPTY STATE (NEW!) */}
            {!isLoadingResumes && resumes.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center py-12 text-center border rounded-lg border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <UploadCloud className="w-10 h-10 text-neutral-500 dark:text-neutral-400 mb-4" />
                <h3 className="text-lg font-semibold">
                  No resume uploaded yet
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm mt-1">
                  Upload a resume to generate personalised AI interview
                  questions tailored specifically to your experience.
                </p>
                <Button
                  onClick={() => router.push("/resume/upload")}
                  className="mt-4 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:opacity-90"
                >
                  Upload Resume
                </Button>
              </div>
            )}

            {/* RESUME OPTIONS */}
            {!isLoadingResumes &&
              resumes.length > 0 &&
              resumes.map((resume) => (
                <button
                  key={resume.id}
                  onClick={() => setSelectedResume(resume.id)}
                  className={`w-full px-4 py-3 flex items-center gap-3 rounded-lg border-2 transition-all ${
                    selectedResume === resume.id
                      ? "dark:border-white border-black bg-neutral-700/10 dark:bg-white/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  {/* RADIO BUTTON */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      selectedResume === resume.id
                        ? "dark:border-neutral-500 dark:bg-neutral-500 border-neutral-100 bg-neutral-700"
                        : "border-neutral-300 dark:border-neutral-600"
                    }`}
                  >
                    {selectedResume === resume.id && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>

                  {/* PDF ICON */}
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>

                  {/* NAME */}
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">
                      {resume.fileName}
                    </p>
                  </div>

                  {/* VIEW BUTTON */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      openInGoogleViewer(resume.fileUrl);
                    }}
                    className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                    role="button"
                    tabIndex={0}
                    aria-label="View resume"
                  >
                    <Eye className="w-4 h-4" />
                  </div>
                </button>
              ))}
          </div>

          <DialogFooter>
            <Button
              className="gap-2 dark:bg-white hover:opacity-90 dark:text-neutral-900 bg-neutral-950 text-white"
              onClick={handleBeginInterview}
              disabled={!selectedResume}
            >
              Generate & Start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
