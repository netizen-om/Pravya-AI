"use client";

import { motion } from "framer-motion";
import { CheckCircle, FileText, BarChart3, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HoverGradient } from "../HoverGradient";

const activities = [
  {
    id: 1,
    type: "interview",
    title: "Completed Mock Interview",
    description: "System Design #23",
    timestamp: "2 hours ago",
    icon: CheckCircle,
    color: "blue",
  },
  {
    id: 2,
    type: "resume",
    title: "Resume Uploaded",
    description: "resume_om.pdf",
    timestamp: "1 day ago",
    icon: FileText,
    color: "green",
  },
  {
    id: 3,
    type: "analytics",
    title: "Analytics Report Generated",
    description: "Performance insights updated",
    timestamp: "2 days ago",
    icon: BarChart3,
    color: "purple",
  },
  {
    id: 4,
    type: "interview",
    title: "Completed Mock Interview",
    description: "Behavioral Practice #12",
    timestamp: "3 days ago",
    icon: CheckCircle,
    color: "orange",
  },
];

interface RecentActivityProps {
  isDark: boolean;
}

export function RecentActivity({ isDark }: RecentActivityProps) {
  const colorMap: Record<string, string> = {
    blue: "#3B82F6",
    green: "#22C55E",
    purple: "#A855F7",
    orange: "#FB923C",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.2 }}
      className="space-y-6"
    >
      {/* Header */}
      <h2
        className={cn(
          "text-2xl font-semibold",
          isDark ? "text-white" : "text-gray-900"
        )}
      >
        Recent Activity
      </h2>

      {/* Card Container */}
      <Card
        className={cn(
          "rounded-2xl shadow-sm border transition-all duration-300",
          isDark
            ? "bg-neutral-900/50 border-neutral-800"
            : "bg-white border-gray-200"
        )}
      >
        <HoverGradient
          gradientSize={300}
          fromColor={isDark ? "#262626" : "#D9D9D955"}
          toColor={isDark ? "#262626" : "#D9D9D955"}
          opacity={0.8}
        >
          <div className="rounded-2xl border-none transition-all duration-300 p-6">
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 * index }}
                  className="flex items-start space-x-4 relative"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center",
                        isDark ? "bg-neutral-800" : "bg-gray-100"
                      )}
                    >
                      <activity.icon
                        className="h-4 w-4"
                        style={{ color: colorMap[activity.color] }}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-gray-900"
                        )}
                      >
                        {activity.title}
                      </p>
                      <div
                        className={cn(
                          "flex items-center text-xs",
                          isDark ? "text-neutral-400" : "text-gray-500"
                        )}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.timestamp}
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-sm mt-1",
                        isDark ? "text-neutral-400" : "text-gray-600"
                      )}
                    >
                      {activity.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </HoverGradient>
      </Card>
    </motion.section>
  );
}
