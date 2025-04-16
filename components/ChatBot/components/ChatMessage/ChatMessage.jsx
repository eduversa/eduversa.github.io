/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./ChatMessage.module.scss";
import IconButton from "../common/IconButton/IconButton";
import {
  FaUser,
  FaRobot,
  FaThumbsUp,
  FaThumbsDown,
  FaCopy,
} from "react-icons/fa";

const ChatMessage = ({ message, onFeedback }) => {
  const isUser = message.role === "user";
  const [feedbackSent, setFeedbackSent] = useState(message.feedback || null);

  const handleCopy = () => {
    if (message.parts[0]?.text) {
      navigator.clipboard
        .writeText(message.parts[0].text)
        .then(() => console.log("Copied to clipboard"))
        .catch((err) => console.error("Failed to copy text: ", err));
    }
  };

  const handleFeedback = (feedbackType) => {
    if (feedbackSent === feedbackType) {
      setFeedbackSent(null);
      onFeedback(message.id, null);
    } else {
      setFeedbackSent(feedbackType);
      onFeedback(message.id, feedbackType);
    }
  };

  const Icon = isUser ? FaUser : FaRobot;
  const hasText =
    message.parts[0]?.text && message.parts[0].text !== "(Image attached)";

  return (
    <div
      className={`${styles.messageRow} ${
        isUser ? styles.userRow : styles.modelRow
      }`}
    >
      <div className={styles.avatar}>
        <Icon aria-hidden="true" />
      </div>
      <div
        className={`${styles.messageBubble} ${
          isUser ? styles.userBubble : styles.modelBubble
        }`}
      >
        {message.imagePreview && (
          <img
            src={message.imagePreview}
            alt="User attachment"
            className={styles.messageImage}
            style={{ marginBottom: hasText ? "12px" : 0 }}
          />
        )}
        {hasText && (
          <div className={styles.messageContent}>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
                p: React.Fragment,
              }}
            >
              {message.parts[0].text}
            </ReactMarkdown>
          </div>
        )}
        {!isUser && hasText && (
          <div className={styles.messageActions}>
            <IconButton
              icon={FaCopy}
              onClick={handleCopy}
              title="Copy message"
              aria-label="Copy message text"
              size="0.9em"
              className={styles.actionButtonWrapper}
            />
            <IconButton
              icon={FaThumbsUp}
              onClick={() => handleFeedback("positive")}
              title="Good response"
              aria-label="Mark response as good"
              size="0.9em"
              active={feedbackSent === "positive"}
              className={`${styles.actionButtonWrapper} ${
                feedbackSent === "positive" ? styles.positiveFeedback : ""
              }`}
            />
            <IconButton
              icon={FaThumbsDown}
              onClick={() => handleFeedback("negative")}
              title="Bad response"
              aria-label="Mark response as bad"
              size="0.9em"
              active={feedbackSent === "negative"}
              className={`${styles.actionButtonWrapper} ${
                feedbackSent === "negative" ? styles.negativeFeedback : ""
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
