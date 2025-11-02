"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Button } from "./button";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
  isHovered: boolean;
}

export const AnimatedThemeToggler = ({
  className,
  duration = 450,
  isHovered,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // keep state in sync with next-themes
  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    const newTheme = isDark ? "light" : "dark";

    // use View Transitions API for smooth circular reveal
    if ((document as any).startViewTransition) {
      const transition = (document as any).startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme); // ✅ use next-themes setter
        });
      });

      await transition.ready;

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } else {
      // fallback for browsers that don’t support view transitions
      setTheme(newTheme);
    }
  }, [isDark, duration, setTheme]);

  return (
    <Button
      variant="ghost"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "w-full justify-start transition-all duration-200",
        "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
        "dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-900/50"
      )}
      {...props}
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="mr-3 w-5 h-5" />}
      {isHovered && (
        <span className="ml-3">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
      )}
    </Button>
  );
};
