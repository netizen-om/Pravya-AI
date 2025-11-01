// "use client"
// import React from 'react'
// import HeroSection from '@/components/HeroSection';
// import { LandingFooter } from '@/components/Footer';

// function page() {

//   return (
//     <div>
//       <HeroSection />
//       <LandingFooter />
//     </div>
//   )
// }
// export default page

"use client"
import { useState, useEffect } from "react"
import Hero from "@/components/landing-page/hero"
import Features from "@/components/landing-page/features"
import { TestimonialsSection } from "@/components/landing-page/testimonials"
import { NewReleasePromo } from "@/components/landing-page/new-release-promo"
import { FAQSection } from "@/components/landing-page/faq-section"
import { PricingSection } from "@/components/landing-page/pricing-section"
import { StickyFooter } from "@/components/landing-page/sticky-footer"
import LandingHeader from "@/components/landing-page/header"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)


  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "system")
    root.classList.add("dark")
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  return (
    <div className="min-h-screen w-full relative top-0 bg-black">
    
      <div
        className="absolute inset-0 z-0"
      />

      {/* Desktop Header */}
      <div className="flex justify-center">
      <LandingHeader isScrolled={isScrolled}/>
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

      <NewReleasePromo />

      {/* FAQ Section */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* Sticky Footer */}
      <StickyFooter />
    </div>
  )
}
