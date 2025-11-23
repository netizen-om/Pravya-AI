"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Brain, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonalisedInterviewDialog } from "./personalised-interview-dialog";
import { BackButton } from "../BackButton";

export function PageHeader() {
  return (
    <div>
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8"
      >
        {/* Left Side - Branding & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 mt-8"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Interviews
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Review past sessions or start a new one.
          </p>
        </motion.div>

        {/* Right Side - CTAs */}
        <div className="flex gap-3">
          <Link href="/interview/templates">
            <Button variant="outline" className="gap-2 bg-transparent">
              <LayoutGrid className="w-4 h-4" />
              Browse Templates
            </Button>
          </Link>
          <PersonalisedInterviewDialog />
        </div>
      </motion.div>
    </div>
  );
}
