import React, { useState, useRef, useEffect, useCallback } from "react";
import ChatBody from "./ChatBody";
import ChatInputForm from "./ChatInputForm";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const fileInputRef = useRef(null);
  const chatBodyRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const [sttError, setSttError] = useState(null);
  const recognitionRef = useRef(null);

  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [ttsError, setTtsError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionSupported = !!SpeechRecognition;
  const synthesisSupported = "speechSynthesis" in window;

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [
    chatHistory,
    isLoading,
    error,
    imagePreviewUrl,
    sttError,
    ttsError,
    isSpeaking,
  ]);

  const speakText = useCallback(
    (text) => {
      if (!synthesisSupported || !isTtsEnabled || isSpeaking || !text) {
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => {
        setIsSpeaking(true);
        setTtsError(null);
      };
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        console.error("SpeechSynthesis Error:", event.error);
        setTtsError(`Speech error: ${event.error}`);
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    },
    [synthesisSupported, isTtsEnabled, isSpeaking]
  );

  const toggleTts = () => {
    if (!synthesisSupported) {
      setTtsError("Text-to-Speech is not supported in your browser.");
      return;
    }
    setIsTtsEnabled((prev) => {
      const newState = !prev;
      if (!newState) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return newState;
    });
    setTtsError(null);
  };

  const handleListen = () => {
    if (!recognitionSupported) {
      setSttError("Speech Recognition is not supported.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        setSttError(null);
        if (synthesisSupported) window.speechSynthesis.cancel();
        setIsSpeaking(false);

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setUserInput(transcript);
        };
        recognition.onerror = (event) => {
          console.error("SpeechRecognition Error:", event.error);
          let errorMessage = `Speech error: ${event.error}`;
          if (event.error === "not-allowed") {
            errorMessage = "Microphone access denied.";
          } else if (event.error === "no-speech") {
            errorMessage = "No speech detected.";
          }
          setSttError(errorMessage);
          setIsListening(false);
        };
        recognition.onend = () => {
          setIsListening(false);
          recognitionRef.current = null;
        };
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Failed to start recognition:", err);
        setSttError("Failed to start microphone.");
        setIsListening(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      if (synthesisSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [synthesisSupported]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setError("Could not read image file.");
        setImageFile(null);
        setImagePreviewUrl(null);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
      if (file) {
        setError("Please select a valid image file.");
      }
    }
    event.target.value = null;
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setError(null);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!userInput.trim() && !imageFile) || isLoading || isListening) return;

    recognitionRef.current?.abort();
    if (synthesisSupported) window.speechSynthesis.cancel();
    setIsListening(false);
    setIsSpeaking(false);

    const userMessageText = userInput;
    const attachedImageDataUrl = imagePreviewUrl;

    const newUserMessage = {
      role: "user",
      parts: [{ text: userMessageText || "(Image attached)" }],
      ...(attachedImageDataUrl && { imagePreview: attachedImageDataUrl }),
    };

    let historyForApi = [];
    setChatHistory((prev) => {
      historyForApi = prev;
      return [...prev, newUserMessage];
    });

    setUserInput("");
    setImageFile(null);
    setImagePreviewUrl(null);
    setError(null);
    setSttError(null);
    setTtsError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessageText,
          history: historyForApi,
          imageDataUrl: attachedImageDataUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch");
      }

      const data = await response.json();
      const modelMessage = { role: "model", parts: [{ text: data.answer }] };
      setChatHistory((prev) => [...prev, modelMessage]);

      speakText(data.answer);
    } catch (err) {
      console.error("Send Message Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      <ChatBody
        chatHistory={chatHistory}
        isLoading={isLoading}
        isSpeaking={isSpeaking}
        error={error}
        sttError={sttError}
        ttsError={ttsError}
        imagePreviewUrl={imagePreviewUrl}
        removeImage={removeImage}
        chatBodyRef={chatBodyRef}
      />

      <ChatInputForm
        userInput={userInput}
        setUserInput={setUserInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        isListening={isListening}
        isSpeaking={isSpeaking}
        isTtsEnabled={isTtsEnabled}
        imageFile={imageFile}
        triggerFileInput={triggerFileInput}
        handleListen={handleListen}
        toggleTts={toggleTts}
        recognitionSupported={recognitionSupported}
        synthesisSupported={synthesisSupported}
      />
    </div>
  );
}

export default Chatbot;
