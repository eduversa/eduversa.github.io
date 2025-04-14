import React from "react";

function ChatInputForm({
  userInput,
  setUserInput,
  handleSendMessage,
  isLoading,
  isListening,
  isSpeaking,
  isTtsEnabled,
  imageFile,
  triggerFileInput,
  handleListen,
  toggleTts,
  recognitionSupported,
  synthesisSupported,
}) {
  const canSend = !isLoading && !isListening && (userInput.trim() || imageFile);

  return (
    <form
      onSubmit={handleSendMessage}
      style={{
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #ccc",
        alignItems: "center",
        background: "#f8f9fa",
      }}
    >
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={isLoading || isListening}
        title="Attach Image"
        style={{
          padding: "8px",
          marginRight: "8px",
          background: imageFile ? "#28a745" : "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          lineHeight: "1",
          fontSize: "1.2em",
          opacity: isLoading || isListening ? 0.6 : 1,
        }}
      >
        📎
      </button>

      {recognitionSupported && (
        <button
          type="button"
          onClick={handleListen}
          disabled={isLoading}
          title={isListening ? "Stop Listening" : "Start Listening"}
          style={{
            padding: "8px",
            marginRight: "8px",
            background: isListening ? "#dc3545" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            lineHeight: "1",
            fontSize: "1.2em",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          🎤
        </button>
      )}

      {synthesisSupported && (
        <button
          type="button"
          onClick={toggleTts}
          disabled={isLoading || isSpeaking}
          title={
            isTtsEnabled ? "Disable Speech Output" : "Enable Speech Output"
          }
          style={{
            padding: "8px",
            marginRight: "8px",
            background: isTtsEnabled ? "#17a2b8" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            lineHeight: "1",
            fontSize: "1.2em",
            opacity: isLoading || isSpeaking ? 0.6 : 1,
          }}
        >
          🔊
        </button>
      )}

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder={
          isListening ? "Listening..." : "Ask a question or describe image..."
        }
        style={{
          flexGrow: 1,
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "20px",
          marginRight: "8px",
        }}
        disabled={isLoading || isListening}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && canSend) {
            handleSendMessage(e);
          }
        }}
      />

      <button
        type="submit"
        disabled={!canSend}
        style={{
          padding: "10px 15px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          opacity: !canSend ? 0.6 : 1,
        }}
      >
        {isLoading ? "..." : "Send"}
      </button>
    </form>
  );
}

export default ChatInputForm;
