import { useCallback, useRef, useState } from "react";

export function useAudioRecorder(onStop: (file: File) => void) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const mimeType =
      ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/webm", "audio/ogg"]
        .find((t) => MediaRecorder.isTypeSupported(t)) || undefined;

    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    const chunks: BlobPart[] = [];

    rec.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const type = mimeType?.split(";")[0] || "audio/webm";
      const ext = type.includes("ogg") ? "ogg" : "webm";
      const blob = new Blob(chunks, { type });
      const file = new File([blob], `audio-${Date.now()}.${ext}`, { type });
      onStop(file);
      setRecording(false);
      setSeconds(0);
    };

    rec.start(250);
    recRef.current = rec;
    setRecording(true);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }, [onStop]);

  const stop = useCallback(() => {
    if (recRef.current && recording) {
      recRef.current.stop();
      recRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [recording]);

  return { recording, seconds, start, stop };
}
