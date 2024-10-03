import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // Store the recorded audio
  const [isSendingAudio, setIsSendingAudio] = useState<boolean>(false); // Store the recorded audio

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      let localAudioBlob: Blob | null = null;

      recorder.ondataavailable = (e) => {
        localAudioBlob = e.data; // Store the recorded audio as Blob
        setAudioBlob(e.data); // Update state as well
      };

      recorder.onstop = () => {
        if (localAudioBlob) {
          sendAudioToAPI(localAudioBlob); // Automatically send audio when recording stops
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: "Recording started",
        description: "Audio recording has begun.",
      });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: "Recording error",
        description: "Failed to access the microphone.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Function to send audio to an API
  const sendAudioToAPI = async (audio: Blob) => {
    setIsSendingAudio(true);
    try {
      const arrayBuffer = await audio.arrayBuffer(); // Convert Blob to ArrayBuffer
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: "Audio sending to server",
        description: "Your audio is sending to the server.",
      });

      const response = await fetch("/api/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: arrayBuffer,
      });


      if (response.ok) {
        const audioResponseBlob = await response.blob(); // Get the audio file as a Blob
        playAudioBlob(audioResponseBlob); // Automatically play the audio blob

      } else {
        console.error("Audio upload failed");
        toast({
          className: cn(
            'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
          ),
          title: "Upload error",
          description: "Failed to upload the audio to the server.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error uploading audio:", err);
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: "Upload error",
        description: "An error occurred while uploading the audio.",
        variant: "destructive",
      });
    } finally {
      setIsSendingAudio(false);
    }
  };

  // Function to play audio from a Blob
  const playAudioBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob); // Create an object URL from the Blob
    const audio = new Audio(url);

    const mimeType = blob.type;
    if (!audio.canPlayType(mimeType)) {
      console.error(`Audio format not supported: ${mimeType}`);
      toast({
        className: cn(
          'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4'
        ),
        title: "Playback error",
        description: `The audio format ${mimeType} is not supported.`,
        variant: "destructive",
      });
      return;
    }

    audio.play().catch((err) => console.error("Error playing audio:", err));

    audio.onended = () => {
      URL.revokeObjectURL(url);
    };
  };

  return { isRecording, startRecording, stopRecording, isSendingAudio };
}
