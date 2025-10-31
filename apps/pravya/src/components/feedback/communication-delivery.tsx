"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { HoverGradient } from "../HoverGradient";

interface CommunicationDeliveryProps {
  data: {
    pace: { rating: string; comment: string };
    fillerWords: {
      frequency: string;
      commonFillers: string[];
      comment: string;
    };
    toneAndConfidence: { score: number; comment: string };
    clarityAndArticulation: { score: number; comment: string };
  };
}

interface CommunicationDeliveryPropsExtended
  extends CommunicationDeliveryProps {
  isDark: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function CommunicationDelivery({
  data,
  isDark,
}: CommunicationDeliveryPropsExtended) {
  const isHighFillerWords = data.fillerWords.frequency === "High";

  return (
    <motion.div
      className="space-y-6"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <HoverGradient
          gradientSize={300}
          fromColor={isDark ? "#262626" : "#D9D9D955"}
          toColor={isDark ? "#262626" : "#D9D9D955"}
          opacity={0.8}
        >
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">
              Communication & Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pace */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                  Speaking Pace
                </h3>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {data.pace.rating}
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.pace.comment}
              </p>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6" />

            {/* Filler Words */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                  Filler Words
                </h3>
                <span
                  className={`text-sm font-medium ${
                    isHighFillerWords
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {data.fillerWords.frequency}
                </span>
              </div>
              { isHighFillerWords && (
                <Alert className="border-amber-500 dark:border-amber-900 bg-amber-300/60 dark:bg-amber-950">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-900 dark:text-amber-200">
                    High Frequency Detected
                  </AlertTitle>
                  <AlertDescription className="mt-2 text-sm text-amber-800 dark:text-amber-300">
                    Consider reducing filler words to improve perceived
                    confidence.
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex flex-wrap gap-2">
                {data.fillerWords.commonFillers.map((filler, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {filler}
                  </span>
                ))}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.fillerWords.comment}
              </p>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6" />

            {/* Tone and Confidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                  Tone & Confidence
                </h3>
                <span className={`text-l font-medium ${
                        data.toneAndConfidence.score <= 4
                          ? "text-red-600 dark:text-red-500"
                          : data.toneAndConfidence.score <= 7
                          ? "text-orange-400 dark:text-orange-400"
                          : "text-green-600 dark:text-green-600"
                      }`}>
                  {data.toneAndConfidence.score}/10
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.toneAndConfidence.comment}
              </p>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6" />

            {/* Clarity and Articulation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                  Clarity & Articulation
                </h3>
                <span className={`text-l font-medium ${
                        data.clarityAndArticulation.score <= 4
                          ? "text-red-600 dark:text-red-500"
                          : data.clarityAndArticulation.score <= 7
                          ? "text-orange-400 dark:text-orange-400"
                          : "text-green-600 dark:text-green-600"
                      }`}>
                  {data.clarityAndArticulation.score}/10
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {data.clarityAndArticulation.comment}
              </p>
            </div>
          </CardContent>
        </HoverGradient>
      </Card>
    </motion.div>
  );
}
