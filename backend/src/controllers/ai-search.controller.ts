import { Request, Response } from "express";
import fetch from "node-fetch";

export const aiQueryToFilters = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  const prompt = `
  Convert the user message into filter values for finding mentors.
  
  Only return valid JSON fields:
  {
    "search": string | null,
    "company": string | null,
    "professional": string | null,
    "experience": string | null,
    "sort": string | null
  }

  Ensure:
  - experience must be like: "1-3", "3-5", "5+", etc.
  - professional should be job title if mentioned (e.g. "frontend developer")
  - company must be single company name
  - If a value is missing or irrelevant, set it to null.

  User message: "${message}"
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // free / affordable
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    const data:any = await response.json();
    const filters = JSON.parse(data.choices[0].message.content);

    return res.json({ filters });

  } catch (err) {
    console.error("AI filter error:", err);
    return res.status(500).json({ error: "AI processing failed" });
  }
};
