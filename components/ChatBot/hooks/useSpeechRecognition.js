import { useState, useEffect, useCallback, useRef } from "react";
import { useHasMounted } from "./useClientOnlyState";

function useSpeechRecognition({ onTranscript, onListenEnd }) {
  const hasMounted = useHasMounted();
  const [isListening, setIsListening] = useState(false);
  const [sttError, setSttError] = useState(null);
  const recognitionRef = useRef(null);

  const [SpeechRecognition, setSpeechRecognition] = useState(null);
  const recognitionSupported = !!SpeechRecognition;

  useEffect(() => {
    if (hasMounted && typeof window !== "undefined") {
      setSpeechRecognition(
        () => window.SpeechRecognition || window.webkitSpeechRecognition || null
      );
    }
  }, [hasMounted]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionSupported || isListening || !SpeechRecognition) {
      if (!recognitionSupported)
        setSttError("Speech Recognition not supported.");
      return;
    }

    try {
      setSttError(null);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognitionRef.current = recognition;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (onTranscript) onTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error("SpeechRecognition Error:", event.error);
        let errorMessage = `Speech error: ${event.error}`;
        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          errorMessage =
            "Microphone access denied. Please check browser permissions.";
        } else if (event.error === "no-speech") {
          errorMessage = "No speech detected. Please try again.";
        } else if (event.error === "network") {
          errorMessage = "Network error during speech recognition.";
        } else if (event.error === "audio-capture") {
          errorMessage = "Audio capture error. Is microphone connected?";
        }
        setSttError(errorMessage);
        setIsListening(false);
        recognitionRef.current = null;
        if (onListenEnd) onListenEnd();
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        if (onListenEnd) onListenEnd();
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
      setSttError("Failed to initialize microphone. Please check permissions.");
      setIsListening(false);
      if (onListenEnd) onListenEnd();
    }
  }, [
    recognitionSupported,
    isListening,
    onTranscript,
    onListenEnd,
    SpeechRecognition,
  ]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return {
    isListening,
    sttError,
    recognitionSupported,
    startListening,
    stopListening,
    setSttError,
  };
}

export default useSpeechRecognition;
