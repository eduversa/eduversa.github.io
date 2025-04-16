import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { SPECIAL_ACTIONS } from "../../components/ChatBot/lib/constants";
import systemInstructionData from "../../data/systemInstruction.json"; // Using your specified import path

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const modelConfig = {
  model: "gemini-1.5-flash-latest",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
};

const baseSystemInstruction = systemInstructionData.systemInstruction;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  console.log(
    "API Request Body:",
    req.body
      ? {
          ...req.body,
          imageDataUrl: req.body.imageDataUrl ? "Present" : "Not Present",
        }
      : "Empty"
  );

  try {
    const {
      question,
      history,
      imageDataUrl,
      stream = false,
      action,
    } = req.body;

    if (action) {
      if (action === SPECIAL_ACTIONS.SUMMARIZE) {
        if (!history || history.length === 0) {
          return res
            .status(400)
            .json({ error: "Cannot summarize empty history." });
        }
        console.log("Executing Summarize Action");
        // The summary prompt might still benefit from the overall context,
        // including the strict boundaries defined in baseSystemInstruction.
        const summaryPrompt = `Summarize the following chat history concisely, focusing only on topics related to the Eduversa project if mentioned:\n\n${JSON.stringify(
          history,
          null,
          2
        )}`;
        const model = genAI.getGenerativeModel(modelConfig);
        // Prepend base instruction to ensure summary also respects context boundaries if needed
        const result = await model.generateContent(
          `${baseSystemInstruction}\n${summaryPrompt}`
        );
        const response = result.response;

        if (response.promptFeedback?.blockReason) {
          const blockReason = response.promptFeedback.blockReason;
          console.warn("Summarization blocked:", blockReason);
          return res.status(400).json({
            error: `Sorry, I couldn't generate the summary due to safety constraints (${blockReason}).`,
          });
        }

        const text = response.text();
        console.log("Summarization successful.");
        return res.status(200).json({ answer: text });
      } else {
        console.warn(`Unknown action received: ${action}`);
        return res.status(400).json({ error: `Unknown action: ${action}` });
      }
    } else if (!question && !imageDataUrl) {
      console.warn("Missing question and image data.");
      return res
        .status(400)
        .json({ error: "Please provide a question or an image." });
    }

    console.log("Processing Q&A Request");
    let specificInstruction = "";
    const userQueryText = question || "";

    // These specific instructions remain relevant for guiding the analysis *within* scope
    if (userQueryText && imageDataUrl) {
      specificInstruction = `INSTRUCTION: Analyze the user's query: "${userQueryText}". Use the attached image ONLY for visual context or details *directly relevant* to this query and the Eduversa project context. Synthesize this information, ensuring statements about Eduversa features, processes, data, or policies strictly adhere ONLY to the Eduversa Project Text Context provided above. Do NOT infer Eduversa functionality solely from the image if it contradicts or isn't mentioned in the text context. If the image is irrelevant, state that and focus on the text query based on the context.`;
    } else if (!userQueryText && imageDataUrl) {
      specificInstruction = `INSTRUCTION: User uploaded an image without text. Analyze the image. Describe its contents briefly and relate it *specifically* to the Eduversa project using *only* terminology and features found in the Eduversa Project Text Context provided above. If it clearly depicts a known part of Eduversa (based on context), identify it. If it cannot be reasonably related, state that clearly. Do not describe generic elements unless mapped to the context (e.g., if it looks like a dashboard, relate it to the 'Applicant Dashboard' or 'Verified Student Access' described).`;
    } else {
      specificInstruction = `INSTRUCTION: Answer the following user query based *only* on the Eduversa Project Text Context provided above: "${userQueryText}"`;
    }

    // Combine the strict base instructions with the specific task instruction
    const finalPromptText = `${baseSystemInstruction}\n${specificInstruction}`;
    const promptParts = [{ text: finalPromptText }];

    if (
      imageDataUrl &&
      typeof imageDataUrl === "string" &&
      imageDataUrl.startsWith("data:image/")
    ) {
      try {
        console.log("Processing image data URL...");
        const base64Data = imageDataUrl.split(",")[1];
        const mimeTypeMatch = imageDataUrl.match(/data:(image\/\w+);/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : null;

        if (base64Data && mimeType) {
          promptParts.push({
            inlineData: { mimeType: mimeType, data: base64Data },
          });
          console.log("Image data added to prompt parts.");
        } else {
          console.warn(
            "Could not parse image data URL format. Proceeding without image."
          );
        }
      } catch (parseError) {
        console.error("Error processing image data URL:", parseError);
        return res
          .status(500)
          .json({ error: "Server error processing image data." });
      }
    }

    console.log("Initializing model and chat history...");
    const model = genAI.getGenerativeModel(modelConfig);
    const chat = model.startChat({
      history: history || [],
    });

    if (stream && typeof res.flush === "function") {
      console.log("Starting response stream...");
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      try {
        const result = await chat.sendMessageStream(promptParts);
        let blocked = false;

        for await (const chunk of result.stream) {
          if (chunk.promptFeedback?.blockReason) {
            const blockReason = chunk.promptFeedback.blockReason;
            console.warn("Stream blocked mid-way:", blockReason);
            if (!blocked) {
              res.write(
                `\n[My apologies, I couldn't complete the response due to safety guidelines (${blockReason}). Please try rephrasing.]`
              );
              if (typeof res.flush === "function") res.flush();
              blocked = true;
            }
            continue;
          }

          if (!blocked) {
            const chunkText = chunk.text();
            if (chunkText) {
              res.write(`${chunkText}`);
              if (typeof res.flush === "function") {
                res.flush();
              }
            }
          }
        }

        if (!blocked) {
          const finalResponse = await result.response;
          if (finalResponse.promptFeedback?.blockReason) {
            const blockReason = finalResponse.promptFeedback.blockReason;
            console.warn("Final response blocked:", blockReason);
            res.write(
              `\n[My apologies, the final response was blocked due to safety guidelines (${blockReason}). Please try rephrasing.]`
            );
          }
        }

        console.log("Stream finished.");
        res.end();
      } catch (error) {
        console.error("Error during streaming generation:", error);
        if (!res.writableEnded) {
          const errorMessage =
            error.message || "Failed to generate streaming response";
          res.write(`\n[An error occurred: ${errorMessage}]`);
          res.end();
        }
      }
    } else {
      console.log("Generating non-streaming response...");
      const result = await chat.sendMessage(promptParts);
      const response = result.response;

      if (response.promptFeedback?.blockReason) {
        const blockReason = response.promptFeedback.blockReason;
        console.warn("Request blocked:", blockReason);
        return res.status(400).json({
          error: `I'm sorry, but I cannot provide a response due to safety guidelines (${blockReason}). Could you please rephrase your request?`,
        });
      }

      const text = response.text();
      // With the strictest instructions, the 'text' variable should now contain
      // refusals that align with the examples, avoiding mention of the source document.
      console.log("Non-streaming response successful.");
      return res.status(200).json({ answer: text });
    }
  } catch (error) {
    console.error("API Handler Global Error:", error);
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Error Stack:", error.stack);

    if (error.message?.includes("API key not valid")) {
      return res
        .status(500)
        .json({ error: "Server configuration error: Invalid API Key." });
    }
    return res
      .status(500)
      .json({
        error: `An internal server error occurred. Please check server logs.`,
      });
  }
}
