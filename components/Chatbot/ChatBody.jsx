import React from "react";
import ChatMessage from "./ChatMessage";
import ImagePreview from "./ImagePreview";

function ChatBody({
  chatHistory,
  isLoading,
  isSpeaking,
  error,
  sttError,
  ttsError,
  imagePreviewUrl,
  removeImage,
  chatBodyRef,
}) {
  return (
    <div
      ref={chatBodyRef}
      style={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "10px 10px 20px 10px",
        marginTop: "40px",
      }}
    >
      {chatHistory.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}

      {isLoading && (
        <div style={{ textAlign: "center", color: "#888", padding: "10px" }}>
          Thinking...
        </div>
      )}

      {isSpeaking && (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            padding: "5px",
            fontSize: "0.8em",
          }}
        >
          Speaking...
        </div>
      )}

      {error && !isLoading && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            padding: "5px 10px",
            fontSize: "0.9em",
          }}
        >
          {error}
        </div>
      )}

      {sttError && (
        <div
          style={{
            color: "orange",
            textAlign: "center",
            padding: "5px 10px",
            fontSize: "0.9em",
          }}
        >
          {sttError}
        </div>
      )}

      {ttsError && (
        <div
          style={{
            color: "orange",
            textAlign: "center",
            padding: "5px 10px",
            fontSize: "0.9em",
          }}
        >
          {ttsError}
        </div>
      )}

      {!isLoading && !error && (
        <ImagePreview
          imagePreviewUrl={imagePreviewUrl}
          removeImage={removeImage}
        />
      )}
    </div>
  );
}

export default ChatBody;
