"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";

// ---------------- Circle Component ----------------

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "border-border z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

// ---------------- Main Component ----------------

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        {/* Left Column */}
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}>
            <AIIcons.openai />
          </Circle>
          <Circle ref={div2Ref}>
            <AIIcons.gemini />
          </Circle>
          <Circle ref={div3Ref}>
            <AIIcons.nvidia />
          </Circle>
          <Circle ref={div4Ref}>
            <AIIcons.groq />
          </Circle>
          <Circle ref={div5Ref}>
            <AIIcons.deepseek />
          </Circle>
        </div>

        {/* Center — Hub */}
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16">
            <AIIcons.openai />
          </Circle>
        </div>

        {/* Right — User */}
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <AIIcons.user />
          </Circle>
        </div>
      </div>

      {/* Beam Lines */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
      />
    </div>
  );
}

// --------------------------------------------------
// 🚀 ICON PACK : OPENAI • GEMINI • NVIDIA • GROQ • DEEPSEEK • USER
// --------------------------------------------------

const AIIcons = {
  openai: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="black">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729z" />
    </svg>
  ),

  gemini: () => (
    <svg width="30" height="30" viewBox="0 0 48 48">
      <defs>
        <linearGradient id="gem" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#4285F4" />
          <stop offset="1" stopColor="#9B72FF" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="24" r="12" fill="url(#gem)" />
      <circle cx="32" cy="24" r="12" fill="url(#gem)" />
    </svg>
  ),

  nvidia: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="#76B900">
      <path d="M12 4.5c-4.69 0-8.5 3.81-8.5 8.5s3.81 8.5 8.5 8.5 8.5-3.81 8.5-8.5S16.69 4.5 12 4.5zm0 15c-3.58 0-6.5-2.92-6.5-6.5S8.42 6.5 12 6.5s6.5 2.92 6.5 6.5-2.92 6.5-6.5 6.5z" />
    </svg>
  ),

  groq: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF4B4B">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="5" fill="#fff" />
    </svg>
  ),

  deepseek: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#000">
      <path d="M12 2L3 22h18L12 2zm0 4.8 6.2 12H5.8L12 6.8z" />
    </svg>
  ),

  user: () => (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      stroke="#000"
      fill="none"
      strokeWidth="2"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    </svg>
  ),
};
