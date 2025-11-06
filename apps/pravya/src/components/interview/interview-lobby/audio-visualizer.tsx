"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface AudioVisualizerProps {
  stream: MediaStream | null
}

type VisualizationMode = "bars" | "waveform" | "frequency"

export function AudioVisualizer({ stream }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const [mode, setMode] = useState<VisualizationMode>("bars")
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (!stream) {
      setIsActive(false)
      return
    }

    const setupAudioContext = async () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const source = audioContext.createMediaStreamSource(stream)
        const analyser = audioContext.createAnalyser()

        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.8
        source.connect(analyser)

        audioContextRef.current = audioContext
        analyserRef.current = analyser
        setIsActive(true)

        // Start visualization
        visualize(analyser, mode)
      } catch (error) {
        console.error("[v0] Audio context setup error:", error)
      }
    }

    setupAudioContext()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [stream])

  useEffect(() => {
    if (analyserRef.current && isActive) {
      visualize(analyserRef.current, mode)
    }
  }, [mode, isActive])

  const visualize = (analyser: AnalyserNode, visualizationMode: VisualizationMode) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      // Clear canvas with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(15, 15, 15, 1)")
      gradient.addColorStop(1, "rgba(25, 25, 25, 1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (visualizationMode === "bars") {
        drawBars(ctx, dataArray, canvas)
      } else if (visualizationMode === "waveform") {
        drawWaveform(ctx, dataArray, canvas)
      } else if (visualizationMode === "frequency") {
        drawFrequency(ctx, dataArray, canvas)
      }
    }

    draw()
  }

  const drawBars = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, canvas: HTMLCanvasElement) => {
    const barWidth = (canvas.width / dataArray.length) * 2.5
    let barHeight: number
    let x = 0

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height * 0.8

      // Gradient for bars
      const hue = (i / dataArray.length) * 360
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`

      const y = canvas.height - barHeight
      ctx.fillRect(x, y, barWidth - 2, barHeight)

      // Glow effect
      ctx.shadowBlur = 10
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`

      x += barWidth
    }

    ctx.shadowBlur = 0
  }

  const drawWaveform = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, canvas: HTMLCanvasElement) => {
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.shadowBlur = 8
    ctx.shadowColor = "rgba(16, 185, 129, 0.8)"

    ctx.beginPath()

    const sliceWidth = canvas.width / dataArray.length
    let x = 0

    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0
      const y = (v * canvas.height) / 2

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      x += sliceWidth
    }

    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  const drawFrequency = (ctx: CanvasRenderingContext2D, dataArray: Uint8Array, canvas: HTMLCanvasElement) => {
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < dataArray.length; i++) {
      const angle = (i / dataArray.length) * Math.PI * 2
      const value = dataArray[i] / 255
      const radius = 30 + value * 100

      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      ctx.fillStyle = `hsl(${(i / dataArray.length) * 360}, 100%, 50%)`
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw connecting line
      ctx.strokeStyle = `hsla(${(i / dataArray.length) * 360}, 100%, 50%, 0.3)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    // Draw center circle
    ctx.fillStyle = "#0ea5e9"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, Math.PI * 2)
    ctx.fill()
  }

  return (
    <div className="space-y-4 w-full">
      <div className="rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 shadow-2xl">
        <canvas ref={canvasRef} width={600} height={300} className="w-full h-48 md:h-64 display-block" />
      </div>

      {/* Visualization mode selector */}
      <div className="flex gap-2 justify-center flex-wrap">
        {(["bars", "waveform", "frequency"] as const).map((m) => (
          <motion.button
            key={m}
            onClick={() => setMode(m)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              mode === m
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Status indicator */}
      {isActive && (
        <div className="flex items-center justify-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"
          />
          <span className="text-sm text-neutral-400">Listening...</span>
        </div>
      )}
    </div>
  )
}
