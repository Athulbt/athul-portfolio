"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { JOKES } from "@/models/chat.model";
import type { GuidePose, MediaManifest } from "@/models/media.model";
import ChatPanel from "./ChatPanel";
import HoloPortrait from "./HoloPortrait";

const OPEN_CHAT = "open-chat";
export const openChat = () => window.dispatchEvent(new Event(OPEN_CHAT));

// What the guide does and says in each district of the city.
const SCRIPT: Record<string, { pose: GuidePose; line: string }> = {
  home: {
    pose: "wave",
    line: "Welcome to Stackopolis, choom. I'm your Fixer tonight.",
  },
  about: {
    pose: "talk",
    line: "Quick intro: I turn coffee into code. Mostly coffee.",
  },
  experience: {
    pose: "point",
    line: "On your right: every place I've shipped real code. No refunds.",
  },
  projects: {
    pose: "laptop",
    line: "My inventory. Click any project to see the code inside.",
  },
  skills: {
    pose: "thumbs",
    line: "My cyberware. All of it installed, none of it pirated.",
  },
  education: {
    pose: "talk",
    line: "Where I levelled up: robotics first, then full stack.",
  },
  contact: {
    pose: "wave",
    line: "Need a website? I'm one message away. Faster than a flying cab.",
  },
};

type Subtitle = { id: number; text: string; joke?: boolean };

/** Holo-call guide: a realistic portrait that follows you, talks in game-style subtitles and cracks jokes. */
export default function HoloCall({ media }: { media: MediaManifest }) {
  const [section, setSection] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPose, setChatPose] = useState<GuidePose | null>(null);
  const [subtitle, setSubtitle] = useState<Subtitle | null>(null);
  const [incoming, setIncoming] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const nextId = useRef(0);
  const jokeIdx = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const say = useCallback((text: string, joke = false, ms = 5200) => {
    const id = nextId.current++;
    setSubtitle({ id, text, joke });
    timers.current.push(
      setTimeout(() => setSubtitle((s) => (s?.id === id ? null : s)), ms),
    );
  }, []);

  const tellJoke = useCallback(() => {
    jokeIdx.current = (jokeIdx.current + 1) % JOKES.length;
    say(JOKES[jokeIdx.current], true, 6500);
  }, [say]);

  // Follow the visitor through the sections; every other stop, crack a joke.
  useEffect(() => {
    let visits = 0;
    let rang = false;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          const step = SCRIPT[id];
          if (!step) return;
          setSection(id);
          // First time the visitor leaves the hero, the guide "calls" them
          if (id !== "home" && !rang) {
            rang = true;
            setIncoming(true);
            setTimeout(() => setIncoming(false), 9000); // stop "ringing" if ignored
          }
          timers.current.forEach(clearTimeout);
          timers.current = [];
          say(step.line);
          if (++visits % 2 === 0)
            timers.current.push(setTimeout(tellJoke, 5600));
        }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    Object.keys(SCRIPT).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    const open = () => {
      setIncoming(false);
      setMinimized(false);
      setChatOpen(true);
    };
    window.addEventListener(OPEN_CHAT, open);
    const pending = timers.current;
    return () => {
      io.disconnect();
      pending.forEach(clearTimeout);
      window.removeEventListener(OPEN_CHAT, open);
    };
  }, [say, tellJoke]);

  const pose: GuidePose =
    chatOpen && chatPose
      ? chatPose
      : subtitle?.joke
        ? "laugh"
        : (SCRIPT[section]?.pose ?? "wave");

  return (
    <>
      {/* Game-style subtitles */}
      <AnimatePresence>
        {subtitle && !chatOpen && (
          <motion.div
            key={subtitle.id}
            className="pointer-events-none fixed inset-x-0 top-16 z-[64] flex justify-center px-3 sm:top-auto sm:bottom-8 sm:px-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="max-w-2xl bg-black/80 px-3 py-1.5 text-center text-base leading-snug shadow-lg backdrop-blur-sm sm:px-4 sm:py-2 sm:text-xl">
              <span className="mr-2 font-display text-sm font-bold tracking-widest text-yellow">
                ATHUL:
              </span>
              {subtitle.joke && <span className="mr-1">😂</span>}
              {subtitle.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatOpen && (
          <ChatPanel
            onClose={() => {
              setChatOpen(false);
              setChatPose(null);
            }}
            onMood={setChatPose}
          />
        )}
      </AnimatePresence>

      {/* Holo-call window: hidden on the hero, where the character sheet is the guide */}
      <AnimatePresence>
        {(section !== "home" || chatOpen) && (
          <motion.div
            className="fixed bottom-3 left-3 z-[66] sm:bottom-5 sm:left-5"
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          >
            <AnimatePresence>
              {incoming && !chatOpen && (
                <motion.div
                  className="cut-sm panel absolute bottom-full left-0 mb-2 w-60 p-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <p className="hud-label text-red">
                    <span className="blink">●</span> Incoming call
                  </p>
                  <p className="mt-1 font-semibold">
                    Athul wants to show you around.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={openChat}
                      className="btn-y !px-3 !py-2 !text-[0.65rem]"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setIncoming(false)}
                      className="btn-ghost btn-red !px-3 !py-2 !text-[0.6rem]"
                    >
                      Later
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => (chatOpen ? setChatOpen(false) : openChat())}
              aria-label={chatOpen ? "Close chat" : "Talk to Athul"}
              className="group block text-left"
            >
              <div
                className={`cut panel overflow-hidden transition-all ${minimized ? "w-16" : "w-24 sm:w-36"}`}
              >
                <div className="flex items-center justify-between bg-yellow px-2 py-0.5 text-black">
                  <span className="font-display text-[9px] font-bold tracking-widest">
                    HOLO // ATHUL
                  </span>
                  <span className="flex items-end gap-px">
                    {[3, 5, 7, 9].map((hgt) => (
                      <i
                        key={hgt}
                        className="w-0.5 bg-black"
                        style={{ height: hgt }}
                      />
                    ))}
                  </span>
                </div>
                <div
                  className={`relative ${minimized ? "h-16" : "h-24 sm:h-36"}`}
                >
                  <HoloPortrait media={media} pose={pose} sizes="160px" />
                  {incoming && !chatOpen && (
                    <motion.span
                      className="absolute inset-0 border-2 border-red"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between px-2 py-1">
                  <span className="hud-label !text-[8px] text-cyan">
                    {chatOpen ? "● Live" : "Tap to talk"}
                  </span>
                  <span className="hud-label !text-[8px] text-muted">
                    Fixer
                  </span>
                </div>
              </div>
            </button>
            <div className="mt-1 flex gap-1">
              <button
                onClick={tellJoke}
                className="hud-label bg-black/70 px-2 py-1 !text-[8px] text-yellow hover:bg-yellow hover:text-black"
              >
                Tell a joke
              </button>
              <button
                onClick={() => setMinimized((m) => !m)}
                className="hud-label bg-black/70 px-2 py-1 !text-[8px] text-muted hover:text-ink"
              >
                {minimized ? "Expand" : "Minimize"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
