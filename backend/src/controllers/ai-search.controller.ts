import { Request, Response } from "express";
import fetch from "node-fetch";

export const aiQueryToFilters = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "message is required" });
    return;
  }

  const prompt = `
You are a query parser for a mentoring app.

Extract filters ONLY in JSON format:

{
  "search": string | null,
  "company": string | null,
  "professional": string | null,
  "experience": string | null,
  "sort": string | null
}

Rules:
- "experience" should be like "1-3", "3-5", "5+" etc.
- If something is not present in user's message, return null.
- No additional text outside JSON.

User message: "${message}"
`;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const jsonResponse: any = await response.json();

    const aiText =
      jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    // Ensure valid JSON only
    const filters = JSON.parse(aiText);

    res.json({ filters });
  } catch (err) {
    console.error("AI processing error:", err);
    res.status(500).json({ error: "AI failed to extract filters" });
  }
};
