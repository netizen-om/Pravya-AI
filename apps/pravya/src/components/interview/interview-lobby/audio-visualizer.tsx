"use client"

import { motion } from "framer-motion"

interface AudioVisualizerProps {
  audioLevel: number
}

export function AudioVisualizer({ audioLevel }: AudioVisualizerProps) {
  const bars = Array.from({ length: 15 }, (_, i) => i)

  const getBarHeight = (index: number): number => {
    const baseHeight = 8
    const maxHeight = 100
    // Add some variation across bars for visual interest
    const variation = Math.sin((index * Math.PI) / 7.5) * 0.5 + 0.5
    const height = baseHeight + (audioLevel / 255) * maxHeight * variation
    return Math.min(height, maxHeight)
  }

  return (
    <div className="flex items-end justify-center gap-1 h-20 w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 overflow-hidden">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="flex-1 bg-blue-400 rounded-t-full"
          animate={{
            height: `${getBarHeight(i)}px`,
          }}
          transition={{
            duration: 0.05,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
