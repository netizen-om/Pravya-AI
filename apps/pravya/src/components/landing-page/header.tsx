"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface HeaderProps {
  isScrolled: boolean;
}

const LandingHeader = ({ isScrolled }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession(); // 👈 get auth session state

  const handleMobileNavClick = (elementId: string) => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        const headerOffset = 120;
        const elementPosition =
          element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const isAuthenticated = status === "authenticated";

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`fixed top-4 z-[9999] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-background/60 md:flex backdrop-blur-sm border border-border/50 shadow-lg transition-all duration-300 ${
          isScrolled ? "max-w-3xl px-2" : "max-w-5xl px-4"
        } py-2`}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
        <Link
          className={`z-50 flex items-center justify-center gap-2 transition-all duration-300 ${
            isScrolled ? "ml-4" : ""
          }`}
          href="/"
        >
          <Image
            src={"/logo/pravya-logo1.png"}
            height={30}
            width={30}
            alt="Pravya Logo"
          />
        </Link>

        <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-muted-foreground transition duration-200 hover:text-foreground md:flex md:space-x-2">
          {["features", "pricing", "testimonials", "FAQ"].map((section) => (
            <a
              key={section}
              className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(section);
                if (element) {
                  const headerOffset = 120;
                  const elementPosition =
                    element.getBoundingClientRect().top + window.pageYOffset;
                  const offsetPosition = elementPosition - headerOffset;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
            >
              <span className="relative z-20 capitalize">{section}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/auth/sign-in"
                className="z-10 font-medium transition-colors hover:text-foreground text-muted-foreground text-sm cursor-pointer"
              >
                Log In
              </Link>

              <Link
                href="/auth/sign-up"
                className="rounded-md font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] px-4 py-2 text-sm"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              href="/dashboard"
              className="rounded-md font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] px-4 py-2 text-sm"
            >
              Dashboard
            </Link>
          )}
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-4 z-[9999] mx-4 flex w-auto flex-row items-center justify-between rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg md:hidden px-4 py-3">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Image
            src={"/logo/pravya-logo1.png"}
            height={25}
            width={25}
            alt="Pravya Logo"
          />
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background/50 border border-border/50 transition-colors hover:bg-background/80"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col items-center justify-center w-5 h-5 space-y-1">
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </div>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden">
          <div className="absolute top-20 left-4 right-4 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl p-6">
            <nav className="flex flex-col space-y-4">
              {["features", "pricing", "testimonials", "faq"].map((section) => (
                <button
                  key={section}
                  onClick={() => handleMobileNavClick(section)}
                  className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}

              <div className="border-t border-border/50 pt-4 mt-4 flex flex-col space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/auth/sign-in"
                      className="px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50 cursor-pointer"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/auth/sign-up"
                      className="px-4 py-3 text-lg font-bold text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-lg font-bold text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingHeader;
