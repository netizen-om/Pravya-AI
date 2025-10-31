"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle2, Lightbulb } from "lucide-react"

interface QuestionBreakdownProps {
  questions: Array<{
    questionId: string
    questionText: string
    userAnswerTranscript: string
    specificFeedback: {
      relevance: { score: number; comment: string }
      clarity: { score: number; comment: string }
      depthAndExamples: { score: number; comment: string }
      structure: { score: number; comment: string }
    }
    positivePoints: string
    suggestedImprovement: string
    modelAnswerExample?: string
  }>
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export default function QuestionBreakdown({ questions }: QuestionBreakdownProps) {
  return (
    <motion.div className="space-y-6" variants={itemVariants} initial="hidden" animate="visible">
      <div className="w-full">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Question-by-Question Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {questions.map((question, idx) => (
                <AccordionItem
                  key={question.questionId}
                  value={question.questionId}
                  className="border-neutral-200 dark:border-neutral-800"
                >
                  <AccordionTrigger className="hover:no-underline text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800">
                    <span className="text-left">
                      <span className="font-semibold text-blue-600 dark:text-blue-400">Q{idx + 1}.</span>{" "}
                      <span className="text-neutral-900 dark:text-white">{question.questionText}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    {/* Your Answer */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">Your Answer</h4>
                      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 p-4">
                        <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                          {question.userAnswerTranscript}
                        </p>
                      </div>
                    </div>

                    {/* Specific Feedback Grid */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">Feedback Metrics</h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {Object.entries(question.specificFeedback).map(([key, metric]) => (
                          <div
                            key={key}
                            className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {metric.score}/10
                              </span>
                            </div>
                            <p className="text-xs text-neutral-700 dark:text-neutral-300">{metric.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Highlights */}
                    <Alert className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertTitle className="text-green-900 dark:text-green-200">What You Did Well</AlertTitle>
                      <AlertDescription className="mt-2 text-sm text-green-800 dark:text-green-300">
                        {question.positivePoints}
                      </AlertDescription>
                    </Alert>

                    <Alert className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
                      <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertTitle className="text-blue-900 dark:text-blue-200">Suggested Improvement</AlertTitle>
                      <AlertDescription className="mt-2 text-sm text-blue-800 dark:text-blue-300">
                        {question.suggestedImprovement}
                      </AlertDescription>
                    </Alert>

                    {/* Model Answer */}
                    {question.modelAnswerExample && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2 text-neutral-900 dark:text-white">
                          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          Model Answer Example
                        </h4>
                        <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950 p-4">
                          <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                            {question.modelAnswerExample}
                          </p>
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
