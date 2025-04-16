import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { SPECIAL_ACTIONS } from "../../components/ChatBot/lib/constants";

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

const baseSystemInstruction = `
You are EduversaBot, an AI assistant acting as a FAQ bot for the Academic ERP System called "Eduversa".
Your core mandate is to answer questions based *only* on the following detailed text context about the Eduversa project. Do not use external knowledge or make assumptions beyond this text. Use Markdown for formatting lists, code snippets, or emphasis where appropriate. Be concise unless asked for details.

--- Eduversa Project Context Start ---

Project Title: Academic ERP System (Eduversa)
Developed for: Partial fulfilment of the Bachelor of Technology (B.Tech) in Computer Science and Technology degree.
University: University of Engineering & Management, Kolkata (UEM Kolkata), Action Area – III, Kolkata – 700160.
Submitted by: Debargha Mondal (12021002022056), Ankur Halder (12021002022073), Vidit Modi (12021002022018), Tanay Ghoriwala (12021002022067).
Academic Session: 2021 - 2025 (8th Semester Project).
Guidance: Prof. Dr. Maumita Chakraborty, Department of Computer Science and Technology & Computer Science and Information Technology, UEM Kolkata.
Project Status: Bonafide work, original, performance satisfactory as per certificate.

Abstract & Introduction:
Eduversa is a college ERP system designed to manage functionalities and data for colleges, aiming for an easier workflow for students and faculty (e.g., checking routines, online attendance). It merges standard ERP capabilities with specialized academic features. Key benefits include upgraded accuracy, better efficiency, and a centralized platform.

Key Features Implemented:
1.  Applicant Portal: Simplified enrolment for prospective students via credentials or OAuth (Google/GitHub). Includes profile creation and updates. Applicants submit documents here.
2.  Verified Student Access: Secure, personalized dashboard for enrolled students. Likely place to view routines, notes, etc. (Future plan).
3.  Administrative Control: Tools for efficient faculty and student management.
4.  Registration & Login: User self-registration, secure login, OAuth options.
5.  User Authentication: Password recovery (OTP via email), Username recovery (OTP via email). If login fails, suggest using these recovery options.
6.  Personalized Emails: Sent for registration (User ID/Password), password/username recovery (OTP).
7.  Applicant Dashboard: Applicants review submitted data and documents.
8.  Update Profile: Feature for applicants (initially) to update forms and data.
9.  Management Portals (Admin/Authority):
    * Routine Management: Create and view class schedules for courses/streams. Students/Faculty would view routines elsewhere (likely their dashboard).
    * Room Management: Define usable rooms, purpose, seating capacity.
    * Subject Management: Add subjects (theoretical/practical/both) to curriculum. Example: Name='Advanced Data Structures', Type='Theoretical', Course='B.Tech CSE'.
    * Course Management: Add new courses (name, fees, duration, seats).
    * Stream Management: Add streams to courses, define seat availability.
    * Manage Applicant: Monitor, review applications, check details (qualifications, IDs, contact, submitted documents), approve/reject. Approved applicants get registration/enrolment IDs. Explain process if asked.
    * Manage Student: Track student records (details, academic history, course, year, IDs), edit data, remove records.
    * Manage Faculty: View faculty details (email, phone, room, course/stream), sort, search, export data (PDF, Excel, CSV, JSON, Text).
10. About Us Page: Static page detailing tech used, problems solved, solutions, future plans.
11. Contact Us Page: Team member information and contact details.
12. Scanner: QR code feature to verify enrolled students' validity and access basic info (initial phase for attendance system). If shown a QR code image, explain this function, don't try to decode.

Applicant User ID Creation Flow: 1. Register on Applicant Portal -> 2. Fill details & submit documents -> 3. Submit application -> 4. Check email for temporary ID -> 5. Login with temp ID -> 6. Update profile if needed -> 7. Wait for admin verification via 'Manage Applicant' for permanent access/enrolment ID.

Tech Stack:
* Frontend: ReactJs, NextJs, HTML, CSS, JavaScript, SCSS
* Backend: Node.js, Express.js
* Database: MongoDB (NoSQL, flexible schema), Mongoose (ODM for MongoDB in Node.js)

Code Snippets Highlights:
* Unified API Request Handler: Standardizes backend API calls.
* PulseKeeper: Pings backend API (https://eduversa-api.onrender.com) every 2 minutes to prevent idle time/cold starts on free hosting tiers.
* Location Fetch via Pincode: Uses api.postalpincode.in API during address input (likely applicant/student forms) to pre-fill address details.
* Custom Mongoose DB Handler: Manages MongoDB connection.
* Custom HTTP Response Handler: Standardizes HTTP success responses.

Website Links:
* Official: https://eduversa.in
* Development: https://eduversa.vercel.app

Problem Statement Addressed: Aims to fix inconsistency, bugs, poor schedule management, lack of communication, poor data visualization, low interaction, missing file management in existing systems.

Proposed Solution & Vision: Better communication, navigation, data management, access to schedules/notes, performance tracking, user-friendly UI.

Future Plans: Portals for teachers, admins, students; Enhanced attendance/routine systems; Notifications; Bug fixes; UI enhancements; Bookmarks; Permissions; Infinite scrolling; ID Card system; Specific Student/Faculty features; AI/ML integration; Partnerships; Admin Panel stats/charts.

Bibliography sources: Standard tech docs, ERP vendor sites, finance/tech info sites, online course platforms.

--- Eduversa Project Context End ---
`;

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
        const summaryPrompt = `Based *only* on the provided Eduversa project context (if relevant to the conversation), summarize the following chat history concisely:\n\n${JSON.stringify(
          history,
          null,
          2
        )}`;
        const model = genAI.getGenerativeModel(modelConfig);
        const result = await model.generateContent(summaryPrompt);
        const response = result.response;

        if (response.promptFeedback?.blockReason) {
          const blockReason = response.promptFeedback.blockReason;
          console.warn("Summarization blocked:", blockReason);
          return res
            .status(400)
            .json({
              error: `Summarization blocked due to safety settings: ${blockReason}`,
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
        .json({ error: "Question or Image is required for Q&A." });
    }

    console.log("Processing Q&A Request");
    let specificInstruction = "";
    const userQueryText = question || "";

    if (userQueryText && imageDataUrl) {
      specificInstruction = `INSTRUCTION: Analyze the user's query: "${userQueryText}". Use the attached image ONLY for visual context or details *directly relevant* to this query and the Eduversa project context. Synthesize this information, ensuring statements about Eduversa features, processes, data, or policies strictly adhere ONLY to the Eduversa Project Text Context provided above. Do NOT infer Eduversa functionality solely from the image if it contradicts or isn't mentioned in the text context. If the image is irrelevant, state that and focus on the text query based on the context.`;
    } else if (!userQueryText && imageDataUrl) {
      specificInstruction = `INSTRUCTION: User uploaded an image without text. Analyze the image. Describe its contents briefly and relate it *specifically* to the Eduversa project using *only* terminology and features found in the Eduversa Project Text Context provided above. If it clearly depicts a known part of Eduversa (based on context), identify it. If it cannot be reasonably related, state that clearly. Do not describe generic elements unless mapped to the context (e.g., if it looks like a dashboard, relate it to the 'Applicant Dashboard' or 'Verified Student Access' described).`;
    } else {
      specificInstruction = `INSTRUCTION: Answer the following user query based *only* on the Eduversa Project Text Context provided above: "${userQueryText}"`;
    }

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

        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            res.write(`${chunkText}`);
            if (typeof res.flush === "function") {
              res.flush();
            }
          }

          if (chunk.promptFeedback?.blockReason) {
            const blockReason = chunk.promptFeedback.blockReason;
            console.warn("Stream blocked mid-way:", blockReason);
            res.write(`\n[STREAM BLOCKED: ${blockReason}]`);
            if (typeof res.flush === "function") res.flush();
          }
        }

        const finalResponse = await result.response;
        if (finalResponse.promptFeedback?.blockReason) {
          const blockReason = finalResponse.promptFeedback.blockReason;
          console.warn("Final response blocked:", blockReason);
          res.write(`\n[RESPONSE BLOCKED: ${blockReason}]`);
        }

        console.log("Stream finished.");
        res.end();
      } catch (error) {
        console.error("Error during streaming generation:", error);
        if (!res.writableEnded) {
          const errorMessage =
            error.message || "Failed to generate streaming response";
          res.write(`\n[ERROR: ${errorMessage}]`);
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
        return res
          .status(400)
          .json({
            error: `Request blocked due to safety settings: ${blockReason}. Please rephrase or remove potentially harmful content/image.`,
          });
      }

      const text = response.text();
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
    if (error.response && error.response.promptFeedback) {
      const blockReason = error.response.promptFeedback.blockReason;
      console.error(
        "Safety Feedback Error on non-stream generateContent:",
        error.response.promptFeedback
      );
      return res.status(400).json({
        error: `Request blocked due to safety settings: ${blockReason}.`,
        details: JSON.stringify(error.response.promptFeedback),
      });
    }

    return res
      .status(500)
      .json({ error: `Internal Server Error. Please check server logs.` });
  }
}
