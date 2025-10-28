"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { FaMicrophoneLines } from "react-icons/fa6";


export const MicSelector = ({ selectedMic, setSelectedMic }: any) => {
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audioInputs = devices.filter((d) => d.kind === "audioinput");
      setMics(audioInputs);
      if (audioInputs[0] && !selectedMic) setSelectedMic(audioInputs[0].deviceId);
    });
  }, []);

  const handleMicChange = (deviceId: string) => {
    setSelectedMic(deviceId);
    console.log("🎤 Selected mic:", deviceId);
  };


  return (
    <div className="flex items-center space-x-2 m-3">
      <FaMicrophoneLines className="w-5 h-5 text-gray-300" />
      <Select onValueChange={handleMicChange} value={selectedMic}>
        <SelectTrigger className="w-56 bg-neutral-800 border-neutral-700 text-gray-200 focus:ring-0">
          <SelectValue placeholder="Select microphone" />
        </SelectTrigger>
        <SelectContent className="bg-neutral-900 border-neutral-800 text-gray-200">
          {mics.length > 0 ? (
            mics.map((mic) => (
              <SelectItem key={mic.deviceId} value={mic.deviceId}>
                {mic.label || "Unknown Microphone"}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled value="none">
              No microphones found
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};