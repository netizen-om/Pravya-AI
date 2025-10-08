"use client"

import type React from "react"

import { motion } from "framer-motion"
import { FileX } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon = FileX, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="bg-neutral-950/90 border-neutral-800 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)] p-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto">
            <Icon className="h-8 w-8 text-neutral-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">{description}</p>
          </div>

          {actionLabel && onAction && (
            <Button onClick={onAction} className="bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">
              {actionLabel}
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
