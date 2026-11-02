import "server-only";

// Thin client for Google's Gemini API (free tier: https://aistudio.google.com/apikey).
// Server-only: the API key never reaches the browser.

interface GeminiTurn {
  role: "user" | "model";
  parts: { text: string }[];
}

export class GeminiUnavailableError extends Error {}

export function geminiConfigured() {
  return !!process.env.GEMINI_API_KEY;
}

export async function generateReply(systemPrompt: string, turns: GeminiTurn[], maxOutputTokens: number): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new GeminiUnavailableError("GEMINI_API_KEY is not set");
  const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: turns,
      generationConfig: { maxOutputTokens, temperature: 0.9 },
    }),
    signal: AbortSignal.timeout(15_000),
  });

  // 429 = free quota used up; anything else non-OK is treated the same way.
  if (!res.ok) throw new GeminiUnavailableError(`Gemini responded ${res.status}`);

  const data = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
  if (!text) throw new GeminiUnavailableError("Empty response");
  return text;
}
