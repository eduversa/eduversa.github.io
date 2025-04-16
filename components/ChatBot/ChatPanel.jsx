import React, { useState, useRef, useCallback, useEffect } from "react";
import { flushSync } from "react-dom";
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

function generateQuickReplies(responseText) {
  const replies = [];
  const lowerText = responseText.toLowerCase();

  if (
    lowerText.includes("register") ||
    lowerText.includes("sign up") ||
    lowerText.includes("applicant portal")
  ) {
    replies.push({
      label: "How do I recover my password?",
      action: "query",
      value: "How do I recover my password?",
    });
    replies.push({
      label: "Where do I update my profile?",
      action: "query",
      value: "Where do I update my profile?",
    });
  } else if (
    lowerText.includes("password recovery") ||
    lowerText.includes("forgot password")
  ) {
    replies.push({
      label: "How do I recover my username?",
      action: "query",
      value: "How do I recover my username?",
    });
    replies.push({
      label: "Take me to the login page",
      action: "query",
      value: "Where is the login page?",
    }); // Assuming 'link' action isn't implemented yet
  } else if (
    lowerText.includes("update profile") ||
    lowerText.includes("applicant dashboard")
  ) {
    replies.push({
      label: "What details can I update?",
      action: "query",
      value: "What details can I update in my profile?",
    });
    replies.push({
      label: "How long does verification take?",
      action: "query",
      value: "How long does applicant verification take?",
    });
  } else if (
    lowerText.includes("routine management") ||
    lowerText.includes("class schedule")
  ) {
    replies.push({
      label: "Who can manage routines?",
      action: "query",
      value: "Who can manage routines?",
    });
    replies.push({
      label: "How do students view routines?",
      action: "query",
      value: "How do students view routines?",
    });
  } else if (
    lowerText.includes("cannot answer") ||
    lowerText.includes("outside my scope") ||
    lowerText.includes("my focus is strictly")
  ) {
    replies.push({
      label: "What topics can you help with?",
      action: "query",
      value: "What topics can you help with?",
    });
    replies.push({
      label: "Summarize the chat",
      action: "summarize",
      value: "Summarize",
    }); // Example of a different action type
  }

  return replies.slice(0, 3); // Limit to max 3 replies for UI
}

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

  const processAndSendMessage = useCallback(
    async (messageText, imagePreviewDataUrl = null) => {
      if (
        (!messageText.trim() && !imagePreviewDataUrl) ||
        isLoading ||
        isListening
      )
        return;

      cancelCurrentRequest();
      stopListening();
      cancelSpeech();
      setApiError(null);
      setSttError(null);
      setTtsError(null);

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
              messageText || (imagePreviewDataUrl ? "(Image attached)" : ""),
          },
        ],
        ...(imagePreviewDataUrl && { imagePreview: imagePreviewDataUrl }),
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
        question: messageText,
        history: historyForApi,
        imageDataUrl: imagePreviewDataUrl,
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
            const quickReplies = generateQuickReplies(finalMessageText); // Generate quick replies
            const newModelMessage = {
              id: modelMessageId,
              role: "model",
              parts: [{ text: finalMessageText }],
              timestamp: new Date().toISOString(),
              feedback: null,
              ...(quickReplies.length > 0 && { quickReplies }), // Add quick replies if any
            };
            setChatHistory((prev) => [
              ...prev,
              newUserMessage,
              newModelMessage,
            ]);

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
          setChatHistory((prev) => [
            ...prev,
            newUserMessage,
            errorModelMessage,
          ]);
        },
      });
    },
    [
      isLoading,
      isListening,
      historyRef,
      isTtsEnabled,
      cancelCurrentRequest,
      stopListening,
      cancelSpeech,
      speakText,
      setChatHistory,
    ]
  ); // Added dependencies

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    await processAndSendMessage(userInput, imagePreviewUrl); // Use the processing function
  };

  // Handler for quick reply button clicks
  const handleQuickReplyClick = useCallback(
    (reply) => {
      if (reply.action === "query") {
        // Simulate sending the reply value as a new message
        flushSync(() => {
          // Use flushSync to ensure state updates synchronously before API call if needed, though often not strictly necessary here
          processAndSendMessage(reply.value);
        });
      } else if (reply.action === "summarize") {
        // Handle summarize action specifically if needed, or trigger existing handler
        handleSummarizeChat();
      }
      // Add other actions like 'link' later if needed
      // else if (reply.action === 'link') {
      //   window.open(reply.value, '_blank'); // Example for link action
      // }
    },
    [processAndSendMessage]
  ); // processAndSendMessage is now a dependency

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

  const handleSummarizeChat = useCallback(async () => {
    // Make it useCallback
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
      const quickReplies = generateQuickReplies(result.answer); // Also add replies to summary if applicable
      addMessage({
        id: summaryMsgId,
        role: "model",
        parts: [{ text: `**Summary:**\n${result.answer}` }],
        timestamp: new Date().toISOString(),
        isSummary: true,
        ...(quickReplies.length > 0 && { quickReplies }),
      });
      // Optionally speak the summary
      if (isTtsEnabled && result.answer) {
        speakText("Summary: " + result.answer);
      }
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
  }, [
    isLoading,
    historyRef,
    addMessage,
    cancelCurrentRequest,
    stopListening,
    cancelSpeech,
    setApiError,
    setSttError,
    setTtsError,
    isTtsEnabled,
    speakText,
  ]); // Added dependencies

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
        onQuickReplyClick={handleQuickReplyClick} // Pass down the handler
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
