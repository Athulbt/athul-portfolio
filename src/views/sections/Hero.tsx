"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { MediaManifest } from "@/models/media.model";
import type { Profile, Tech } from "@/models/types";
import { openContact } from "../components/ContactModal";
import { openChat } from "../components/HoloCall";
import HoloPortrait from "../components/HoloPortrait";
import { openTerminal } from "../components/Terminal";
import { TechLogo } from "../components/ui";

function useTypewriter(words: string[]) {
  const [text, setText] = useState("");
  useEffect(() => {
    let w = 0, i = 0, deleting = false, timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[w];
      i += deleting ? -1 : 1;
      setText(word.slice(0, i));
      if (!deleting && i === word.length) { deleting = true; timer = setTimeout(tick, 1600); return; }
      if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; }
      timer = setTimeout(tick, deleting ? 35 : 70);
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [words]);
  return text;
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const } },
};

// Character-sheet attributes (just for fun, like an RPG stat screen)
const ATTRIBUTES = [
  { name: "Frontend", value: 9 },
  { name: "Backend", value: 8 },
  { name: "Debugging", value: 9 },
  { name: "Coffee tolerance", value: 10 },
];

export default function Hero({ profile, orbit, media }: { profile: Profile; orbit: Tech[]; media: MediaManifest }) {
  const role = useTypewriter(profile.roles);

  return (
    <section id="home" className="relative flex min-h-svh items-center px-4 pt-28 pb-24 sm:px-[5vw]">
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.12 }}>
          <motion.p variants={item} className="hud-label flex flex-wrap items-center gap-2 text-cyan">
            <span className="blink text-red">●</span> Location: Stackopolis 2077 <span className="text-muted">{"//"}</span> {profile.location}
          </motion.p>
          <motion.h1
            variants={item}
            className="glitch mt-4 font-display text-5xl leading-[0.95] font-black tracking-wide uppercase sm:text-7xl"
            data-text="Athul Babu"
          >
            Athul Babu
          </motion.h1>
          <motion.p variants={item} className="mt-1 font-display text-2xl font-bold tracking-[0.25em] text-yellow uppercase sm:text-3xl">
            Teeyancheri
          </motion.p>
          <motion.p variants={item} className="mt-5 min-h-[1.5em] font-mono text-lg text-cyan sm:text-xl">
            {">"} {role}
            <span className="blink ml-0.5">_</span>
          </motion.p>
          <motion.p variants={item} className="mt-4 max-w-xl text-xl leading-relaxed text-ink/85">
            I build production web apps end-to-end, from React interfaces to Node.js and Rails APIs. Need a website? You just found your fixer.
          </motion.p>

          {/* Quest tracker */}
          <motion.div variants={item} className="mt-6 max-w-md border-l-2 border-yellow bg-black/50 px-4 py-3 backdrop-blur-sm">
            <p className="hud-label text-yellow">Current objective</p>
            <p className="mt-1 text-lg">Find a full stack developer</p>
            <p className="text-sm text-cyan">✓ Located: Athul, 0.0 km away</p>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn-y">See my work</a>
            <button onClick={() => openContact("website")} className="btn-ghost btn-red">Need a website?</button>
            <button onClick={openChat} className="btn-ghost">Talk to me</button>
            <button onClick={openTerminal} className="btn-ghost !font-mono !normal-case !tracking-normal">&gt;_ terminal</button>
          </motion.div>
        </motion.div>

        {/* Character sheet with the realistic portrait */}
        <motion.div
          className="relative mx-auto w-full max-w-[400px]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <div className="brackets">
            <div className="cut panel overflow-hidden">
              <div className="flex items-center justify-between bg-yellow px-3 py-1 text-black">
                <span className="font-display text-[10px] font-bold tracking-[0.25em]">CHARACTER // ATHUL</span>
                <span className="font-display text-[10px] font-bold">LVL 99</span>
              </div>
              <div className="relative aspect-[4/5]">
                <HoloPortrait media={media} pose="wave" sizes="(max-width: 1024px) 90vw, 400px" />
                <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 font-mono text-[10px] text-cyan">
                  CLASS: FULL STACK DEV
                </div>
                <div className="absolute bottom-3 left-3 bg-black/70 px-2 py-1 font-mono text-[10px] text-yellow">
                  THREAT LEVEL: FRIENDLY
                </div>
              </div>
              <div className="space-y-2 p-4">
                {ATTRIBUTES.map((a, i) => (
                  <div key={a.name} className="flex items-center gap-3">
                    <span className="hud-label w-32 shrink-0 !text-[9px] text-muted">{a.name}</span>
                    <div className="flex flex-1 gap-0.5">
                      {Array.from({ length: 10 }, (_, k) => (
                        <motion.span
                          key={k}
                          className={`h-2 flex-1 ${k < a.value ? "bg-yellow" : "bg-white/10"}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + i * 0.15 + k * 0.04 }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-2">
                  {orbit.slice(0, 6).map((t) => (
                    <TechLogo key={t.id} tech={t} size={30} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
