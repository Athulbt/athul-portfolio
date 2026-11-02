import { handleChat } from "@/controllers/chat.controller";
import type { ChatMessage } from "@/models/chat.model";

// POST /api/chat  { messages: [{ role: "user" | "bot", text }] }
export async function POST(request: Request) {
  let messages: ChatMessage[];
  try {
    const body = await request.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const reply = await handleChat(messages, ip);
  return Response.json(reply);
}
