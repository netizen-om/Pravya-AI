"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"

export function StickyFooter() {
  // ✅ Define navigation structure here
  const navigation = [
    {
      title: "Main",
      items: [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Social",
      items: [
        { name: "Github", href: "https://github.com/netizen-om/Pravya-AI" },
        { name: "linkedIn", href: "https://www.linkedin.com/in/om-borisagar-754591314/" },
        { name: "Discord", href: "https://discord.gg/wbheCWqTaH" },
      ],
    },
  ]

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
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isAtBottom && (
        <motion.div
          className="fixed z-50 bottom-0 left-0 w-full h-80 flex justify-center items-center"
          style={{ backgroundColor: "white" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div
            className="relative overflow-hidden w-full h-full flex justify-end px-12 text-right items-start py-12"
            style={{ color: "black" }}
          >
            <motion.div
              className="flex flex-row space-x-12 sm:space-x-16 md:space-x-24 text-sm sm:text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {navigation.map((group, groupIndex) => (
                <ul key={groupIndex} className="space-y-2">
                  {group.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="hover:underline cursor-pointer transition-colors"
                      style={{ color: "black" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(0, 0, 0, 0.8)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
                    >
                      <Link href={item.href}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              ))}
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
