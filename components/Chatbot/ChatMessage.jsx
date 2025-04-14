import React from "react";

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        marginBottom: "10px",
        textAlign: isUser ? "right" : "left",
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <span
        style={{
          background: isUser ? "#007bff" : "#e9ecef",
          color: isUser ? "white" : "black",
          padding: "8px 12px",
          borderRadius: "15px",
          display: "inline-block",
          maxWidth: "80%",
          wordWrap: "break-word",
          textAlign: "left",
        }}
      >
        {message.imagePreview && (
          <img
            src={message.imagePreview}
            alt="Attached"
            style={{
              maxWidth: "100%",
              height: "auto",
              display: "block",
              marginBottom:
                message.parts[0].text &&
                message.parts[0].text !== "(Image attached)"
                  ? "5px"
                  : "0",
              borderRadius: "8px",
            }}
          />
        )}
        {message.parts[0].text !== "(Image attached)" && message.parts[0].text}
      </span>
    </div>
  );
}

export default ChatMessage;
