"use client";

import { useState } from "react";
import { Brain } from "lucide-react";
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

  const { data: session } = useSession();
  const router = useRouter();

  const handleBeginInterview = async () => {
    try {
      if (!session?.user?.id) {
        toast.error("You must be logged in to start a session");
        return;
      }

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

      const res = await axios.post(
        "http://localhost:8000/api/v1/interview/questions/generate",
        body
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Interview session created successfully!");
        onOpenChange(false);
        router.push("/interview/session");
      } else {
        toast.error("Failed to start interview session");
      }
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isLoading) onOpenChange(open); // prevent closing while loading
      }}
    >
      <DialogContent className="relative border-zinc-800 bg-zinc-900 text-white sm:max-w-md">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
            <motion.div
              className="w-12 h-12 rounded-full border-4 border-white border-t-transparent border-b-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </div>
        )}

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <Brain className="h-6 w-6 text-zinc-950" />
          </div>
          <span className="text-xl font-bold">Pravya AI</span>
        </div>

        <DialogHeader>
          <DialogTitle className="text-xl">{template.title}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {template.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 w-full mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Configuration Form */}
        <div className="space-y-6 py-4">
          {/* Level Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Level</Label>
            <RadioGroup value={level} onValueChange={setLevel}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label
                  htmlFor="beginner"
                  className="font-normal cursor-pointer"
                >
                  Beginner
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label
                  htmlFor="intermediate"
                  className="font-normal cursor-pointer"
                >
                  Intermediate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expert" id="expert" />
                <Label htmlFor="expert" className="font-normal cursor-pointer">
                  Expert
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Number of Questions */}
          <div className="space-y-3">
            <Label htmlFor="question-count" className="text-base font-medium">
              Number of Questions
            </Label>
            <Select value={questionCount} onValueChange={setQuestionCount}>
              <SelectTrigger
                id="question-count"
                className="border-zinc-800 bg-zinc-800 text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-zinc-900 text-white">
                {[2, 3, 4, 5, 6, 7].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} Questions
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interview Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Interview Type</Label>
            <RadioGroup value={interviewType} onValueChange={setInterviewType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="technical" id="technical" />
                <Label
                  htmlFor="technical"
                  className="font-normal cursor-pointer"
                >
                  Technical
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="behavioral" id="behavioral" />
                <Label
                  htmlFor="behavioral"
                  className="font-normal cursor-pointer"
                >
                  Behavioral
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mix" id="mix" />
                <Label htmlFor="mix" className="font-normal cursor-pointer">
                  Mix
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleBeginInterview}
            className="w-full bg-white text-zinc-950 hover:bg-zinc-100"
            disabled={isLoading}
          >
            {isLoading ? "Starting..." : "Begin Interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
