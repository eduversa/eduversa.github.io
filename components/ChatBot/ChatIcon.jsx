import React from "react";
import styles from "./ChatBot.module.scss";
import { FaCommentDots, FaTimes } from "react-icons/fa";

const ChatIcon = ({ onClick, isOpen }) => {
  return (
    <button
      className={styles.chatIcon}
      onClick={onClick}
      aria-label={isOpen ? "Close Chat" : "Open Chat"}
      title={isOpen ? "Close Chat" : "Open Chat"}
    >
      {isOpen ? <FaTimes size="1.5em" /> : <FaCommentDots size="1.5em" />}
    </button>
  );
};

export default ChatIcon;
