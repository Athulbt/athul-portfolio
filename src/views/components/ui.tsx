"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Company, Tech } from "@/models/types";

/** Fades and lifts children into view once, when scrolled to. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Game-menu style heading: "// GIGS" tag, glitching title, HUD rule. */
export function SectionHeading({ index, tag, title, kicker }: { index: string; tag: string; title: string; kicker?: string }) {
  return (
    <Reveal className="mb-12">
      <div className="flex items-center gap-3">
        <span className="hud-label bg-yellow px-2 py-0.5 font-bold text-black">{index}</span>
        <span className="hud-label text-cyan">{"// "}{tag}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-cyan/50 to-transparent" />
      </div>
      <h2 className="glitch mt-4 font-display text-3xl font-black tracking-wide uppercase sm:text-5xl" data-text={title}>
        {title}
      </h2>
      {kicker && <p className="mt-3 max-w-2xl text-lg text-muted">{kicker}</p>}
    </Reveal>
  );
}

/** A real brand logo on a light chip, so every logo stays legible on the dark theme. */
export function TechLogo({ tech, size = 40, label = false }: { tech: Tech; size?: number; label?: boolean }) {
  return (
    <span className="group inline-flex flex-col items-center gap-1.5" title={tech.name}>
      <span
        className="cut-sm grid place-items-center bg-white/95 transition-transform duration-200 group-hover:-translate-y-1 group-hover:scale-110"
        style={{ width: size, height: size, padding: size * 0.18 }}
      >
        <Image src={`/logos/tech/${tech.id}.svg`} alt={tech.name} width={size} height={size} unoptimized className="h-full w-full object-contain" />
      </span>
      {label && <span className="text-xs font-semibold text-muted">{tech.name}</span>}
    </span>
  );
}

export function CompanyLogo({ company, size = 56 }: { company: Company; size?: number }) {
  return (
    <span
      className="cut-sm grid shrink-0 place-items-center overflow-hidden bg-white"
      style={{ width: size, height: size, padding: company.logo ? size * 0.12 : 0 }}
    >
      {company.logo ? (
        <Image src={company.logo} alt={`${company.name} logo`} width={size} height={size} className="h-full w-full object-contain" />
      ) : (
        <span className="grid h-full w-full place-items-center bg-yellow font-display text-lg font-black text-black">{company.initials}</span>
      )}
    </span>
  );
}
