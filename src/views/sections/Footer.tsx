"use client";

import type { Profile } from "@/models/types";
import { openBuildInfo } from "../components/BuildInfo";

export default function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-yellow/20 bg-black/80 px-4 pt-10 pb-40 text-center backdrop-blur sm:pb-12">
      <p className="hud-label text-muted">Designed &amp; built by {profile.name} · Next.js · TypeScript · Tailwind · Motion</p>
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button onClick={openBuildInfo} className="btn-ghost !py-2.5">📖 How I built this</button>
        <a href={profile.links.repo} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-2.5">
          {"</>"} Source on GitHub ↗
        </a>
      </div>
      <p className="mt-5 text-muted">
        Psst... press <kbd>`</kbd> and type <code className="text-yellow">sudo hire-athul</code>
      </p>
    </footer>
  );
}
