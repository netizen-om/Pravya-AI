import { motion, useAnimation } from "framer-motion"
import { useEffect } from "react"
import Image from "next/image" // Import the Next.js Image component

const testimonials = [
  {
    name: "Ananya Gupta",
    username: "@ananya.codes",
    body: "Pravya AI felt like a real interviewer sitting across from me. The voice feedback helped me fix my tone and confidence before my actual interview!",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Rohit Sharma",
    username: "@rohit_dev",
    body: "I used Pravya AI to prepare for my software engineering role — the AI questions were spot on, and the feedback was insanely detailed.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Emily Chen",
    username: "@emilych",
    body: "The resume chatbot blew my mind! It explained my own projects better than I could. Definitely helped me sound more confident in interviews.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Vikram Patel",
    username: "@vikpatel",
    body: "Pravya AI made me realize where I was going wrong in behavioral questions. The voice-based experience feels super real.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Sophia Davis",
    username: "@sophiadavis",
    body: "I’ve tried many mock interview tools, but Pravya AI stands out. It’s like having a personal AI mentor guiding you through every question.",
    img: "https://images.unsplash.com/photo-1559192823-e1d8e87def54?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974",
  },
  {
    name: "Aarav Nair",
    username: "@aaravnair",
    body: "Pravya AI helped me prepare for my Google interview. The AI questions were tough, realistic, and the feedback helped me improve every round.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Maya Thompson",
    username: "@maya_thinks",
    body: "I love how interactive it feels. The AI voice actually understands your intent — it’s not robotic at all. Best interview prep tool I’ve used.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    name: "Aditya Verma",
    username: "@aditya_ai",
    body: "Pravya AI gave me the confidence to face real interviews. The detailed breakdown of answers and tone analysis is next-level stuff.",
    img: "https://plus.unsplash.com/premium_photo-1723478495487-c436ae82f48f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=952",
  },
  {
    name: "Rachel Lee",
    username: "@racheltalks",
    body: "It’s like having a 24/7 interview coach. The instant feedback and resume insights helped me land my first internship!",
    img: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
  },
]


// Slice testimonials for each column
const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

// Testimonial Card Component
const TestimonialCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <div className="relative w-full max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-10 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]">
      {/* This div's `blur-md` was causing significant lag */}
      <div className="absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b from-white/10 to-transparent"></div>
      <div className="text-white/90 leading-relaxed">{body}</div>
      <div className="mt-5 flex items-center gap-2">
        <Image
          src={img || "/placeholder.svg"}
          alt={name}
          height={40} // Use number for Next.js Image
          width={40} // Use number for Next.js Image
          className="h-10 w-10 rounded-full"
          loading="lazy"
          unoptimized // Add this if images.unsplash.com is not in next.config.js
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.onerror = null // Prevent infinite loop
            target.src = "https://placehold.co/40x40/333/FFF?text=?" // Fallback
          }}
        />
        <div className="flex flex-col">
          <div className="leading-5 font-medium tracking-tight text-white">{name}</div>
          <div className="leading-5 tracking-tight text-white/60">{username}</div>
        </div>
      </div>
    </div>
  )
}

// New Marquee Column Component using Framer Motion
const MarqueeColumn = ({
  testimonials,
  duration = 20,
  reverse = false,
  className = "",
}: {
  testimonials: (typeof testimonials)[0][] // Corrected type
  duration?: number
  reverse?: boolean
  className?: string
}) => {
  const controls = useAnimation()

  // Define the start and end points for the animation
  const yStart = reverse ? "-50%" : "0%"
  const yEnd = reverse ? "0%" : "-50%"

  // Function to start the animation
  const startAnimation = () => {
    controls.start({
      y: [yStart, yEnd],
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "loop",
          duration: duration,
          ease: "linear",
        },
      },
    })
  }

  // Start animation on component mount
  useEffect(() => {
    startAnimation()
  }, [controls, duration, reverse, yStart, yEnd]) // Re-run if props change

  return (
    <div
      className={`flex-shrink-0 ${className}`} // Pass external classNames
      onMouseEnter={() => controls.stop()} // Pause on hover
      onMouseLeave={startAnimation} // Resume on leave
    >
      <motion.div
        className="flex flex-col gap-6" // Gap between cards
        animate={controls}
        style={{ willChange: "transform" }} // Performance hint for browser
      >
        {/* Render the list twice for a seamless loop */}
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.username}-${index}`} // Create unique keys for looped items
            {...testimonial}
          />
        ))}
      </motion.div>
    </div>
  )
}

// Main Testimonials Section
export function TestimonialsSection() {
  return (
    <section id="testimonials" className="mb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-[540px]">
          <div className="flex justify-center">
            <button
              type="button"
              className="group relative z-[60] mx-auto rounded-full border border-white/20 bg-white/5 px-6 py-1 text-xs backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-100 md:text-sm"
            >
              <div className="absolute inset-x-0 -top-px mx-auto h-0.5 w-1T/2 bg-gradient-to-r from-transparent via-rose-200 to-transparent shadow-2xl transition-all duration-500 group-hover:w-3/4"></div>
              <div className="absolute inset-x-0 -bottom-px mx-auto h-0.5 w-1/2 bg-gradient-to-r from-transparent via-rose-200 to-transparent shadow-2xl transition-all duration-500 group-hover:h-px"></div>
              <span className="relative text-white">Testimonials</span>
            </button>
          </div>
          <h2 className="from-foreground/60 via-foreground to-foreground/60 dark:from-muted-foreground/55 dark:via-foreground dark:to-muted-foreground/55 mt-5 bg-gradient-to-r bg-clip-text text-center text-4xl font-semibold tracking-tighter text-transparent md:text-[54px] md:leading-[60px] __className_bb4e88 relative z-10">
            What our users say
          </h2>

          <p className="mt-5 relative z-10 text-center text-lg text-zinc-500">
            From intuitive design to powerful features, our app has become an
            essential tool for users around the world.
          </p>
        </div>

        {/* Replaced Marquee with Framer Motion MarqueeColumn */}
        {/* Removed [mask-image:...] from this div as it's very expensive to render on scrolling content */}
        <div className="my-16 flex max-h-[738px] justify-center gap-6 overflow-hidden">
          <MarqueeColumn testimonials={firstColumn} duration={20} />
          <MarqueeColumn
            testimonials={secondColumn}
            duration={25}
            reverse
            className="hidden md:block"
          />
          <MarqueeColumn
            testimonials={thirdColumn}
            duration={30}
            className="hidden lg:block"
          />
        </div>

        <div className="-mt-8 flex justify-center">
          <button className="group relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/50 px-6 py-3 text-sm font-medium text-white transition-all hover:border-white/60 hover:bg-white/10 active:scale-95">
            <div className="absolute inset-x-0 -top-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            <div className="absolute inset-x-0 -bottom-px mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
            </svg>
            Share your experience
          </button>
        </div>
      </div>
    </section>
  )
}

