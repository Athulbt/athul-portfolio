"use client";

import Image from "next/image";
import { useState } from "react";
import { EMAIL_ACTIONS } from "@/models/chat.model";
import type { Profile } from "@/models/types";
import { openChat } from "../components/HoloCall";
import { Reveal } from "../components/ui";

export default function Contact({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative mx-auto max-w-5xl px-4 py-32 sm:px-[5vw]">
      <Reveal className="text-center">
        <p className="hud-label text-cyan">
          <span className="bg-yellow px-2 py-0.5 font-bold text-black">06</span> {"// "}Fixer contact
        </p>
        <h2 className="glitch mt-4 font-display text-4xl font-black tracking-wide uppercase sm:text-6xl" data-text="Let's build">
          Let&apos;s build
        </h2>
        <p className="font-display text-2xl font-bold tracking-[0.2em] text-yellow uppercase sm:text-3xl">something</p>
        <p className="mx-auto mt-5 max-w-xl text-xl text-ink/80">
          I&apos;m open to full stack developer roles in Canada, and I take freelance website gigs. No corpo red tape, just good code.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {/* New gig: website request */}
        <Reveal delay={0.1}>
          <div className="cut panel relative h-full overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-red/25 blur-3xl" />
            <p className="hud-label text-red"><span className="blink">●</span> New gig available</p>
            <h3 className="mt-3 font-display text-xl font-bold uppercase">Need a website?</h3>
            <p className="mt-3 text-lg text-ink/80">
              Booking sites, business pages, dashboards, full stack apps. I built the site that grew Lambton Window Pros&apos; online bookings by 30%. Tell me what you need.
            </p>
            <p className="mt-3 font-mono text-sm text-yellow">Reward: a website that actually works ✓</p>
            <a href={EMAIL_ACTIONS.website(profile.email).href} className="btn-y mt-6">
              Accept gig: email me
            </a>
          </div>
        </Reveal>

        {/* Just say hello */}
        <Reveal delay={0.18}>
          <div className="cut panel h-full p-6 sm:p-8">
            <p className="hud-label text-cyan">Open channel</p>
            <h3 className="mt-3 font-display text-xl font-bold uppercase">Just say hello</h3>
            <p className="mt-3 text-lg text-ink/80">Recruiter, fellow dev or just curious? Ping me. I answer faster than a flying cab in rush hour.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={EMAIL_ACTIONS.hello(profile.email).href} className="btn-y">Say hello 👋</a>
              <button onClick={openChat} className="btn-ghost">Holo-call me</button>
            </div>
            <button onClick={copyEmail} className="mt-4 block font-mono text-sm text-muted hover:text-cyan">
              {copied ? "✓ copied to clipboard" : `${profile.email} ⧉`}
            </button>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.25} className="mt-8 flex justify-center gap-4">
        {[
          { href: profile.links.linkedin, logo: "/logos/tech/linkedin.svg", label: "LinkedIn" },
          { href: profile.links.github, logo: "/logos/tech/github.svg", label: "GitHub" },
        ].map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hud-label flex items-center gap-2 border border-line bg-card px-5 py-3 transition hover:-translate-y-1 hover:border-yellow"
          >
            <span className="cut-sm grid h-7 w-7 place-items-center bg-white p-1">
              <Image src={l.logo} alt="" width={20} height={20} unoptimized />
            </span>
            {l.label}
          </a>
        ))}
      </Reveal>
    </section>
  );
}
