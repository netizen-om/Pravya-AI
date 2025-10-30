"use client"

import React, { useCallback, useEffect } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"

interface HoverGradientProps {
  children: React.ReactNode
  className?: string
  gradientSize?: number
  fromColor?: string
  toColor?: string
  opacity?: number
}

export function HoverGradient({
  children,
  className = "",
  gradientSize = 200,
  fromColor = "#9E7AFF", // purple
  toColor = "#FE8BBB", // pink
  opacity = 0.3,
}: HoverGradientProps) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [gradientSize, mouseX, mouseY])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    reset()
  }, [reset])

  return (
    <div
      className={`relative overflow-hidden rounded-xl group ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {/* Radial gradient that follows cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${fromColor},
              ${toColor},
              transparent 80%)
          `,
          opacity,
        }}
      />
      {/* Child content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
