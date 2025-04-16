import React from "react";
import styles from "./ChatHeader.module.scss";
import IconButton from "../common/IconButton/IconButton";
import {
  FaTrash,
  FaDownload,
  FaComments,
  FaVolumeUp,
  FaVolumeMute,
  FaTimes,
} from "react-icons/fa";
import { APP_TITLE } from "../../lib/constants";
import { useHasMounted } from "../../hooks/useClientOnlyState";

const ChatHeader = ({
  onClearHistory,
  onExportChat,
  onSummarizeChat,
  isTtsEnabled,
  onToggleTts,
  synthesisSupported,
  isLoading,
  onClose,
}) => {
  const hasMounted = useHasMounted();

  return (
    <header className={styles.chatHeader}>
      <h1 className={styles.title}>{APP_TITLE}</h1>
      <div className={styles.actions}>
        <IconButton
          icon={FaComments}
          onClick={onSummarizeChat}
          title="Summarize Conversation"
          aria-label="Summarize current conversation"
          disabled={isLoading}
          className={styles.actionButtonWrapper}
          size="1em"
        />
        <IconButton
          icon={FaDownload}
          onClick={onExportChat}
          title="Export Chat"
          aria-label="Export chat history as text file"
          disabled={isLoading}
          className={styles.actionButtonWrapper}
          size="1em"
        />
        <IconButton
          icon={FaTrash}
          onClick={onClearHistory}
          title="Clear Chat History"
          aria-label="Clear chat history"
          disabled={isLoading}
          className={styles.actionButtonWrapper}
          size="1em"
        />
        {hasMounted && synthesisSupported && (
          <IconButton
            icon={isTtsEnabled ? FaVolumeUp : FaVolumeMute}
            onClick={onToggleTts}
            title={
              isTtsEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"
            }
            aria-label={
              isTtsEnabled ? "Disable speech output" : "Enable speech output"
            }
            active={isTtsEnabled}
            disabled={isLoading}
            className={`${styles.actionButtonWrapper} ${
              isTtsEnabled ? styles.ttsActive : ""
            }`}
            size="1em"
          />
        )}
        <IconButton
          icon={FaTimes}
          onClick={onClose}
          title="Close Chat"
          aria-label="Close chat panel"
          disabled={isLoading}
          className={styles.actionButtonWrapper}
          size="1.1em"
        />
      </div>
    </header>
  );
};

export default ChatHeader;
