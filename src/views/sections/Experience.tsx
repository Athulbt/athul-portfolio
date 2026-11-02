"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import type { PortfolioViewModel } from "@/controllers/portfolio.controller";
import { CompanyLogo, Reveal, SectionHeading, TechLogo } from "../components/ui";

export default function Experience({ items }: { items: PortfolioViewModel["experiences"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section id="experience" className="mx-auto max-w-6xl px-4 py-28 sm:px-[5vw]">
      <SectionHeading index="02" tag="Gigs" title="Experience" kicker="Every contract I've taken, from ML internships in India to shipping production web apps in Canada." />

      <div ref={ref} className="relative pl-9 sm:pl-14">
        {/* Mission line that draws itself as you scroll */}
        <div className="absolute top-0 bottom-0 left-[11px] w-px bg-line sm:left-[21px]">
          <motion.div className="h-full w-full origin-top bg-yellow shadow-[0_0_10px_var(--color-yellow)]" style={{ scaleY: line }} />
        </div>

        {items.map((exp, i) => (
          <Reveal key={exp.id} delay={i * 0.05} className="relative mb-10">
            <span className="absolute top-9 -left-[31px] h-3 w-3 rotate-45 border-2 border-yellow bg-bg sm:-left-[38px]">
              {exp.current && <span className="absolute -inset-2 animate-ping border border-yellow" />}
            </span>

            <motion.article whileHover={{ x: 6 }} className="cut panel p-6 sm:p-8">
              <div className="flex flex-wrap items-start gap-4">
                <CompanyLogo company={exp.company} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`hud-label px-2 py-0.5 !text-[9px] font-bold ${exp.current ? "bg-yellow text-black" : "border border-cyan/50 text-cyan"}`}>
                      {exp.current ? "Active gig" : "Completed"}
                    </span>
                    <span className="font-mono text-xs text-muted">{exp.start} – {exp.end}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold tracking-wide uppercase sm:text-xl">
                    {exp.role} {exp.type && <span className="text-sm font-medium text-muted normal-case">({exp.type})</span>}
                  </h3>
                  <p className="text-lg text-yellow">
                    {exp.company.url ? (
                      <a href={exp.company.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {exp.company.name} ↗
                      </a>
                    ) : (
                      exp.company.name
                    )}
                    <span className="text-muted"> · {exp.location}</span>
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {exp.highlights.map((h) => (
                  <li key={h} className="relative pl-5 text-lg text-ink/80 before:absolute before:left-0 before:text-cyan before:content-['▸']">
                    {h}
                  </li>
                ))}
              </ul>

              {exp.quote && (
                <blockquote className="mt-5 border-l-2 border-yellow bg-yellow/5 px-4 py-3 italic">
                  “{exp.quote.text}”
                  <cite className="mt-1 block text-sm not-italic text-muted">{exp.quote.author}</cite>
                </blockquote>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                {exp.stack.map((t) => (
                  <TechLogo key={t.id} tech={t} size={34} />
                ))}
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
