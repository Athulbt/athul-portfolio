"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { openBuildInfo } from "../components/BuildInfo";

// Game-menu labels with plain-English meaning underneath
const LINKS = [
  { id: "about", label: "Profile" },
  { id: "experience", label: "Gigs" },
  { id: "projects", label: "Inventory" },
  { id: "skills", label: "Cyberware" },
  { id: "education", label: "Lifepath" },
];

export default function Nav() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("section[id]").forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-yellow shadow-[0_0_12px_var(--color-yellow)]" style={{ scaleX: progress }} />
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 transition-all duration-300 sm:px-[5vw] ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        {/* Blur lives on its own layer: backdrop-filter on the header itself would trap the fixed mobile drawer inside it. */}
        <div
          className={`absolute inset-0 -z-10 transition-colors duration-300 ${scrolled ? "border-b border-yellow/20 bg-bg/80 backdrop-blur-xl" : ""}`}
        />
        <a href="#home" className="flex items-center gap-2">
          <span className="cut-sm grid h-9 w-9 place-items-center bg-yellow font-display text-sm font-black text-black">AT</span>
          <span className="hidden font-display text-xs leading-tight font-bold tracking-[0.2em] sm:block">
            ATHUL
            <br />
            <span className="text-cyan">STACKOPOLIS 2077</span>
          </span>
        </a>
        <button className="font-display text-xl text-yellow lg:hidden" aria-label="Toggle menu" onClick={() => setOpen((o) => !o)}>
          {open ? "✕" : "☰"}
        </button>
        <nav
          className={`fixed inset-y-0 right-0 flex w-64 flex-col justify-center gap-6 border-l border-yellow/30 bg-bg-2 p-10 transition-transform lg:static lg:w-auto lg:translate-x-0 lg:flex-row lg:items-center lg:gap-6 lg:border-0 lg:bg-transparent lg:p-0 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className={`hud-label relative !text-[0.7rem] transition-colors hover:text-yellow ${active === l.id ? "text-yellow" : "text-ink/80"}`}
            >
              {active === l.id && <motion.span layoutId="nav-marker" className="absolute top-1/2 -left-3 h-1.5 w-1.5 -translate-y-1/2 bg-yellow" />}
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { setOpen(false); openBuildInfo(); }}
            className="hud-label text-left !text-[0.7rem] text-cyan transition-colors hover:text-ink"
          >
            {"</>"} How I built this
          </button>
          <a href="#contact" onClick={() => setOpen(false)} className="btn-y !px-4 !py-2.5 !text-[0.65rem]">
            Hire me
          </a>
        </nav>
      </header>
    </>
  );
}
