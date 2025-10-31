"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import { HoverGradient } from "../HoverGradient";

interface RoleSpecificFitProps {
  roleData: {
    technicalCompetency: string;
    behavioralCompetency: string;
    overallFitMessage: string;
  };
}

interface RoleSpecificFitPropsExtended extends RoleSpecificFitProps {
  isDark: boolean;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function RoleSpecificFit({
  roleData,
  isDark,
}: RoleSpecificFitPropsExtended) {
  return (
    <motion.div
      className="space-y-6"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-4">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <HoverGradient
            gradientSize={300}
            fromColor={isDark ? "#262626" : "#D9D9D955"}
            toColor={isDark ? "#262626" : "#D9D9D955"}
            opacity={0.8}
          >
            <CardHeader>
              <CardTitle className="text-base text-neutral-900 dark:text-white">
                Technical Competency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {roleData.technicalCompetency}
              </p>
            </CardContent>
          </HoverGradient>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <HoverGradient
            gradientSize={300}
            fromColor={isDark ? "#262626" : "#D9D9D955"}
            toColor={isDark ? "#262626" : "#D9D9D955"}
            opacity={0.8}
          >
            <CardHeader>
              <CardTitle className="text-base text-neutral-900 dark:text-white">
                Behavioral Competency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {roleData.behavioralCompetency}
              </p>
            </CardContent>
          </HoverGradient>
        </Card>
      </div>

      <Alert className="border-green-400 dark:border-green-900 bg-green-300/70 dark:bg-green-950">
        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="text-green-900 dark:text-green-200">
          Overall Fit Assessment
        </AlertTitle>
        <AlertDescription className="mt-2 text-sm text-green-800 dark:text-green-300">
          {roleData.overallFitMessage}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}
