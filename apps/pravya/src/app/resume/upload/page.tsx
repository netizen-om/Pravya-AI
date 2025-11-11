"use client";

import type React from "react";

import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  FileText,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import DeleteResumeDialog from "@/components/resume/delete-resume-dialog";
import { deleteResume } from "@/actions/resume-action";
import { toast } from "sonner";

interface UploadedFile {
  name: string;
  size: number;
  file: File;
}

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

const openPdfInGoogleViewer = (fileUrl: string) => {
  if (!fileUrl) return;

  // ensure .pdf extension so Google Viewer always detects properly
  const safeUrl = fileUrl.endsWith(".pdf") ? fileUrl : `${fileUrl}.pdf`;

  // construct Google Drive Viewer URL
  const viewerUrl = `https://drive.google.com/viewerng/viewer?embedded=true&url=${
    fileUrl
  }`;

  // open fullscreen (new tab)
  window.open(viewerUrl, "_blank", "noopener,noreferrer");
};

const motivationalQuotes = [
  "Analyzing your unique skills and experience...",
  "AI tip: Quantify your achievements with specific numbers",
  "Discovering your career strengths...",
  "Pro tip: Use action verbs to make your resume stand out",
  "Evaluating your professional journey...",
  "Remember: Your resume is your personal brand story",
];

// Helper function to get overall status
const getOverallStatus = (resume: Resume): string => {
  if (resume.QdrantStatus === "error" || resume.AnalysisStatus === "error") {
    return "error";
  }

  if (
    resume.QdrantStatus === "completed" &&
    resume.AnalysisStatus === "completed"
  ) {
    return "completed";
  }

  if (resume.AnalysisStatus === "analyzing") {
    return "analyzing";
  }

  if (resume.QdrantStatus === "parsing") {
    return "parsing";
  }

  return "uploaded";
};

const StatusBadge = ({ resume }: { resume: Resume }) => {
  const overallStatus = getOverallStatus(resume);

  switch (overallStatus) {
    case "uploaded":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-500/20 text-blue-400 border-blue-500/30"
        >
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Uploaded
        </Badge>
      );
    case "parsing":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
        >
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Parsing
        </Badge>
      );
    case "analyzing":
      return (
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30 animate-pulse"
        >
          <div className="w-3 h-3 mr-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
          Analyzing
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="secondary"
          className="bg-green-500/20 text-green-400 border-green-500/30"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      );
    case "error":
      return (
        <Badge
          variant="destructive"
          className="bg-red-500/20 text-red-400 border-red-500/30"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      );
    default:
      return (
        <Badge
          variant="secondary"
          className="bg-gray-500/20 text-gray-400 border-gray-500/30"
        >
          <div className="relative w-3 h-3 bg-gray-400 rounded-full"></div>
          {overallStatus}
        </Badge>
      );
  }
};

