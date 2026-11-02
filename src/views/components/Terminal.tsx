"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { PortfolioViewModel } from "@/controllers/portfolio.controller";
import { openContact } from "./ContactModal";

const OPEN_EVENT = "open-terminal";
export const openTerminal = () => window.dispatchEvent(new Event(OPEN_EVENT));

type Line = { id: number; node: ReactNode };

function burstConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:100";
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const colors = ["#22d3ee", "#a78bfa", "#f472b6", "#4ade80", "#facc15"];
  const parts = Array.from({ length: 180 }, () => ({
    x: innerWidth / 2, y: innerHeight / 2,
    vx: (Math.random() - 0.5) * 18, vy: Math.random() * -18 - 4,
    s: Math.random() * 6 + 4, c: colors[(Math.random() * colors.length) | 0], r: Math.random() * 6,
  }));
  let frame = 0;
  const loop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of parts) {
      p.vy += 0.45; p.x += p.vx; p.y += p.vy; p.r += 0.1;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
    }
    if (frame++ < 180) requestAnimationFrame(loop);
    else canvas.remove();
  };
  loop();
}

export default function Terminal({ vm }: { vm: PortfolioViewModel }) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const history = useRef<string[]>([]);
  const hIdx = useRef(0);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const print = useCallback((node: ReactNode) => setLines((l) => [...l, { id: nextId.current++, node }]), []);

  const goTo = useCallback((id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const commands: Record<string, (arg: string) => void> = {
    help: () =>
      print(
        <div>
          {[
            ["about", "who I am"], ["experience", "where I've worked"], ["projects", "things I've built"],
            ["skills", "my tech stack"], ["education", "where I studied"], ["contact", "how to reach me"],
            ["goto <section>", "jump to a section"], ["whoami · clear · exit", ""],
          ].map(([c, d]) => (
            <div key={c}><span className="inline-block w-44 text-cyan">{c}</span>{d}</div>
          ))}
          <div className="mt-1 text-muted">...and maybe a secret or two 🤫</div>
        </div>,
      ),
    about: () => print(vm.profile.summary[0]),
    whoami: () => print("visitor, but you could be my next teammate 😉"),
    experience: () =>
      print(
        <div>
          {vm.experiences.map((e) => (
            <div key={e.id}><span className="inline-block w-36 text-yellow">{e.start}</span>{e.role} @ {e.company.name}</div>
          ))}
        </div>,
      ),
    projects: () =>
      print(
        <div>
          {vm.projects.map((p) => (
            <div key={p.id}>{p.emoji} <span className="text-cyan">{p.title}</span> <span className="text-muted">{p.stack.map((s) => s.name).join(", ")}</span></div>
          ))}
        </div>,
      ),
    skills: () =>
      print(
        <div>
          {vm.skills.map((g) => (
            <div key={g.title}><span className="inline-block w-36 text-cyan">{g.title}</span>{g.items.map((t) => t.name).join(", ")}</div>
          ))}
        </div>,
      ),
    education: () =>
      print(
        <div>
          {vm.education.map((e) => (
            <div key={e.id}>🎓 {e.credential} <span className="text-muted">({e.school.name}, {e.period})</span></div>
          ))}
        </div>,
      ),
    contact: () =>
      print(
        <div>
          <div>email    <button className="text-cyan underline" onClick={() => { setOpen(false); openContact("hello"); }}>{vm.profile.email}</button></div>
          <div>linkedin <a className="text-cyan underline" href={vm.profile.links.linkedin} target="_blank" rel="noopener noreferrer">{vm.profile.links.linkedin}</a></div>
          <div>github   <a className="text-cyan underline" href={vm.profile.links.github} target="_blank" rel="noopener noreferrer">{vm.profile.links.github}</a></div>
        </div>,
      ),
    goto: (arg) => {
      if (arg && document.getElementById(arg)) goTo(arg);
      else print(<span className="text-red-400">usage: goto about|experience|projects|skills|education|contact</span>);
    },
    ls: () => print("about  experience  projects  skills  education  contact  secret.txt"),
    cat: (arg) => print(arg === "secret.txt" ? <span className="text-yellow">try: sudo hire-athul</span> : <span className="text-red-400">cat: {arg}: No such file</span>),
    sudo: (arg) => {
      if (arg === "hire-athul") {
        print(<span className="text-green-400">[sudo] verifying candidate... ✓ production experience ✓ full stack ✓ Azure certified</span>);
        print(<span className="text-cyan">🎉 Excellent decision! Opening a message to me...</span>);
        burstConfetti();
        setTimeout(() => { setOpen(false); openContact("hire"); }, 1800);
      } else print(<span className="text-red-400">Nice try. This incident will be reported 😄</span>);
    },
    rm: () => print(<span className="text-red-400">🙅 Not on my watch.</span>),
    clear: () => setLines([]),
    exit: () => setOpen(false),
  };

  const run = (raw: string) => {
    const line = raw.trim();
    print(<span><span className="text-green-400">athul@portfolio:~$</span> {line}</span>);
    if (!line) return;
    history.current.push(line);
    hIdx.current = history.current.length;
    const [cmd, ...rest] = line.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (fn) fn(rest.join(" "));
    else print(<span className="text-red-400">command not found: {cmd}. Type &apos;help&apos;.</span>);
  };

  useEffect(() => {
    const show = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea/i.test((document.activeElement as HTMLElement)?.tagName ?? "");
      if (e.key === "`" && !typing) { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener(OPEN_EVENT, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    if (lines.length === 0) {
      print(<span>Welcome to <span className="text-cyan">Athul&apos;s portfolio terminal</span> v2.0</span>);
      print(<span>Type <span className="text-cyan">help</span> to see what you can do.</span>);
    }
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        aria-label="Open terminal"
        className="cut-sm fixed right-4 bottom-4 z-40 grid h-14 w-14 place-items-center border border-yellow bg-black/85 font-mono font-semibold text-yellow shadow-[0_0_24px_-4px_var(--color-yellow)] sm:right-6 sm:bottom-6"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.1 }}
      >
        &gt;_
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-label="Interactive terminal"
              className="cut panel flex h-[min(480px,80vh)] w-full max-w-3xl flex-col overflow-hidden !bg-[#05050a]/95"
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => { e.stopPropagation(); inputRef.current?.focus(); }}
            >
              <div className="flex items-center justify-between bg-yellow px-4 py-1.5 text-black">
                <span className="font-display text-xs font-bold tracking-widest">NETRUNNER TERMINAL // athul@portfolio</span>
                <button aria-label="Close terminal" onClick={() => setOpen(false)} className="px-1 text-lg font-bold hover:opacity-60">✕</button>
              </div>
              <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-[#c3d4da]">
                {lines.map((l) => (
                  <div key={l.id} className="break-words whitespace-pre-wrap">{l.node}</div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-green-400">athul@portfolio:~$</span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { run(input); setInput(""); }
                      else if (e.key === "ArrowUp" && hIdx.current > 0) { e.preventDefault(); setInput(history.current[--hIdx.current]); }
                      else if (e.key === "ArrowDown") { hIdx.current = Math.min(hIdx.current + 1, history.current.length); setInput(history.current[hIdx.current] ?? ""); }
                      else if (e.key === "Tab") { e.preventDefault(); const m = Object.keys(commands).find((c) => c.startsWith(input)); if (m) setInput(m); }
                    }}
                    className="flex-1 bg-transparent text-ink caret-cyan outline-none"
                    aria-label="Terminal input"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
