"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Certification, Education as EducationItem } from "@/models/types";
import { CompanyLogo, Reveal, SectionHeading } from "../components/ui";

export default function Education({ education, certifications }: { education: EducationItem[]; certifications: Certification[] }) {
  return (
    <section id="education" className="mx-auto max-w-6xl px-4 py-28 sm:px-[5vw]">
      <SectionHeading index="05" tag="Lifepath" title="Education" />

      <div className="grid gap-5 md:grid-cols-2">
        {education.map((e, i) => (
          <Reveal key={e.id} delay={i * 0.1}>
            <div className="cut panel flex h-full gap-4 p-6">
              <CompanyLogo company={e.school} size={52} />
              <div>
                <p className="font-mono text-xs text-cyan">{e.period}</p>
                <h3 className="mt-1 text-xl leading-snug font-bold">{e.credential}</h3>
                <p className="text-yellow">
                  {e.school.name} <span className="text-muted">· {e.location}</span>
                </p>
                <p className="mt-2 text-ink/75">{e.detail}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="hud-label mt-12 mb-4 text-cyan">Certifications {"//"} Unlocked</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {certifications.map((c, i) => (
          <Reveal key={c.code} delay={i * 0.06}>
            <motion.div whileHover={{ y: -6 }} className="cut-sm panel group relative h-full overflow-hidden p-5 text-center">
              <span className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-yellow/15 to-transparent transition-all duration-700 group-hover:left-[140%]" />
              <span className="cut-sm mx-auto grid h-14 w-14 place-items-center bg-white p-2.5">
                <Image src="/logos/tech/azure.svg" alt="Microsoft Azure" width={36} height={36} unoptimized />
              </span>
              <p className="mt-3 font-display text-sm font-bold text-yellow">{c.code}</p>
              <p className="text-sm text-muted">{c.name}</p>
              <p className="hud-label mt-2 !text-[8px] text-cyan">Achievement unlocked</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
