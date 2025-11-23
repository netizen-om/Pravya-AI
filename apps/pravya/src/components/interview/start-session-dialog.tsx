"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GlobalLoader from "../loader/GlobalLoader";
import React from "react";
import { useHydrationSafeTheme } from "../hooks/useHydrationSafeTheme";
import { Card } from "../ui/card";

interface StartSessionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  template: {
    id: string;
    title: string;
    description: string;
    tags: string[];
  };
}

export function StartSessionDialog({
  isOpen,
  onOpenChange,
  template,
}: StartSessionDialogProps) {
  const [level, setLevel] = useState("intermediate");
  const [questionCount, setQuestionCount] = useState("3");
  const [interviewType, setInterviewType] = useState("mix");
  const [isLoading, setIsLoading] = useState(false);

  const { theme, isMounted } = useHydrationSafeTheme();
  const isDark = theme === "dark";

  const { data: session } = useSession();
  const router = useRouter();

  const loadingStates = [
    { text: "Getting the AI ready for work..." },
    { text: "Pouring a virtual espresso shot..." },
    { text: "Cooking up some smart questions..." },
    { text: "Checking the mic — just in case..." },
    { text: "Boosting confidence levels..." },
    { text: "All set! Redirecting you shortly..." },
  ];

  const handleBeginInterview = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to start a session");
      return;
    }

    try {
      setIsLoading(true);

      const body = {
        userId: session.user.id,
        description: template.description,
        title: template.title,
        interviewTemplateId: template.id,
        tags: template.tags.join(","),
        level: level.charAt(0).toUpperCase() + level.slice(1),
        noOfQuestions: parseInt(questionCount, 10),
        type:
          interviewType === "mix"
            ? "Technical"
            : interviewType.charAt(0).toUpperCase() + interviewType.slice(1),
      };

      const apiPromise = axios.post(
        `${process.env.NEXT_PUBLIC_WORKER_URL}/api/v1/interview/questions/generate`,
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
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 rounded-lg bg-gray-200 dark:bg-neutral-800 animate-pulse" />
          <div className="flex rounded-lg p-1 bg-gray-100 dark:bg-neutral-900">
            <div className="h-8 w-24 rounded-md bg-gray-200 dark:bg-neutral-800" />
            <div className="h-8 w-24 rounded-md bg-gray-100 dark:bg-neutral-900" />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900/70 h-[348px] animate-pulse" />
          <Card className="rounded-2xl border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900/70 h-[348px] animate-pulse" />
        </div>
      </motion.section>
    );
  }

  return (
    <div className="relative">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!isLoading) onOpenChange(open);
        }}
      >
        <DialogContent className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white sm:max-w-md">
          {isLoading && (
            <GlobalLoader
              loadingStates={loadingStates}
              loading={isLoading}
              loop={false}
            />
          )}

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              <Image
                src={
                  isDark
                    ? "/logo/pravya-logo.png"
                    : "/logo/pravya-light-logo.png"
                }
                width={43}
                height={13}
                alt="Pravya AI Logo"
                className="rounded-xl"
              />
            </div>
            <span className="text-xl font-bold">Pravya AI</span>
          </div>

          <DialogHeader>
            <DialogTitle className="text-xl">{template.title}</DialogTitle>
            <DialogDescription className="text-zinc-600 dark:text-zinc-400">
              {template.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2 w-full mb-4">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gray-200 text-zinc-900 hover:bg-gray-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Select Level</Label>
              <RadioGroup value={level} onValueChange={setLevel}>
                {["beginner", "intermediate", "expert"].map((lvl) => (
                  <div
                    key={lvl}
                    className="flex items-center justify-start space-x-2"
                  >
                    <RadioGroupItem
                      value={lvl}
                      id={lvl}
                      className="radio-item w-5 h-5 rounded-full border-gray-400 dark:border-zinc-700 bg-white dark:bg-transparent"
                    />
                    <Label htmlFor={lvl} className="font-normal cursor-pointer">
                      {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="question-count" className="text-base font-medium">
                Number of Questions
              </Label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger
                  id="question-count"
                  className="border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                  {[2, 3, 4, 5, 6, 7].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Questions
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Interview Type</Label>
              <RadioGroup
                value={interviewType}
                onValueChange={setInterviewType}
              >
                {["technical", "behavioral", "mix"].map((type) => (
                  <div
                    key={type}
                    className="flex items-center justify-start space-x-2"
                  >
                    <RadioGroupItem
                      value={type}
                      id={type}
                      className="w-5 h-5 rounded-full border-gray-400 dark:border-zinc-700 bg-white dark:bg-transparent"
                    />
                    <Label htmlFor={type} className="font-normal cursor-pointer">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleBeginInterview}
              className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              disabled={isLoading}
            >
              {isLoading ? "Starting..." : "Begin Interview"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
