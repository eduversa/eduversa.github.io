import React, { useState } from "react";
import Chatbot from "./Chatbot";

function ChatInterface() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const iconStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    zIndex: 1000,
    transition: "transform 0.2s ease-in-out",
  };

  const iconHoverStyle = {
    transform: "scale(1.1)",
  };

  const modalStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "clamp(320px, 85vw, 400px)",
    height: "clamp(400px, 70vh, 600px)",
    backgroundColor: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    borderRadius: "15px",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transform: isChatOpen ? "scale(1)" : "scale(0)",
    transformOrigin: "bottom right",
    opacity: isChatOpen ? 1 : 0,
    transition:
      "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out",
    visibility: isChatOpen ? "visible" : "hidden",
  };

  const closeButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#eee",
    color: "#333",
    border: "none",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    fontSize: "16px",
    lineHeight: "30px",
    textAlign: "center",
    cursor: "pointer",
    zIndex: 1001,
  };

  return (
    <>
      {!isChatOpen && (
        <div
          style={iconStyle}
          onClick={toggleChat}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = iconHoverStyle.transform)
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          title="Open Chat"
        >
          💬
        </div>
      )}

      <div style={modalStyle}>
        <button
          style={closeButtonStyle}
          onClick={toggleChat}
          title="Close Chat"
        >
          ×
        </button>
        {isChatOpen && <Chatbot />}
      </div>
    </>
  );
}

export default ChatInterface;
