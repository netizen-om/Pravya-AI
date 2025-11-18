"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Image from "next/image"

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
}

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <motion.header
        className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 backdrop-blur-sm"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500">
                <AvatarFallback className="text-white font-bold">PA</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Pravya AI</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Interview Feedback Report</p>
              </div>
            </div>
            <div className="w-10 h-10" />
          </div>
        </div>
      </motion.header>
    )
  }

  return (
    <motion.header
      className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 backdrop-blur-sm"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500">
              <AvatarFallback className="text-white font-bold">PA</AvatarFallback>
            </Avatar> */}
            <Image src={"/logo/pravya-logo1.png"} alt="LOGO" height={39} width={39} />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Pravya AI</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Interview Feedback Report</p>
            </div>
          </div>

          {/* <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const nextTheme = theme === "dark" ? "light" : "dark"
              setTheme(nextTheme)
            }}
            className="rounded-full border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Moon className="h-4 w-4 text-neutral-600" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button> */}
        </div>
      </div>
    </motion.header>
  )
}
