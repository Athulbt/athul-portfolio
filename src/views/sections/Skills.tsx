"use client";

import { motion } from "motion/react";
import type { PortfolioViewModel } from "@/controllers/portfolio.controller";
import { Reveal, SectionHeading, TechLogo } from "../components/ui";

export default function Skills({ groups }: { groups: PortfolioViewModel["skills"] }) {
  const all = groups.flatMap((g) => g.items);

  return (
    <section id="skills" className="mx-auto max-w-6xl px-4 py-28 sm:px-[5vw]">
      <SectionHeading index="04" tag="Cyberware" title="Skills" kicker="Everything installed in my head. All legit, no back-alley ripperdocs." />

      <Reveal className="marquee mb-12 overflow-hidden border-y border-yellow/20 bg-black/40 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max gap-6 py-4">
          {[...all, ...all].map((t, i) => (
            <TechLogo key={`${t.id}-${i}`} tech={t} size={48} />
          ))}
        </div>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, gi) => (
          <Reveal key={g.title} delay={gi * 0.06}>
            <div className="cut panel h-full p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold tracking-widest text-yellow uppercase">{g.title}</h3>
                <span className="font-mono text-xs text-cyan">{String(g.items.length).padStart(2, "0")} slots</span>
              </div>
              <motion.div
                className="mt-5 flex flex-wrap gap-x-4 gap-y-5"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.05 }}
              >
                {g.items.map((t) => (
                  <motion.div key={t.id} variants={{ hidden: { opacity: 0, scale: 0.5 }, show: { opacity: 1, scale: 1 } }} className="w-16">
                    <TechLogo tech={t} size={42} label />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
