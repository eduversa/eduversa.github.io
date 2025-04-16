import { useState, useEffect, useCallback, useRef } from "react";
import useLocalStorage from "./useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../lib/constants";
import { useHasMounted } from "./useClientOnlyState";

function useSpeechSynthesis() {
  const hasMounted = useHasMounted();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsError, setTtsError] = useState(null);
  const [isTtsEnabled, setIsTtsEnabled] = useLocalStorage(
    LOCAL_STORAGE_KEYS.TTS_ENABLED,
    true
  );
  const utteranceRef = useRef(null);

  const synthesisSupported =
    hasMounted && typeof window !== "undefined" && "speechSynthesis" in window;

  const speakText = useCallback(
    (text) => {
      if (!synthesisSupported || !isTtsEnabled || isSpeaking || !text) {
        return;
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setTtsError(null);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      utterance.onerror = (event) => {
        console.error("SpeechSynthesis Error:", event.error);
        setTtsError(`Speech error: ${event.error}`);
        setIsSpeaking(false);
        utteranceRef.current = null;
      };
      window.speechSynthesis.speak(utterance);
    },
    [synthesisSupported, isTtsEnabled, isSpeaking]
  );

  const cancelSpeech = useCallback(() => {
    if (synthesisSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  }, [synthesisSupported]);

  const toggleTts = useCallback(() => {
    if (!synthesisSupported) {
      setTtsError("Text-to-Speech is not supported in your browser.");
      return;
    }
    setIsTtsEnabled((prev) => {
      const newState = !prev;
      if (!newState) {
        cancelSpeech();
      }
      return newState;
    });
    setTtsError(null);
  }, [synthesisSupported, setIsTtsEnabled, cancelSpeech]);

  useEffect(() => {
    return () => {
      cancelSpeech();
    };
  }, [cancelSpeech]);

  return {
    isSpeaking,
    ttsError,
    isTtsEnabled,
    synthesisSupported,
    speakText,
    cancelSpeech,
    toggleTts,
    setTtsError,
  };
}

export default useSpeechSynthesis;
