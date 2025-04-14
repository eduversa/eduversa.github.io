import React from "react";

function ImagePreview({ imagePreviewUrl, removeImage }) {
  if (!imagePreviewUrl) {
    return null;
  }

  return (
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
      <div style={{ fontSize: "0.8em", color: "green", marginTop: "5px" }}>
        Image ready to send
      </div>
    </div>
  );
}

export default ImagePreview;
