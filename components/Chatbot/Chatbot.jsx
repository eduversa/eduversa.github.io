import React, { useState, useRef } from "react";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const chatBodyRef = useRef(null); // Ref for scrolling

  // Scroll to bottom effect
  React.useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading, error, imagePreviewUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setError("Image selected. Ready to send.");
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
    if ((!userInput.trim() && !imageFile) || isLoading) return;

    const userMessageText = userInput;
    const attachedImageDataUrl = imagePreviewUrl;

    const newUserMessage = {
      role: "user",
      parts: [{ text: userMessageText || "(Image attached)" }],
      ...(attachedImageDataUrl && { imagePreview: attachedImageDataUrl }),
    };
    // Use functional update to get latest history for API call
    let historyForApi = [];
    setChatHistory((prev) => {
      historyForApi = prev; // Capture history *before* adding new user message
      return [...prev, newUserMessage];
    });

    setUserInput("");
    setImageFile(null);
    setImagePreviewUrl(null);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessageText,
          history: historyForApi, // Send history *before* new user message
          imageDataUrl: attachedImageDataUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch");
      }

      const data = await response.json();
      const modelMessage = { role: "model", parts: [{ text: data.answer }] };
      setChatHistory((prev) => [...prev, modelMessage]); // Add model response
    } catch (err) {
      setError(err.message);
      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: `Error: ${err.message}` }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // Fill the modal container
        backgroundColor: "#fff",
      }}
    >
      {/* Removed fixed sizing, relies on modalStyle now */}
      <div
        ref={chatBodyRef}
        style={{
          flexGrow: 1,
          overflowY: "auto",
          padding: "10px 10px 20px 10px",
          marginTop: "40px",
        }} // Added margin top for close button
      >
        {chatHistory.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: message.role === "user" ? "right" : "left",
              display: "flex", // Use flex for alignment
              justifyContent:
                message.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <span
              style={{
                background: message.role === "user" ? "#007bff" : "#e9ecef", // Adjusted colors
                color: message.role === "user" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: "15px", // More rounded
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
                /> // Rounded image corners
              )}
              {message.parts[0].text !== "(Image attached)" &&
                message.parts[0].text}
            </span>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: "center", color: "#888", padding: "10px" }}>
            Thinking...
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
        {imagePreviewUrl &&
          !isLoading &&
          !error && ( // Show preview only if no error after selection
            <div
              style={{
                textAlign: "center",
                padding: "10px",
                position: "relative",
                background: "#f8f9fa",
                margin: "10px 0",
                borderRadius: "8px",
              }}
            >
              <img
                src={imagePreviewUrl}
                alt="Selected Preview"
                style={{
                  maxWidth: "50%",
                  maxHeight: "100px",
                  height: "auto",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              <button
                onClick={removeImage}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  lineHeight: "20px",
                  fontSize: "12px",
                  padding: 0,
                }}
              >
                X
              </button>
              <div
                style={{ fontSize: "0.8em", color: "green", marginTop: "5px" }}
              >
                Image ready to send
              </div>
            </div>
          )}
      </div>

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
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
          accept="image/*"
        />
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isLoading}
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
          }}
        >
          📎
        </button>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question or describe image..."
          style={{
            flexGrow: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "20px", // Pill shape
            marginRight: "8px",
          }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || (!userInput.trim() && !imageFile)}
          style={{
            padding: "10px 15px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "20px", // Pill shape
            cursor: "pointer",
            opacity: isLoading || (!userInput.trim() && !imageFile) ? 0.6 : 1,
          }}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
