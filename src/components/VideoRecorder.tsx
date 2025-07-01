// components/VideoRecorder.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface VideoRecorderProps {
  onRecordingComplete: (videoFile: File) => void;
}

export function VideoRecorder({ onRecordingComplete }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideo(videoUrl);
        recordedChunksRef.current = [];
      };

      setCountdown(10);
      mediaRecorder.start(1000);
      setRecording(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setCountdown(0);
      const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
      tracks?.forEach((track) => track.stop());
    }
  };

  const confirmRecording = () => {
    if (recordedVideo) {
      fetch(recordedVideo)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "verification.webm", {
            type: "video/webm",
          });
          onRecordingComplete(file);
        });
    }
  };

  useEffect(() => {
    if (countdown > 0 && recording) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && recording) {
      stopRecording();
    }
  }, [countdown, recording]);

  return (
    <div className="space-y-2">
      <div className="relative bg-black rounded-md overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto max-h-64"
        />
        {recording && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md">
            Recording: {countdown}s
          </div>
        )}
      </div>

      {recordedVideo ? (
        <div className="space-y-2">
          <video
            src={recordedVideo}
            controls
            className="w-full h-auto max-h-64"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setRecordedVideo(null)}>
              Retake
            </Button>
            <Button onClick={confirmRecording}>Confirm Video</Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={recording ? stopRecording : startRecording}
          variant={recording ? "destructive" : "default"}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>
      )}
    </div>
  );
}
