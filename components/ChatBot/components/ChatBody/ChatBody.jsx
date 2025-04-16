import React, { useRef, useEffect } from "react";
import ChatMessage from "../ChatMessage/ChatMessage";
import ImagePreview from "../ImagePreview/ImagePreview";
import StatusIndicator from "../common/StatusIndicator/StatusIndicator";
import styles from "./ChatBody.module.scss";
import { useHasMounted } from "../../hooks/useClientOnlyState";

const ChatBody = ({
  chatHistory,
  isHistoryInitialized,
  isLoading,
  isSpeaking,
  isStreaming,
  loadingMessage,
  apiError,
  sttError,
  ttsError,
  imagePreviewUrl,
  removeImage,
  onFeedback,
  onQuickReplyClick, // Accept prop
}) => {
  const chatBodyRef = useRef(null);
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (chatBodyRef.current) {
      // Debounce or check if user has scrolled up? For now, always scroll down.
      const scrollTimeout = setTimeout(() => {
        if (chatBodyRef.current) {
          chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
      }, 100); // Small delay to allow rendering

      return () => clearTimeout(scrollTimeout);
    }
  }, [
    chatHistory,
    isLoading,
    isSpeaking,
    isStreaming,
    apiError,
    sttError,
    ttsError,
    imagePreviewUrl,
    loadingMessage,
    isHistoryInitialized,
    hasMounted,
  ]);

  return (
    <div ref={chatBodyRef} className={styles.chatBody} aria-live="polite">
      {isHistoryInitialized &&
        hasMounted &&
        chatHistory.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onFeedback={onFeedback}
            onQuickReplyClick={onQuickReplyClick} // Pass prop down
          />
        ))}

      {!isHistoryInitialized && hasMounted && (
        <StatusIndicator
          type="loading"
          message="Initializing chat history..."
        />
      )}

      {isLoading && (
        <StatusIndicator
          type="loading"
          message={loadingMessage || "Thinking..."}
        />
      )}
      {isSpeaking && !isLoading && (
        <StatusIndicator type="speaking" message="Speaking..." />
      )}

      <StatusIndicator type="error" message={apiError} />
      <StatusIndicator type="warning" message={sttError} />
      <StatusIndicator type="warning" message={ttsError} />

      {!isLoading && !apiError && (
        <ImagePreview
          imagePreviewUrl={imagePreviewUrl}
          removeImage={removeImage}
        />
      )}

      <div style={{ height: "1px" }} />
    </div>
  );
};

export default ChatBody;
