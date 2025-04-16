import React, { useState } from "react";
import styles from "./ChatInputForm.module.scss";
import IconButton from "../common/IconButton/IconButton";
import {
  FaPaperclip,
  FaMicrophone,
  FaStopCircle,
  FaPaperPlane,
} from "react-icons/fa";
import { useHasMounted } from "../../hooks/useClientOnlyState";

const ChatInputForm = ({
  userInput,
  setUserInput,
  handleSendMessage,
  isLoading,
  isStreaming,
  isListening,
  imageFile,
  triggerFileInput,
  handleListen,
  recognitionSupported,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const canSend =
    !isLoading &&
    !isStreaming &&
    !isListening &&
    (userInput.trim() || imageFile);
  const isMicActive = isListening;
  const hasMounted = useHasMounted();

  const onInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && canSend) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className={`${styles.chatInputForm} ${isFocused ? styles.focused : ""}`}
    >
      <IconButton
        icon={FaPaperclip}
        onClick={triggerFileInput}
        disabled={isLoading || isListening || isStreaming}
        title="Attach Image"
        aria-label="Attach image file"
        className={styles.attachButtonWrapper}
        active={!!imageFile}
        size="1em"
      />

      {hasMounted && recognitionSupported && (
        <IconButton
          icon={isMicActive ? FaStopCircle : FaMicrophone}
          onClick={handleListen}
          disabled={isLoading || isStreaming}
          title={
            isMicActive ? "Stop Listening" : "Start Listening (Voice Input)"
          }
          aria-label={isMicActive ? "Stop voice input" : "Start voice input"}
          className={`${styles.micButtonWrapper} ${
            isMicActive ? styles.micActive : ""
          }`}
          active={isMicActive}
          size="1em"
        />
      )}

      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder={isListening ? "Listening..." : "Ask EduversaBot..."}
        className={styles.textInput}
        rows={1}
        style={{ height: "auto", overflowY: "hidden" }}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onKeyDown={onInputKeyDown}
        disabled={isLoading || isListening || isStreaming}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="Chat input field"
      />

      <IconButton
        icon={FaPaperPlane}
        onClick={handleSendMessage}
        type="submit"
        disabled={!canSend}
        title="Send message"
        aria-label="Send message"
        className={styles.sendButtonWrapper}
        active={canSend}
        size="1em"
      />
    </form>
  );
};

export default ChatInputForm;
