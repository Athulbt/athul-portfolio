import type { ContactKind } from "./contact.model";

// Chatbot content: persona, jokes, quick replies and limits.

export interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

export interface ChatAction {
  label: string;
  contact: ContactKind;
}

export interface ChatReply {
  reply: string;
  source: "ai" | "guide";
  actions?: ChatAction[];
  remaining?: number;
}

export const CITY = "Stackopolis 2077";

export const CHAT_LIMITS = {
  perVisitorPerDay: 20,   // like a free plan: a few messages a day per visitor
  globalPerDay: 800,      // keeps the whole site inside Gemini's free quota
  maxInputChars: 400,
  maxHistory: 8,
  maxOutputTokens: 600,
};

export const QUICK_REPLIES = [
  "Who are you? 🤔",
  "Show me your projects",
  "Tell me a joke 😂",
  "Can you build my website? 🌐",
  "What's your tech stack?",
];

export const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
  "I'd tell you a joke about UDP, but you might not get it. 📦",
  "A SQL query walks into a bar, sees two tables and asks: “Can I JOIN you?” 🍻",
  "There are 10 types of people: those who understand binary and those who don't. 🤓",
  "I'd tell you a CSS joke, but it might not be centered. 😅",
  "Debugging is like being the detective in a crime movie where you're also the murderer. 🕵️",
  "The flying cars here run on JavaScript. That's why they sometimes crash on `undefined`. 🚗💥",
  "My code doesn't have bugs. It has surprise features. ✨",
  "Why did the developer go broke? He used up all his cache. 💸",
  "I tried to write a Docker joke, but it only works on my machine. 🐳",
];

// Buttons the chat can attach to a reply; they open the contact options popup.
export const CONTACT_ACTIONS = {
  website: { label: "📩 Email me about a website", contact: "website" },
  hello: { label: "👋 Say hello", contact: "hello" },
} satisfies Record<string, ChatAction>;
