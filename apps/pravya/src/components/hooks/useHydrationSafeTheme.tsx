"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

// This hook combines the next-themes useTheme hook
// with a mount-check to prevent hydration mismatches.
export const useHydrationSafeTheme = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Get all props from the original useTheme hook
  const themeProps = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    ...themeProps, // Returns theme, setTheme, resolvedTheme, etc.
    isMounted,      // Returns our new isMounted boolean
  };
};
