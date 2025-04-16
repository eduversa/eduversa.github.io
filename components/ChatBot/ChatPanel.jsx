import React, { useState, useRef, useCallback, useEffect } from "react";
import { flushSync } from "react-dom"; // Only needed if using flushSync debug
import styles from "./ChatBot.module.scss";

import ChatHeader from "./components/ChatHeader/ChatHeader";
import ChatBody from "./components/ChatBody/ChatBody";
import ChatInputForm from "./components/ChatInputForm/ChatInputForm";

import useChatHistory from "./hooks/useChatHistory";
import useSpeechRecognition from "./hooks/useSpeechRecognition";
import useSpeechSynthesis from "./hooks/useSpeechSynthesis";

import { sendMessageToApi, sendActionToApi } from "./lib/apiClient";
import { formatChatForExport, generateMessageId } from "./lib/chatUtils";
import { SPECIAL_ACTIONS } from "./lib/constants";

function ChatPanel({ isOpen, onClose }) {
  const [userInput, setUserInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");

  const fileInputRef = useRef(null);
  const currentAbortController = useRef(null);

  const {
    chatHistory,
    historyRef,
    addMessage,
    updateLastMessage,
    clearHistory,
    updateMessageFeedback,
    setChatHistory,
    isHistoryInitialized,
  } = useChatHistory();

  useEffect(() => {}, [chatHistory]);

  const {
    isSpeaking,
    ttsError,
    isTtsEnabled,
    synthesisSupported,
    speakText,
    cancelSpeech,
    toggleTts,
    setTtsError,
  } = useSpeechSynthesis();

  const {
    isListening,
    sttError,
    recognitionSupported,
    startListening,
    stopListening,
    setSttError,
  } = useSpeechRecognition({
    onTranscript: setUserInput,
    onListenEnd: () => {},
  });

  const cancelCurrentRequest = useCallback(() => {
    if (currentAbortController.current) {
      currentAbortController.current.abort();
      currentAbortController.current = null;
    }
    setIsLoading(false);
    setLoadingMessage("");
  }, []);

  useEffect(() => {
    return () => {
      cancelCurrentRequest();
      cancelSpeech();
      stopListening();
    };
  }, [cancelCurrentRequest, cancelSpeech, stopListening]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setApiError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setApiError("Could not read image file.");
        setImageFile(null);
        setImagePreviewUrl(null);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
      if (file) {
        setApiError("Please select a valid image file.");
      }
    }
    if (event.target) event.target.value = null;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setApiError(null);
  };

  const handleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      if (isSpeaking) cancelSpeech();
      setUserInput("");
      startListening();
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if ((!userInput.trim() && !imageFile) || isLoading || isListening) return;

    cancelCurrentRequest();
    stopListening();
    cancelSpeech();
    setApiError(null);
    setSttError(null);
    setTtsError(null);

    const userMessageText = userInput;
    const attachedImageDataUrl = imagePreviewUrl;

    const historyForApi = historyRef.current.map(({ role, parts }) => ({
      role,
      parts,
    }));

    const newUserMessage = {
      id: generateMessageId(),
      role: "user",
      parts: [
        {
          text:
            userMessageText || (attachedImageDataUrl ? "(Image attached)" : ""),
        },
      ],
      ...(attachedImageDataUrl && { imagePreview: attachedImageDataUrl }),
      timestamp: new Date().toISOString(),
    };

    setIsLoading(true);
    setLoadingMessage("Connecting to EduversaBot...");

    setUserInput("");
    setImageFile(null);
    setImagePreviewUrl(null);

    currentAbortController.current = new AbortController();
    const signal = currentAbortController.current.signal;

    let accumulatedResponse = "";
    let hasReceivedData = false;

    await sendMessageToApi({
      question: userMessageText,
      history: historyForApi,
      imageDataUrl: attachedImageDataUrl,
      signal: signal,
      onStreamData: (chunk) => {
        setLoadingMessage("Receiving response...");
        accumulatedResponse += chunk;
        hasReceivedData = true;
      },
      onStreamEnd: (finalAccumulatedText, aborted = false) => {
        setIsLoading(false);
        setLoadingMessage("");
        currentAbortController.current = null;

        const responseText = aborted
          ? accumulatedResponse + " [Aborted]"
          : accumulatedResponse;
        const finalMessageText =
          responseText || (aborted ? "[Response aborted]" : "[No response]");

        if (hasReceivedData || !aborted) {
          const modelMessageId = generateMessageId();
          const newModelMessage = {
            id: modelMessageId,
            role: "model",
            parts: [{ text: finalMessageText }],
            timestamp: new Date().toISOString(),
            feedback: null,
          };
          setChatHistory((prev) => [...prev, newUserMessage, newModelMessage]);

          if (
            !aborted &&
            isTtsEnabled &&
            finalMessageText &&
            finalMessageText !== "[No response]" &&
            finalMessageText !== "[Response aborted]"
          ) {
            speakText(finalMessageText);
          }
        } else {
          // Only add user message if aborted before response
          setChatHistory((prev) => [...prev, newUserMessage]);
        }
      },
      onStreamError: (error) => {
        setIsLoading(false);
        setLoadingMessage("");
        currentAbortController.current = null;
        setApiError(`Error: ${error.message || "Failed to get response"}`);

        const errorMsgId = generateMessageId();
        const errorModelMessage = {
          id: errorMsgId,
          role: "model",
          parts: [{ text: `Sorry, an error occurred: ${error.message}` }],
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setChatHistory((prev) => [...prev, newUserMessage, errorModelMessage]);
      },
    });
  };

  const handleClearHistory = () => {
    cancelCurrentRequest();
    cancelSpeech();
    clearHistory();
    setApiError(null);
    setSttError(null);
    setTtsError(null);
  };

  const handleExportChat = () => {
    const chatText = formatChatForExport(historyRef.current);
    const blob = new Blob([chatText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `eduversa_chat_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleSummarizeChat = async () => {
    if (isLoading || historyRef.current.length < 2) {
      return;
    }

    cancelCurrentRequest();
    stopListening();
    cancelSpeech();
    setApiError(null);
    setSttError(null);
    setTtsError(null);

    setIsLoading(true);
    setLoadingMessage("Generating summary...");

    currentAbortController.current = new AbortController();
    const signal = currentAbortController.current.signal;
    const historyForApi = historyRef.current.map(({ role, parts }) => ({
      role,
      parts,
    }));

    try {
      const result = await sendActionToApi({
        action: SPECIAL_ACTIONS.SUMMARIZE,
        history: historyForApi,
        signal: signal,
      });
      const summaryMsgId = generateMessageId();
      addMessage({
        id: summaryMsgId,
        role: "model",
        parts: [{ text: `**Summary:**\n${result.answer}` }],
        timestamp: new Date().toISOString(),
        isSummary: true,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Summarize Error:", error);
        setApiError(`Failed to summarize: ${error.message}`);
        const errorMsgId = generateMessageId();
        addMessage({
          id: errorMsgId,
          role: "model",
          parts: [
            { text: `Sorry, could not generate summary: ${error.message}` },
          ],
          timestamp: new Date().toISOString(),
          isError: true,
        });
      } else {
        console.log("Summarize request aborted.");
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
      currentAbortController.current = null;
    }
  };

  const handleFeedback = (messageId, feedbackType) => {
    updateMessageFeedback(messageId, feedbackType);
  };

  return (
    <div
      className={`${styles.chatPanel} ${isOpen ? styles.open : styles.closed}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
        accept="image/*"
      />
      <ChatHeader
        onClearHistory={handleClearHistory}
        onExportChat={handleExportChat}
        onSummarizeChat={handleSummarizeChat}
        isTtsEnabled={isTtsEnabled}
        onToggleTts={toggleTts}
        synthesisSupported={synthesisSupported}
        isLoading={isLoading}
        onClose={onClose}
      />
      <ChatBody
        chatHistory={chatHistory}
        isHistoryInitialized={isHistoryInitialized}
        isLoading={isLoading}
        isSpeaking={isSpeaking}
        isStreaming={false}
        loadingMessage={loadingMessage}
        apiError={apiError}
        sttError={sttError}
        ttsError={ttsError}
        imagePreviewUrl={imagePreviewUrl}
        removeImage={removeImage}
        onFeedback={handleFeedback}
      />
      <ChatInputForm
        userInput={userInput}
        setUserInput={setUserInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        isStreaming={false}
        isListening={isListening}
        imageFile={imageFile}
        triggerFileInput={triggerFileInput}
        handleListen={handleListen}
        recognitionSupported={recognitionSupported}
      />
      {isLoading && (
        <button onClick={cancelCurrentRequest} className={styles.cancelButton}>
          Cancel Request
        </button>
      )}
    </div>
  );
}

export default ChatPanel;
