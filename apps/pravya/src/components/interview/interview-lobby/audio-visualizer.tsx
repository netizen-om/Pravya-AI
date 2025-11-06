"use client";

import React, { useRef, useEffect, useState } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";

interface MyAudioVisualizerProps {
  /** If you have a blob (e.g. recorded or fetched audio) use blob mode */
  audioBlob?: Blob;
  /** If you have a live media stream (e.g. microphone) use live mode */
  mediaStream?: MediaStream;
  /** width & height for the visualizer canvas */
  width?: number;
  height?: number;
}

export function MyAudioVisualizer({
  audioBlob,
  mediaStream,
  width = 600,
  height = 100,
}: MyAudioVisualizerProps) {
  // determine current theme (light/dark) — example using CSS media query
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    setIsDark(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // define colours based on theme
  const backgroundColor = isDark ? "#1e1e1e" : "#f5f5f5";
  const barColor = isDark ? "#4b9aff" : "#1e40ff";       // un-played bars
  const barPlayedColor = isDark ? "#2c6bed" : "#2563eb"; // played bars

  if (mediaStream) {
    // live mode
    return (
      <div style={{ backgroundColor, borderRadius: 8, padding: 8 }}>
        <LiveAudioVisualizer
          mediaRecorder={ /* create a MediaRecorder from mediaStream in parent */ }
          width={width}
          height={height}
          barWidth={2}
          gap={1}
          backgroundColor="transparent"
          barColor={barColor}
        />
      </div>
    );
  }

  if (audioBlob) {
    // blob/file mode
    const blobUrl = URL.createObjectURL(audioBlob);
    return (
      <div style={{ backgroundColor, borderRadius: 8, padding: 8 }}>
        <AudioVisualizer
          blob={audioBlob}
          width={width}
          height={height}
          barWidth={2}
          gap={1}
          backgroundColor={backgroundColor}
          barColor={barColor}
          barPlayedColor={barPlayedColor}
        />
        <audio src={blobUrl} controls style={{ width: "100%", marginTop: 8 }} />
      </div>
    );
  }

  return <div style={{ color: isDark ? "#fff" : "#000" }}>No audio source</div>;
}
