import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
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
  });

  try {
    const { question, history, imageDataUrl } = req.body;

    if (!question && !imageDataUrl) {
      return res.status(400).json({ error: "Question or Image is required" });
    }

    const baseSystemInstruction = `
      You are EduversaBot, an AI assistant acting as a FAQ bot for the Academic ERP System called "Eduversa".
      Your core mandate is to answer questions based *only* on the following detailed text context about the Eduversa project. Do not use external knowledge or make assumptions beyond this text. Be concise.

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
      1.  Applicant Portal: Simplified enrolment for prospective students via credentials or OAuth (Google/GitHub). Includes profile creation and updates.
      2.  Verified Student Access: Secure, personalized dashboard for enrolled students.
      3.  Administrative Control: Tools for efficient faculty and student management.
      4.  Registration & Login: User self-registration, secure login, OAuth options.
      5.  User Authentication: Password recovery (OTP via email), Username recovery (OTP via email).
      6.  Personalized Emails: Sent for registration (User ID/Password), password/username recovery (OTP).
      7.  Applicant Dashboard: Applicants review submitted data and documents.
      8.  Update Profile: Feature for applicants (initially) to update forms and data.
      9.  Management Portals (Admin/Authority):
          * Routine Management: Create and view class schedules for courses/streams.
          * Room Management: Define usable rooms, purpose, seating capacity.
          * Subject Management: Add subjects (theoretical/practical/both) to curriculum.
          * Course Management: Add new courses (name, fees, duration, seats).
          * Stream Management: Add streams to courses, define seat availability.
          * Manage Applicant: Monitor, review applications, check details (qualifications, IDs, contact), approve/reject. Approved applicants get registration/enrolment IDs.
          * Manage Student: Track student records (details, academic history, course, year, IDs), edit data, remove records.
          * Manage Faculty: View faculty details (email, phone, room, course/stream), sort, search, export data (PDF, Excel, CSV, JSON, Text).
      10. About Us Page: Static page detailing tech used, problems solved, solutions, future plans.
      11. Contact Us Page: Team member information and contact details.
      12. Scanner: QR code feature to verify enrolled students' validity and access basic info (initial phase for attendance system).

      Applicant User ID Creation: Register -> Fill details -> Submit -> Check email for temp ID -> Login -> Update profile -> Wait for admin verification for permanent access.

      Tech Stack:
      * Frontend: ReactJs, NextJs, HTML, CSS, JavaScript, SCSS
      * Backend: Node.js, Express.js
      * Database: MongoDB, Mongoose

      Code Snippets Highlights:
      * Unified API Request Handler: Standardizes API calls, handles auth, file uploads, logging, error handling.
      * PulseKeeper: Pings backend API (https://eduversa-api.onrender.com) every 2 minutes to prevent idle time/cold starts.
      * Location Fetch via Pincode: Fetches address details (street, city, district, state) from pincode using api.postalpincode.in API to pre-fill forms.
      * Custom Mongoose DB Handler: Manages MongoDB connection, setup via env vars, includes DB wipe utility for dev.
      * Custom HTTP Response Handler: Class to standardize HTTP success responses.

      Website Links:
      * Official: https://eduversa.in
      * Development: https://eduversa.vercel.app

      Problem Statement Addressed:
      Aims to fix issues in existing college systems like inconsistent UI, bugs, poor schedule management, lack of communication/updates, lack of visual data representation, low interaction, and missing file management.

      Proposed Solution & Vision:
      A platform for better communication, easy navigation, efficient data management, easy access to schedules/notes, performance tracking, and a consistent, user-friendly UI.

      Future Plans:
      * Implement portals for teachers, admins, admitted students.
      * Enhance attendance system and class routine system.
      * Notification system for teacher-student communication.
      * Bug fixing.
      * UI enhancements (Manage Applicants/Faculties).
      * Bookmark feature for profiles.
      * Permissions management for admins.
      * Infinite scrolling (Manage Applicants/Students).
      * ID Card system (view/download).
      * Student-specific features (profile update, view routine/holidays, download ID).
      * Faculty-specific features (update application, access routine/holidays, scanner, download ID).
      * AI/ML integration for automation/analytics.
      * Partnerships with other ed-tech tools.
      * Admin Panel enhancements (stats, charts via Chart.js).

      Bibliography sources included standard tech documentation sites (npmjs), ERP vendors (Oracle, Microsoft, Netsuite), finance/tech info sites (Investopedia, GeeksforGeeks), and online course platforms (Coursera).

      --- Eduversa Project Context End ---
    `;

    let specificInstruction = "";
    const userQueryText = question || "";

    if (userQueryText && imageDataUrl) {
      specificInstruction = `
        INSTRUCTION: Analyze the user's query: "${userQueryText}". Use the attached image ONLY for visual context or details directly relevant to this query. Synthesize this information, BUT critically ensure that any statements made *about Eduversa features, processes, data, or policies* strictly adhere ONLY to the Eduversa Project Text Context provided above. Do NOT infer Eduversa functionality or details solely from the image if it contradicts or is not mentioned in the text context. If the image seems unrelated to the query or Eduversa context, state that clearly and focus on the text query based on the context.
        `;
    } else if (!userQueryText && imageDataUrl) {
      specificInstruction = `
        INSTRUCTION: The user has uploaded an image without a text query. Analyze the image. Describe its contents and attempt to relate it *specifically* to the Eduversa project, using *only* the features, terminology, and descriptions found in the Eduversa Project Text Context provided above. If the image clearly depicts a known part of Eduversa (based on the context), identify it. If the image cannot be reasonably related to the provided Eduversa context, state that you cannot connect the image to the Eduversa project information available. Do not describe generic elements unless they directly map to the context.
        `;
    } else {
      specificInstruction = `
        INSTRUCTION: Answer the following user query based *only* on the Eduversa Project Text Context provided above: "${userQueryText}"
        `;
    }

    const finalPromptText = `${baseSystemInstruction}\n${specificInstruction}`;

    const chat = model.startChat({
      history: history || [],
    });

    const promptParts = [{ text: finalPromptText }];

    if (
      imageDataUrl &&
      typeof imageDataUrl === "string" &&
      imageDataUrl.startsWith("data:image/")
    ) {
      try {
        const base64Data = imageDataUrl.split(",")[1];
        const mimeType = imageDataUrl.match(/data:(image\/\w+);/)?.[1];

        if (base64Data && mimeType) {
          promptParts.push({
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          });
        } else {
          console.warn("Could not parse image data URL format for prompt.");
        }
      } catch (parseError) {
        console.error(
          "Error processing image data URL for prompt:",
          parseError
        );
      }
    }

    let text = "";
    try {
      const result = await chat.sendMessage(promptParts);
      const response = await result.response;
      if (response.promptFeedback?.blockReason) {
        text = `Request blocked due to safety settings: ${response.promptFeedback.blockReason}. Please check your input or the attached image.`;
        res.status(400).json({ answer: text });
        return;
      }
      text = response.text();
    } catch (modelError) {
      console.error("Error sending message to Gemini:", modelError);
      if (
        modelError.message.includes("SAFETY") ||
        modelError.message.includes("blocked")
      ) {
        return res.status(400).json({
          error:
            "Request blocked potentially due to safety settings (input or image).",
        });
      }
      throw modelError;
    }

    return res.status(200).json({ answer: text });
  } catch (error) {
    console.error("API Handler Error:", error);
    if (error.response && error.response.promptFeedback) {
      console.error("Safety Feedback:", error.response.promptFeedback);
      return res.status(400).json({
        error:
          "Request blocked due to safety settings. Please review content or image.",
        details: JSON.stringify(error.response.promptFeedback),
      });
    }
    return res
      .status(500)
      .json({ error: "Failed to get answer from Gemini API" });
  }
}
