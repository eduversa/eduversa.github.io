export const formatChatForExport = (chatHistory) => {
  return chatHistory
    .map((message) => {
      const prefix = message.role === "user" ? "User:" : "EduversaBot:";
      const text = message.parts[0]?.text || "";
      const imageInfo = message.imagePreview ? "[Image Attached]" : "";
      return `${prefix} ${text} ${imageInfo}`.trim();
    })
    .join("\n\n");
};

export const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
