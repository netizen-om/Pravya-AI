"use client"

import { useState } from "react"
import { Mic, Sparkles, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample resume data with images
const RESUMES = [
  {
    id: "resume1",
    name: "Software_Engineer_v4.pdf",
    image: "/software-engineer-resume.png",
  },
  {
    id: "resume2",
    name: "Product_Manager_v2.pdf",
    image: "/product-manager-resume.png",
  },
  {
    id: "resume3",
    name: "Data_Scientist_Final.pdf",
    image: "/data-scientist-resume.jpg",
  },
]

export function PersonalisedInterviewDialog() {
  const [selectedResume, setSelectedResume] = useState<string>("")
  const [open, setOpen] = useState(false)
  const [fullscreenResume, setFullscreenResume] = useState<string | null>(null)

  const handleGenerate = () => {
    if (selectedResume) {
      console.log("Starting interview with resume:", selectedResume)
      setOpen(false)
      setSelectedResume("")
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
            <Sparkles className="w-4 h-4" />
            Start Personalised Interview
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Personalised Interview</DialogTitle>
            <DialogDescription>
              Select one of your uploaded resumes, and Pravya AI will tailor questions based on its content.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {RESUMES.map((resume) => (
              <button
                key={resume.id}
                onClick={() => setSelectedResume(resume.id)}
                className={`w-full px-4 py-3 flex items-center gap-3 rounded-lg border-2 transition-all ${
                  selectedResume === resume.id
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    selectedResume === resume.id
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}
                >
                  {selectedResume === resume.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>

                <img
                  src={resume.image || "/placeholder.svg"}
                  alt={resume.name}
                  className="w-14 h-20 object-cover rounded border border-neutral-200 dark:border-neutral-700"
                />

                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">{resume.name}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFullscreenResume(resume.image)
                  }}
                  className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0"
                  aria-label="View resume"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={handleGenerate}
              disabled={!selectedResume}
            >
              <Mic className="w-4 h-4" />
              Generate & Start
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {fullscreenResume && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setFullscreenResume(null)}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={fullscreenResume || "/placeholder.svg"}
            alt="Resume fullscreen view"
            className="max-w-4xl max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </>
  )
}
