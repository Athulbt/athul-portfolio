"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { CHAT_LIMITS, CITY, JOKES, QUICK_REPLIES, type ChatAction, type ChatMessage, type ChatReply } from "@/models/chat.model";
import type { GuidePose } from "@/models/media.model";
import { guideReply } from "@/services/guide-bot";
import { openContact } from "./ContactModal";

type Bubble = ChatMessage & { actions?: ChatAction[]; source?: ChatReply["source"] };

const STORAGE_KEY = "athul-chat-usage";
const today = () => new Date().toISOString().slice(0, 10);

// Per-visitor daily message count, kept in the browser (best effort).
function readUsage(): number {
  try {
    const u = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return u.day === today() ? u.count : 0;
  } catch {
    return 0;
  }
}
function writeUsage(count: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ day: today(), count }));
  } catch {}
}

const isJoke = (text: string) => JOKES.some((j) => text.includes(j.slice(0, 25))) || /😂|🤣|joke/i.test(text);

export default function ChatPanel({ onClose, onMood }: { onClose: () => void; onMood: (pose: GuidePose | null) => void }) {
  const [messages, setMessages] = useState<Bubble[]>([
    {
      role: "bot",
      text: `Hey choom, welcome to ${CITY} 🌆 I'm Athul. Ask me about my gigs, my code, or if you want a website built. I also do jokes. Free of charge, unlike the flying cabs. 🚕`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [used, setUsed] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Read after mount: localStorage only exists in the browser.
    const t = setTimeout(() => setUsed(readUsage()), 0);
    inputRef.current?.focus();
    onMood("wave");
    return () => clearTimeout(t);
  }, [onMood]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const remaining = Math.max(CHAT_LIMITS.perVisitorPerDay - used, 0);

  async function send(text: string) {
    const clean = text.trim().slice(0, CHAT_LIMITS.maxInputChars);
    if (!clean || busy) return;
    const next: Bubble[] = [...messages, { role: "user", text: clean }];
    setMessages(next);
    setInput("");
    setBusy(true);
    onMood("laptop");

    let reply: ChatReply;
    if (remaining <= 0) {
      // Out of AI messages for today: the built-in guide answers instead.
      reply = guideReply(clean);
    } else {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next.map(({ role, text }) => ({ role, text })) }),
        });
        if (!res.ok) throw new Error(String(res.status));
        reply = (await res.json()) as ChatReply;
      } catch {
        reply = guideReply(clean);
      }
      if (reply.source === "ai") {
        writeUsage(used + 1);
        setUsed(used + 1);
      }
    }

    await new Promise((r) => setTimeout(r, reply.source === "ai" ? 150 : 600));
    setMessages((m) => [...m, { role: "bot", text: reply.reply, actions: reply.actions, source: reply.source }]);
    setBusy(false);
    onMood(isJoke(reply.reply) ? "laugh" : reply.actions ? "thumbs" : "talk");
  }

  return (
    <motion.div
      role="dialog"
      aria-label="Chat with Athul"
      className="cut panel fixed bottom-[13.5rem] left-3 z-[65] flex h-[min(480px,calc(100svh-260px))] w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden sm:bottom-[16.5rem] sm:left-5"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <div className="flex items-center justify-between bg-yellow px-4 py-2 text-black">
        <div>
          <p className="font-display text-xs font-bold tracking-widest">ATHUL // YOUR FIXER</p>
          <p className="text-xs font-semibold">● online in {CITY}</p>
        </div>
        <button onClick={onClose} aria-label="Close chat" className="px-2 text-lg font-bold hover:opacity-60">
          ✕
        </button>
      </div>

      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
          >
            <span className={`hud-label mb-1 !text-[9px] ${m.role === "user" ? "text-cyan" : "text-yellow"}`}>
              {m.role === "user" ? "You" : "Athul"}
            </span>
            <p
              className={`max-w-[88%] px-3.5 py-2 text-[15px] leading-snug whitespace-pre-wrap ${
                m.role === "user" ? "border border-cyan/40 bg-cyan/10" : "border-l-2 border-yellow bg-white/5"
              }`}
            >
              {m.text}
            </p>
            {m.actions?.map((a) => (
              <button key={a.contact} onClick={() => openContact(a.contact)} className="btn-y mt-2 !py-2.5 !text-[0.65rem]">
                {a.label}
              </button>
            ))}
          </motion.div>
        ))}
        {busy && (
          <div className="flex w-fit items-center gap-2 border-l-2 border-yellow bg-white/5 px-4 py-3">
            <span className="hud-label !text-[9px] text-muted">decrypting</span>
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="h-1.5 w-1.5 bg-yellow"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto px-3 pb-2 [scrollbar-width:none]">
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            disabled={busy}
            className="shrink-0 border border-yellow/40 bg-yellow/5 px-3 py-1 text-sm text-yellow transition hover:bg-yellow/15 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        className="flex items-center gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={CHAT_LIMITS.maxInputChars}
          placeholder="Ask me anything..."
          aria-label="Message"
          className="flex-1 border border-line bg-black/50 px-3 py-2 outline-none focus:border-cyan"
        />
        <button type="submit" disabled={busy || !input.trim()} className="btn-y !px-4 !py-2.5 !text-[0.65rem] disabled:opacity-40">
          Send
        </button>
      </form>
      <p className="pb-2 text-center font-mono text-[10px] text-muted">
        {remaining > 0 ? `${remaining} AI messages left today` : "AI resting · backup mode"} · resets daily
      </p>
    </motion.div>
  );
}
