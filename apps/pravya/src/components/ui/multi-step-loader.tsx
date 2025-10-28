"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";
import TextShimmer from "../forgeui/text-shimmer";

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={cn("w-6 h-6", className)}
  >
    <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const CheckFilled = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("w-6 h-6", className)}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
      clipRule="evenodd"
    />
  </svg>
);

type LoadingState = { text: string };

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => (
  <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
    {loadingStates.map((loadingState, index) => {
      const distance = Math.abs(index - value);
      const opacity = Math.max(1 - distance * 0.2, 0);

      return (
        <motion.div
          key={index}
          className="text-left flex gap-2 mb-4"
          initial={{ opacity: 0, y: -(value * 40) }}
          animate={{ opacity, y: -(value * 40) }}
          transition={{ duration: 0.5 }}
        >
          <div>
            {index > value ? (
              <CheckIcon className="text-black dark:text-white" />
            ) : (
              <CheckFilled
                className={cn(
                  "text-black dark:text-white",
                  value === index &&
                    "text-black dark:text-slate-300 opacity-100"
                )}
              />
            )}
          </div>
          <span
            className={cn(
              "text-black dark:text-white",
              value === index && "text-black dark:text-slate-300 opacity-100"
            )}
          >
            {loadingState.text}
          </span>
        </motion.div>
      );
    })}

    {/* 👇 Extra message when all states complete */}
    <AnimatePresence mode="wait">
      {value === loadingStates.length - 1 && (
        <motion.div
          key="final-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-[-40px] text-center text-l text-gray-600 dark:text-gray-400"
        >
          <TextShimmer duration={1.5} repeatDelay={0.5}>
            Please wait, it might take a few seconds...
          </TextShimmer>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? prevState
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);
    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl bg-transparent"
        >
          <div className="h-96 relative">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>
          <div className="inset-x-0 z-20 bottom-0 h-full absolute" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
