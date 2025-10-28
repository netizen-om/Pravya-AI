"use client";

import { createPortal } from "react-dom";
import { MultiStepLoader } from "../ui/multi-step-loader";

export default function GlobalLoader({
  loading,
  loadingStates,
  loop
}: {
  loading: boolean;
  loadingStates: { text: string }[];
  loop : boolean;
}) {
  if (typeof window === "undefined") return null; // for SSR safety

  return createPortal(
    <MultiStepLoader loading={loading} loadingStates={loadingStates} loop={loop} duration={1500} />,
    document.body
  );
}
