import React, { useState } from "react";
import ChatPanel from "./ChatPanel";
import ChatIcon from "./ChatIcon";
import styles from "./ChatBot.module.scss";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.chatBotWrapper}>
      <ChatPanel isOpen={isOpen} onClose={toggleChat} />
      <ChatIcon onClick={toggleChat} isOpen={isOpen} />
    </div>
  );
}

export default ChatBot;
