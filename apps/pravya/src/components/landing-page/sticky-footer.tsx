"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function StickyFooter() {
  const [isAtBottom, setIsAtBottom] = useState(false)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight
          const isNearBottom = scrollTop + windowHeight >= documentHeight - 100

          setIsAtBottom(isNearBottom)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isAtBottom && (
        <motion.div
          className="fixed z-50 bottom-0 left-0 w-full h-80 flex justify-center items-center"
          /* Changed footer background from orange to white for monochrome */
          style={{ backgroundColor: "white" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="relative overflow-hidden w-full h-full flex justify-end px-12 text-right items-start py-12"
            /* Changed footer text color from orange background dark to white background dark */
            style={{ color: "black" }}
          >
            <motion.div
              className="flex flex-row space-x-12 sm:space-x-16 md:space-x-24 text-sm sm:text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <ul className="space-y-2">
                <li
                  className="hover:underline cursor-pointer transition-colors"
                  style={{ color: "black" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0, 0, 0, 0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                >
                  Home
                </li>
                <li
                  className="hover:underline cursor-pointer transition-colors"
                  style={{ color: "black" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0, 0, 0, 0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                >
                  Docs
                </li>
                <li
                  className="hover:underline cursor-pointer transition-colors"
                  style={{ color: "black" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0, 0, 0, 0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                >
                  Components
                </li>
              </ul>
              <ul className="space-y-2">
                <li
                  className="hover:underline cursor-pointer transition-colors"
                  style={{ color: "black" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0, 0, 0, 0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                >
                  Github
                </li>
                <li
                  className="hover:underline cursor-pointer transition-colors"
                  style={{ color: "black" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0, 0, 0, 0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                >
                  Twitter
                </li>
                <li
                  className="hover:underline cursor-pointer transition-colors"
                  style={{ color: "black" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0, 0, 0, 0.8)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                >
                  Discord
                </li>
              </ul>
            </motion.div>
            <motion.h2
              className="absolute bottom-0 left-0 translate-y-1/3 sm:text-[192px] text-[80px] font-bold select-none"
              style={{ color: "black" }}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Pravya
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
