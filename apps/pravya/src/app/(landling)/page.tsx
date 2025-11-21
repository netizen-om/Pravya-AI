"use client";
import { useState, useEffect } from "react";
import Hero from "@/components/landing-page/hero";
import Features from "@/components/landing-page/features";
import { TestimonialsSection } from "@/components/landing-page/testimonials";
import { NewReleasePromo } from "@/components/landing-page/new-release-promo";
import { FAQSection } from "@/components/landing-page/faq-section";
import { PricingSection } from "@/components/landing-page/pricing-section";
import { StickyFooter } from "@/components/landing-page/sticky-footer";
import LandingHeader from "@/components/landing-page/header";
import Lenis from "@studio-freight/lenis";
import { LandingFooter } from "@/components/Footer";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Force dark mode
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "system");
    root.classList.add("dark");
  }, []);

  // Scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🌀 Lenis Smooth Scroll Setup
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.4, // Smoothness duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Natural easing
      smoothWheel: true, // Enables wheel smoothness
      smoothTouch: false, // Disable smoothness on touch devices for performance
      direction: "vertical",
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="dark">
      <div className="min-h-screen w-full relative top-0 bg-black">
        <div className="absolute inset-0 z-0" />

        {/* Header */}
        <div className="flex justify-center">
          <LandingHeader isScrolled={isScrolled} />
        </div>

        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <div id="features">
          <Features />
        </div>

        {/* Pricing Section */}
        <div id="pricing">
          <PricingSection />
        </div>

        {/* Testimonials Section */}
        <div id="testimonials">
          <TestimonialsSection />
        </div>

        {/* New Release Promo */}
        <NewReleasePromo />

        {/* FAQ Section */}
        <div id="faq">
          <FAQSection />
        </div>

        <div>
          <LandingFooter />
        </div>

        {/* Sticky Footer */}
        {/* <StickyFooter /> */}
      </div>
    </div>
  );
}