export default function ResumeUploadPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [resumesError, setResumesError] = useState<string | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const redisSubscriberRef = useRef<EventSource | null>(null);

  const router = useRouter();

  // Redis Pub-Sub for real-time updates
  useEffect(() => {
    const connectToRedis = async () => {
      try {
        // Create EventSource for Server-Sent Events (SSE) as a simple alternative to Redis Pub-Sub
        const eventSource = new EventSource("/api/resume/status-updates");

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.resumeId) {
              // Update the specific resume in state
              setResumes((prevResumes) =>
                prevResumes.map((resume) =>
                  resume.id === data.resumeId ? { ...resume, ...data } : resume
                )
              );
            }
          } catch (error) {
            console.error("Error parsing status update:", error);
          }
        };

        eventSource.onerror = (error) => {
          console.error("EventSource error:", error);
        };

        redisSubscriberRef.current = eventSource;
      } catch (error) {
        console.error("Failed to connect to Redis Pub-Sub:", error);
      }
    };

    connectToRedis();

    return () => {
      if (redisSubscriberRef.current) {
        redisSubscriberRef.current.close();
      }
    };
  }, []);

  // Fetch resumes from backend API
  const fetchResumes = useCallback(async () => {
    try {
      setIsLoadingResumes(true);
      setResumesError(null);

      const response = await fetch("/api/resume/get-all-user-resume", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch resumes: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      if (data.success && Array.isArray(data.resume)) {
        // Sort resumes by creation date (newest first)
        const sortedResumes = data.resume.sort(
          (a: Resume, b: Resume) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Always update the resumes state with the latest data from the server
        setResumes(sortedResumes);

        if (!hasInitialLoad) {
          setHasInitialLoad(true);
          console.log(
            "Initial load of resumes:",
            sortedResumes.map((r: Resume) => ({
              fileName: r.fileName,
              QdrantStatus: r.QdrantStatus,
              AnalysisStatus: r.AnalysisStatus,
            }))
          );
        }
      } else {
        setResumes([]);
      }
    } catch (err) {
      setResumesError(
        err instanceof Error ? err.message : "Failed to fetch resumes"
      );
      console.error("Error fetching resumes:", err);
    } finally {
      setIsLoadingResumes(false);
    }
  }, [hasInitialLoad]);

  // Initial fetch of resumes
  useEffect(() => {
    fetchResumes();
  }, []);

  // Poll for status updates every 10 seconds if there are active resumes
  useEffect(() => {
    // Only start polling after initial load and if there are active resumes
    if (!hasInitialLoad) {
      return; // Don't poll until initial load is complete
    }

    const hasActiveResumes = resumes.some((resume) =>
      ["uploaded", "parsing", "analyzing"].includes(
        getOverallStatus(resume).toLowerCase()
      )
    );

    if (!hasActiveResumes) {
      return; // Don't poll if no active resumes
    }

    const interval = setInterval(() => {
      fetchResumes();
    }, 10000);

    return () => clearInterval(interval);
  }, [resumes, fetchResumes, hasInitialLoad]);

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];

      // Clear any previous messages
      setErrorMessage(null);
      setSuccessMessage(null);

      // Validate file type
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setErrorMessage("Please drop a PDF file");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setErrorMessage("Please select a file smaller than 10MB");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      setUploadedFile({
        name: file.name,
        size: file.size,
        file: file,
      });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Clear any previous messages
      setErrorMessage(null);
      setSuccessMessage(null);

      // Validate file type
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setErrorMessage("Please select a PDF file");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        setErrorMessage("Please select a file smaller than 10MB");
        setTimeout(() => setErrorMessage(null), 3000);
        return;
      }

      setUploadedFile({
        name: file.name,
        size: file.size,
        file: file,
      });
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    // Clear any previous messages
    setErrorMessage(null);
    setSuccessMessage(null);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append("file", uploadedFile.file);

      // Simulate upload progress while making the actual API call
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Make the actual API call
      const response = await fetch("/api/upload/resume-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      // Complete the progress bar
      setUploadProgress(100);
      clearInterval(uploadInterval);

      setIsUploading(false);
      setIsAnalyzing(true);

      // Show success message
      setSuccessMessage("Resume uploaded successfully! Starting analysis...");
      setTimeout(() => setSuccessMessage(null), 5000);

      // Refresh the resumes list to get the latest data from server
      await fetchResumes();

      // Simulate analysis completion (this would be replaced with real-time updates from the queue)
      // setTimeout(() => {
      //   setIsAnalyzing(false);
      //   setUploadedFile(null);
      //   setUploadProgress(0);
      //   // Fetch again to get updated status
      //   fetchResumes();
      // }, 8000);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);

      // Set error message for user display
      setErrorMessage(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );

      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);

      // Refresh resumes list in case of error too
      fetchResumes();
    }
  };

  const handleRetry = () => {
    // In a real implementation, you would call an API to retry the analysis
    // For now, we'll simulate it with a timeout and then refresh from server
    setTimeout(() => {
      fetchResumes();
    }, 3000);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteResume(id);
    if(res.success) {
      toast.success("Resume deleted");
      await fetchResumes();
    } else {
      toast.error("Failed to delete, please try again later")
    }
  };

  const handleViewResume = (resume: Resume) => {
    if (resume.ResumeAnalysis) {
      console.log("Viewing resume analysis:", resume.ResumeAnalysis);
      // Example: router.push(`/resume/analyse/${resume.id}`)
    } else {
      // Open the original file
      if (resume.fileUrl) {
        window.open(resume.fileUrl, "_blank");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Upload Your Resume
          </h1>
          <p className="text-xl text-muted-foreground">
            Boost your practice with AI-powered resume analysis.
          </p>
        </div>

        {/* Main Upload Card */}
        <Card className="relative overflow-hidden backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative p-8 space-y-6">
            {/* Drag and Drop Area */}
            <div
              className={cn(
                "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group",
                isDragOver
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50 hover:bg-gradient-to-br hover:from-background hover:to-muted/30",
                "hover:scale-[1.02] hover:shadow-xl"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="space-y-4">
                <div
                  className={cn(
                    "mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                    isDragOver
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                  )}
                >
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    {isDragOver
                      ? "Drop your resume here"
                      : "Drag & drop your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or{" "}
                    <span className="text-primary font-medium">
                      browse files
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF files only, up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* File Preview */}
            {uploadedFile && (
              <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              // ADDED light-mode classes, prefixed dark-mode classes
              <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-300 dark:bg-red-500/10 dark:border-red-500/20">
                <div className="flex items-center justify-center space-x-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              // ADDED light-mode classes, prefixed dark-mode classes
              <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-300 dark:bg-green-500/10 dark:border-green-500/20">
                <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleUpload}
                disabled={!uploadedFile || isUploading || isAnalyzing}
                className="flex-1 h-12 text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Upload & Continue"
                )}
              </Button>

              <a href="/dashboard">
                <Button
                  variant="ghost"
                  className="h-12 text-base transition-all duration-300 hover:scale-[1.02] hover:bg-muted/80 w-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </a>
            </div>
          </div>
        </Card>

        {/* Resume List Section */}
        <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Your Resumes
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchResumes}
                disabled={isLoadingResumes}
                className="flex items-center space-x-2"
              >
                <RotateCcw
                  className={`w-4 h-4 ${
                    isLoadingResumes ? "animate-spin" : ""
                  }`}
                />
                <span>Refresh</span>
              </Button>
            </div>

            {isLoadingResumes && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading resumes...</span>
                </div>
              </div>
            )}

            {resumesError && (
              // ADDED light-mode classes, prefixed dark-mode classes
              <div className="bg-red-100 border border-red-200 rounded-lg p-4 text-center dark:bg-red-500/10 dark:border-red-500/20">
                <div className="flex items-center justify-center space-x-2 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">{resumesError}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchResumes}
                  className="mt-3"
                >
                  Retry
                </Button>
              </div>
            )}

            {!isLoadingResumes && !resumesError && resumes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No resumes yet</p>
                <p className="text-sm">
                  Upload your first resume to get started
                </p>
              </div>
            )}

            {!isLoadingResumes && !resumesError && resumes.length > 0 && (
              <div className="space-y-4">
                {resumes.map((resume, index) => (
                  <div
                    key={resume.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.01] animate-in fade-in-0 slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {resume.fileName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(resume.createdAt).toLocaleDateString()} •{" "}
                          {resume.fileUrl ? "File Available" : "No File"}
                        </p>
                        {/* Simple progress indicator */}
                        {["uploaded", "parsing", "analyzing"].includes(
                          getOverallStatus(resume).toLowerCase()
                        ) && (
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                getOverallStatus(resume) === "parsing" ||
                                getOverallStatus(resume) === "analyzing"
                                  ? "bg-yellow-400"
                                  : "bg-gray-300 dark:bg-gray-600" // THEMED gray
                              }`}
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                getOverallStatus(resume) === "analyzing"
                                  ? "bg-purple-400"
                                  : "bg-gray-300 dark:bg-gray-600" // THEMED gray
                              }`}
                            ></div>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                getOverallStatus(resume) === "completed"
                                  ? "bg-green-400"
                                  : "bg-gray-300 dark:bg-gray-600" // THEMED gray
                              }`}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <StatusBadge resume={resume} />

                      <div className="flex space-x-1">
                        
                        {getOverallStatus(resume) === "error" && (
                          // ADDED light-mode classes, prefixed dark-mode classes
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRetry}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                        <DeleteResumeDialog onConfirm={handleDelete} resume={resume} />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPdfInGoogleViewer(resume.fileUrl)}
                          className="h-8 w-8 p-0 hover:bg-neutral-500/20 hover:opacity-70 transition-all duration-200 hover:scale-110"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {getOverallStatus(resume) === "completed" && (
                          <Link href={`/resume/chat/${resume.id}`}>
                          <Button
                            variant="ghost"
                            // ADDED light-mode classes, prefixed dark-mode classes
                            className="text-zinc-900 bg-white hover:bg-zinc-100 border border-zinc-200 shadow-sm transition-all duration-300 ease-in-out transform dark:text-silver-300 dark:text-black dark:bg-white dark:hover:bg-zinc-300 dark:hover:text-black dark:shadow-lg dark:shadow-silver-500/20 dark:border dark:border-silver-600/30"
                          >
                            Chat
                          </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center space-x-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
