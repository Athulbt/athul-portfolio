"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { PortfolioViewModel, ProjectViewModel } from "@/controllers/portfolio.controller";
import { Reveal, SectionHeading, TechLogo } from "../components/ui";

const FILTERS = ["All", "Client", "Full Stack", "AI / ML", "Hardware"] as const;

// Inventory rarity per category, like loot in the game
const RARITY: Record<ProjectViewModel["category"], { label: string; color: string }> = {
  Client: { label: "Legendary", color: "#fcee0a" },
  "Full Stack": { label: "Epic", color: "#c058ff" },
  "AI / ML": { label: "Rare", color: "#00f0ff" },
  Hardware: { label: "Uncommon", color: "#4ade80" },
  Web: { label: "Common", color: "#8d9ca5" },
};

// Deterministic (no "current time"), so server and client render the same text.
const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

function ProjectCard({ p, onOpen }: { p: ProjectViewModel; onOpen: () => void }) {
  const rarity = RARITY[p.category];
  return (
    <motion.button
      layout
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`cut panel group relative flex flex-col overflow-hidden p-6 text-left ${p.featured ? "md:col-span-2" : ""}`}
    >
      <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: rarity.color, boxShadow: `0 0 14px ${rarity.color}` }} />
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-40"
        style={{ background: rarity.color }}
      />
      <div className="flex items-center justify-between">
        {p.logo ? (
          <span className="cut-sm grid h-12 w-12 place-items-center bg-white p-1.5">
            <Image src={p.logo} alt={`${p.title} logo`} width={40} height={40} className="h-full w-full object-contain" />
          </span>
        ) : (
          <span className="text-4xl">{p.emoji}</span>
        )}
        <span className="hud-label !text-[9px] font-bold" style={{ color: rarity.color }}>
          {rarity.label} · {p.category}
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold tracking-wide uppercase">{p.title}</h3>
      <p className="text-yellow">{p.tagline}</p>
      <p className="mt-3 line-clamp-3 text-ink/75">{p.description}</p>
      <div className="mt-5 flex flex-wrap gap-2.5">
        {p.stack.map((t) => (
          <TechLogo key={t.id} tech={t} size={30} />
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-6 font-mono text-xs text-muted">
        <span>{p.stats ? `${p.stats.language ?? "code"} · updated ${monthYear(p.stats.pushedAt)}` : p.privateNote}</span>
        <span className="hud-label !text-[9px] text-cyan transition-transform group-hover:translate-x-1">
          {p.highlight ? "Inspect code ▸" : "Inspect ▸"}
        </span>
      </div>
    </motion.button>
  );
}

function ProjectModal({ p, onClose }: { p: ProjectViewModel; onClose: () => void }) {
  const [tab, setTab] = useState<"overview" | "code">("overview");
  const rarity = RARITY[p.category];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-label={p.title}
        className="cut panel flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden !bg-bg-2"
        initial={{ y: 40, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-6">
          <div>
            <p className="hud-label !text-[9px] font-bold" style={{ color: rarity.color }}>{rarity.label} item</p>
            <h3 className="mt-1 font-display text-2xl font-bold uppercase">{p.emoji} {p.title}</h3>
            <p className="text-lg text-yellow">{p.tagline}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="border border-line px-3 py-1 text-muted hover:text-ink">
            ✕
          </button>
        </div>

        {p.highlight && (
          <div className="flex gap-1 border-b border-line px-6">
            {(["overview", "code"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`hud-label relative px-3 py-3 ${tab === t ? "text-yellow" : "text-muted"}`}>
                {t === "code" ? "Under the hood" : "Overview"}
                {tab === t && <motion.span layoutId="modal-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-yellow" />}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {tab === "overview" || !p.highlight ? (
              <motion.div key="overview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <p className="text-lg text-ink/85">{p.description}</p>
                <h4 className="hud-label mt-6 text-cyan">How it&apos;s built</h4>
                <ul className="mt-3 space-y-2">
                  {p.architecture.map((a) => (
                    <li key={a} className="relative pl-5 text-ink/80 before:absolute before:left-0 before:text-yellow before:content-['▸']">
                      {a}
                    </li>
                  ))}
                </ul>
                <h4 className="hud-label mt-6 text-cyan">Stack</h4>
                <div className="mt-3 flex flex-wrap gap-4">
                  {p.stack.map((t) => (
                    <TechLogo key={t.id} tech={t} size={38} label />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="overflow-hidden border border-line bg-[#06060b]">
                  <div className="flex items-center justify-between border-b border-line bg-black px-4 py-2">
                    <span className="font-mono text-xs text-cyan">{p.highlight.file}</span>
                    <span className="hud-label !text-[8px] text-muted">decrypted</span>
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-[#c8d0e0]">
                    <code>{p.highlight.code}</code>
                  </pre>
                </div>
                <h4 className="hud-label mt-6 text-cyan">What&apos;s going on here</h4>
                <ul className="mt-3 space-y-2">
                  {p.highlight.notes.map((n) => (
                    <li key={n} className="relative pl-5 text-ink/80 before:absolute before:left-0 before:text-yellow before:content-['▸']">
                      {n}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-line p-5">
          {p.repoUrl && (
            <a href={p.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-y !py-2.5">
              View on GitHub ↗
            </a>
          )}
          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-2.5">
              Visit live site ↗
            </a>
          )}
          {p.privateNote && <span className="self-center font-mono text-xs text-muted">🔒 {p.privateNote}</span>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects({ projects, moreRepos }: { projects: ProjectViewModel[]; moreRepos: PortfolioViewModel["moreRepos"] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [open, setOpen] = useState<ProjectViewModel | null>(null);
  const shown = projects.filter((p) => filter === "All" || p.category === filter);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-28 sm:px-[5vw]">
      <SectionHeading index="03" tag="Inventory" title="Projects" kicker="My loot. Inspect any item to see how it works, with real code from my repos." />

      <Reveal className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`hud-label relative px-4 py-2 !text-[0.65rem] transition-colors ${filter === f ? "text-black" : "border border-line text-ink/80 hover:text-yellow"}`}
          >
            {filter === f && <motion.span layoutId="filter-pill" className="cut-sm absolute inset-0 bg-yellow" />}
            <span className="relative">{f}</span>
          </button>
        ))}
      </Reveal>

      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <ProjectCard key={p.id} p={p} onOpen={() => setOpen(p)} />
          ))}
        </AnimatePresence>
      </motion.div>

      <Reveal className="mt-10 border border-dashed border-cyan/30 bg-black/40 p-6">
        <p className="hud-label text-cyan">More on GitHub</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {moreRepos.map((r) => (
            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="border border-line bg-card px-4 py-2 transition hover:border-yellow">
              <span className="font-mono text-yellow">{r.name}</span>
              <span className="text-muted"> · {r.note}</span>
            </a>
          ))}
        </div>
      </Reveal>

      <AnimatePresence>{open && <ProjectModal key={open.id} p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
