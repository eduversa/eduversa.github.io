export const sendMessageToApi = async ({
  question,
  history,
  imageDataUrl,
  onStreamData,
  onStreamEnd,
  onStreamError,
  signal,
}) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        history: history,
        imageDataUrl: imageDataUrl,
        stream: true,
      }),
      signal: signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error ||
        `API Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    if (
      response.headers.get("Content-Type")?.includes("text/event-stream") &&
      response.body
    ) {
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();
      let accumulatedData = "";

      while (true) {
        if (signal?.aborted) {
          reader.cancel("Stream aborted by client");
          break;
        }
        try {
          const { value, done } = await reader.read();
          if (done) {
            if (onStreamEnd) onStreamEnd(accumulatedData);
            break;
          }
          accumulatedData += value;
          if (onStreamData) onStreamData(value);
        } catch (readError) {
          if (readError.name === "AbortError") {
            console.log("Stream reading explicitly aborted.");
          } else {
            console.error("Error reading stream:", readError);
            if (onStreamError)
              onStreamError(new Error("Error reading stream response"));
          }
          break;
        }
      }
    } else {
      const data = await response.json();
      if (onStreamData) onStreamData(data.answer);
      if (onStreamEnd) onStreamEnd(data.answer);
    }
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Fetch request aborted.");
      if (onStreamEnd) onStreamEnd("", true);
    } else {
      console.error("sendMessageToApi Error:", error);
      if (onStreamError) onStreamError(error);
    }
  }
};

export const sendActionToApi = async ({ action, history, signal }) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: action,
        history: history,
        stream: false,
      }),
      signal: signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error ||
        `API Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Fetch action request aborted.");
      throw error;
    } else {
      console.error("sendActionToApi Error:", error);
      throw error;
    }
  }
};
