"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, MicOff, AlertTriangle } from "lucide-react"
import { BestPracticesList } from "./best-practices-list"
import { MicrophoneSetup } from "./microphone-setup"

interface InterviewLobbyPageProps {
  handleConfirm: () => void; 
}

export function InterviewLobbyPage( { handleConfirm } : InterviewLobbyPageProps ) {
  const [permissionStatus, setPermissionStatus] = useState<"idle" | "granted" | "denied">("idle")
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
  const [audioLevel, setAudioLevel] = useState(0)
  const [micSelected, setMicSelected] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const handleRequestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      setPermissionStatus("granted")

      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const audioDevices = allDevices.filter((d) => d.kind === "audioinput")
      setDevices(audioDevices)

      if (audioDevices.length > 0) {
        setSelectedDeviceId(audioDevices[0].deviceId)
      }
    } catch (err) {
      console.error("[v0] Microphone permission error:", err)
      setPermissionStatus("denied")
    }
  }

  const handleMicChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId)
    setMicSelected(true)
  }

  useEffect(() => {
    if (!selectedDeviceId) return

    const setupAudioStream = async () => {
      try {
        // Stop previous stream and cleanup
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }

        // Get new stream with selected device
        const constraints = {
          audio: { deviceId: { exact: selectedDeviceId } },
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream

        // Setup Web Audio API
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 256

        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

        const visualize = () => {
          if (!analyserRef.current) return

          analyserRef.current.getByteFrequencyData(dataArray)
          const avg = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(avg)

          animationFrameRef.current = requestAnimationFrame(visualize)
        }

        visualize()
      } catch (err) {
        console.error("[v0] Error setting up audio stream:", err)
      }
    }

    setupAudioStream()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [selectedDeviceId])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1.0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-black/10">
          <CardHeader className="p-6 md:p-8">
            <CardTitle className="text-3xl font-bold tracking-tight">Interview Setup</CardTitle>
            <CardDescription className="text-lg text-neutral-500 dark:text-neutral-400">
              Let's check your audio and review best practices.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 md:p-8 pt-0 space-y-6">
            <BestPracticesList />

            <Separator className="bg-neutral-200 dark:bg-neutral-800" />

            <div className="space-y-4">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Microphone Setup</h3>

              {permissionStatus === "idle" && (
                <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900">
                  <MicOff className="h-5 w-5 text-amber-600" />
                  <AlertTitle className="text-amber-900 dark:text-amber-200">Permission Required</AlertTitle>
                  <AlertDescription className="text-amber-800 dark:text-amber-300">
                    We need permission to access your microphone.
                  </AlertDescription>
                  <Button onClick={handleRequestPermission} className="mt-4 bg-amber-600 hover:bg-amber-700 text-white">
                    Grant Permission
                  </Button>
                </Alert>
              )}

              {permissionStatus === "denied" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle>Permission Denied</AlertTitle>
                  <AlertDescription>
                    Please enable microphone access in your browser settings to continue.
                  </AlertDescription>
                </Alert>
              )}

              {permissionStatus === "granted" && (
                <MicrophoneSetup
                  devices={devices}
                  selectedDeviceId={selectedDeviceId}
                  audioLevel={audioLevel}
                  onMicChange={handleMicChange}
                />
              )}
            </div>
          </CardContent>

          <div className="p-6 md:p-8 pt-0 flex justify-end">
            <Button
              onClick={handleConfirm}
              disabled={permissionStatus !== "granted" || !selectedDeviceId}
              className="h-12 text-base font-semibold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              I'm Ready, Start Interview
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
