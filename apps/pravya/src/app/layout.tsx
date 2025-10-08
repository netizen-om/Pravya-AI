// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Just import the main Providers component
import { Providers } from "./provider"; // Corrected the filename to 'providers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pravya AI",
  description: "Ace Every Interview with Pravya AI",
  icons: {
    icon: "logo/pravya-logo.png",
    shortcut: "logo/pravya-logo.png",
    apple: "logo/pravya-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* This is all you need! */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}