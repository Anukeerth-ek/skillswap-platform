import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
     throw new Error("❌ GEMINI_API_KEY missing in env variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
     model: "gemini-2.5-flash",
     // This tells the AI to ONLY output valid JSON
     generationConfig: {
          responseMimeType: "application/json",
     },
});

export const aiQueryToFilters = async (req: Request, res: Response) => {
     const { message } = req.body;
     console.log("backend message:", message);

     if (!message) {
          res.status(400).json({ error: "message is required" });
          return;
     }

     const prompt = `
Extract structured search filters from the user message.

IMPORTANT RULES:
- Experience must be mapped to predefined ranges ONLY:
  - 0-1 years → "0-1"
  - 1-3 years → "1-3"
  - 4-8 years → "4-8"
  - 8+ years → "8+"
- If user says "2+ years", use "1-3"
- If user says "5+ years", use "4-8"
- If no experience mentioned, return null

Return ONLY valid JSON in this format:
{
 
  "company": string | null,
  "professional": string[] | null,
  "experience": string | null,
  "sort": string | null
}

User Query: "${message}"
`;

     try {
          const result = await model.generateContent([{ text: prompt }]);
          const text = result.response.text();

          console.log("RAW AI:", text);

          const jsonMatch = text.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? jsonMatch[0] : "{}";

          let filters = {};
          try {
               filters = JSON.parse(jsonString);
          } catch {
               console.error("JSON parsing failed");
          }

          console.log("Extracted:", filters);
          res.json({ filters });
          return;
     } catch (error: any) {
          console.error("🔥 AI ERROR:", error?.response?.data || error);
          res.status(500).json({ error: "AI failed", detail: error.message });
          return;
     }
};
