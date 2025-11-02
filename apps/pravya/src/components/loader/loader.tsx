import { Loader2 } from "lucide-react";
import React from "react";

import { motion } from "motion/react";
import TextShimmer from "../forgeui/text-shimmer";

const Loader = ({ title = "Loading..." }: { title: string }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <style jsx global>{`
        * {
          transition: all 0.2s ease-in-out;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1f1f1f;
        }
        ::-webkit-scrollbar-thumb {
          background: #404040;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        {/* <p className="text-gray-400">{title}</p> */}
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
      </div>
    </div>
  );
};

export default Loader;
