"use client"

import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic } from "lucide-react"
import { AudioVisualizer } from "./audio-visualizer"

interface MicrophoneSetupProps {
  devices: MediaDeviceInfo[]
  selectedDeviceId: string
  audioLevel: number
  onMicChange: (deviceId: string) => void
}

export function MicrophoneSetup({ devices, selectedDeviceId, audioLevel, onMicChange }: MicrophoneSetupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-900 dark:text-white">Select Microphone</label>
        <Select value={selectedDeviceId || ""} onValueChange={onMicChange}>
          <SelectTrigger className="w-full">
            <Mic className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Select your microphone..." />
          </SelectTrigger>
          <SelectContent>
            {devices.map((device) => (
              <SelectItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedDeviceId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <AudioVisualizer audioLevel={audioLevel} />
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">Speak into your mic to test.</p>
        </motion.div>
      )}
    </motion.div>
  )
}
