"use client";

import React, { useEffect } from "react";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

// Initialize PostHog on the client side
// if (typeof window !== 'undefined') {
// posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
//     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
//     loaded: (posthog) => {
//     if (process.env.NODE_ENV === 'development') posthog.debug();
//     },
//     person_profiles: 'identified_only',
// });
// }

// function PostHogPageview(): null {
// const pathname = usePathname();
// const searchParams = useSearchParams();

// useEffect(() => {
//     if (pathname) {
//     let url = window.origin + pathname;
//     if (searchParams && searchParams.toString()) {
//         url = url + `?${searchParams.toString()}`;
//     }
//     posthog.capture('$pageview', {
//         '$current_url': url,
//     });
//     }
// }, [pathname, searchParams]);

// return null;
// }

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {/* PostHogProvider wraps your app, making PostHog available everywhere  */}
      {/* <PostHogProvider client={posthog}> */}
      {/* <PostHogPageview /> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <Toaster richColors theme="dark" expand closeButton />
      {/* </PostHogProvider> */}
    </SessionProvider>
  );
};
