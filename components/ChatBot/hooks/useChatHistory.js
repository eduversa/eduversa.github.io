import { useCallback, useRef, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../lib/constants";

function useChatHistory(initialHistory = []) {
  const [chatHistory, setChatHistoryInternal, isHistoryInitialized] =
    useLocalStorage(LOCAL_STORAGE_KEYS.CHAT_HISTORY, initialHistory);

  const historyRef = useRef(chatHistory);

  useEffect(() => {
    historyRef.current = chatHistory;
  }, [chatHistory]);

  const setChatHistory = useCallback(
    (valueOrFn) => {
      setChatHistoryInternal((prev) => {
        const newState =
          typeof valueOrFn === "function" ? valueOrFn(prev) : valueOrFn;
        return newState;
      });
    },
    [setChatHistoryInternal]
  );

  const addMessage = useCallback(
    (message) => {
      setChatHistory((prev) => {
        const newState = [...prev, message];
        return newState;
      });
    },
    [setChatHistory]
  );

  const updateLastMessage = useCallback(
    (updateFn) => {
      setChatHistory((prev) => {
        if (prev.length === 0) {
          return prev;
        }
        const newHistory = [...prev];
        const lastMessageIndex = newHistory.length - 1;
        const lastMessage = newHistory[lastMessageIndex];
        const updatedMessage = updateFn(lastMessage);
        newHistory[lastMessageIndex] = updatedMessage;
        return newHistory;
      });
    },
    [setChatHistory]
  );

  const clearHistory = useCallback(() => {
    setChatHistory([]);
  }, [setChatHistory]);

  const updateMessageFeedback = useCallback(
    (messageId, feedback) => {
      setChatHistory((prev) => {
        const newState = prev.map((msg) =>
          msg.id === messageId ? { ...msg, feedback } : msg
        );
        return newState;
      });
    },
    [setChatHistory]
  );

  return {
    chatHistory,
    historyRef,
    addMessage,
    updateLastMessage,
    clearHistory,
    updateMessageFeedback,
    setChatHistory,
    isHistoryInitialized,
  };
}

export default useChatHistory;
