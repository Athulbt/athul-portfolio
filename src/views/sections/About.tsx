"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { Profile } from "@/models/types";
import { Reveal, SectionHeading } from "../components/ui";

export default function About({ profile, repoCount }: { profile: Profile; repoCount: number }) {
  const facts = [
    { k: "Based in", v: profile.location },
    { k: "Focus", v: "Full stack web" },
    { k: "Public repos", v: repoCount > 0 ? String(repoCount) : "On GitHub" },
    { k: "Languages", v: "English, Malayalam" },
  ];

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-28 sm:px-[5vw]">
      <SectionHeading index="01" tag="Profile" title="About me" />
      <div className="grid items-start gap-10 lg:grid-cols-[320px_1fr]">
        {/* ID scan */}
        <Reveal>
          <div className="brackets mx-auto max-w-[320px]">
            <div className="cut panel overflow-hidden">
              <div className="relative aspect-square">
                <Image src={profile.photo} alt={profile.name} fill sizes="320px" className="object-cover object-[60%_30%]" />
                <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
                <motion.div
                  className="absolute inset-x-0 h-0.5 bg-cyan shadow-[0_0_14px_var(--color-cyan)]"
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="hud-label !text-[9px] text-cyan">ID verified</span>
                <span className="hud-label !text-[9px] text-green-400">● Open to work</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Data shard */}
        <Reveal delay={0.1}>
          <div className="cut panel p-6 sm:p-8">
            <p className="hud-label mb-4 text-yellow">Data shard {"//"} athul_bio.txt</p>
            {profile.summary.map((p, i) => (
              <p key={i} className="mb-4 text-lg leading-relaxed text-ink/85">{p}</p>
            ))}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.k} className="border-l-2 border-cyan bg-black/40 px-3 py-2">
                  <p className="hud-label !text-[9px] text-muted">{f.k}</p>
                  <p className="mt-0.5 font-semibold">{f.v}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
