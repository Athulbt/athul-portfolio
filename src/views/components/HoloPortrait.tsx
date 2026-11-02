"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LIVE_LAYOUT, type GuidePose, type MediaManifest } from "@/models/media.model";

// Breathing: a slow rise/fall anchored at the feet, with a tiny sway.
const BREATHE = {
  animate: { scaleY: [1, 1.012, 1], scaleX: [1, 0.997, 1], rotate: [-0.4, 0.4, -0.4] },
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const },
};

/** Placeholder until media exists: a neutral holo silhouette, never a real photo. */
function Silhouette() {
  return (
    <svg viewBox="0 0 100 120" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="holo" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#00f0ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#00f0ff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="42" r="20" fill="url(#holo)" />
      <path d="M14 120 Q16 78 50 72 Q84 78 86 120 Z" fill="url(#holo)" />
    </svg>
  );
}

/**
 * Cinemagraph of the cyberpunk avatar: the waving hand is a separate cut-out layer
 * rotating around the wrist, the visor gets a sweeping light, and the body breathes.
 */
function LiveAvatar({ live, sizes }: { live: NonNullable<MediaManifest["live"]>; sizes: string }) {
  const reduce = useReducedMotion();
  const h = LIVE_LAYOUT.hand;

  return (
    <motion.div
      className="relative w-full"
      style={{ aspectRatio: LIVE_LAYOUT.aspect, originY: 1 }}
      animate={reduce ? undefined : BREATHE.animate}
      transition={BREATHE.transition}
    >
      <Image src={live.base} alt="Athul's avatar waving" fill sizes={sizes} className="object-cover" priority />

      {/* Waving hand */}
      <motion.div
        className="absolute"
        style={{ left: `${h.left}%`, top: `${h.top}%`, width: `${h.width}%`, height: `${h.height}%`, originX: h.originX, originY: h.originY }}
        animate={reduce ? undefined : { rotate: [0, -14, 6, -14, 6, 0, 0] }}
        transition={{ duration: 2.6, times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1], repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
      >
        <Image src={live.hand} alt="" fill sizes="120px" className="object-contain" />
      </motion.div>

      {/* Light sweeping across the visor */}
      {!reduce && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{ maskImage: `url(${live.visor})`, WebkitMaskImage: `url(${live.visor})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
        >
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"
            animate={{ left: ["-40%", "110%"] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}

/** A still image that breathes (for avatars without separate layers). */
function BreathingImage({ src, sizes }: { src: string; sizes: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="relative h-full w-full"
      style={{ originY: 1 }}
      animate={reduce ? undefined : BREATHE.animate}
      transition={BREATHE.transition}
    >
      <Image src={src} alt="Athul's avatar" fill sizes={sizes} className="object-cover object-top" priority />
    </motion.div>
  );
}

/** Avatar portrait: plays a clip, a cinemagraph or a breathing still for the pose, with a holo-call finish. */
export default function HoloPortrait({ media, pose, sizes }: { media: MediaManifest; pose: GuidePose; sizes: string }) {
  const asset = media.guide[pose];
  // Poses without their own media use the animated cyberpunk portrait
  const key = asset?.src ?? (media.live ? "live" : media.guidePortrait ?? "silhouette");

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#2b2b2b]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={key}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 10, filter: "hue-rotate(90deg) saturate(2.5) brightness(1.4)" }}
          animate={{ opacity: 1, x: 0, filter: "hue-rotate(0deg) saturate(1) brightness(1)" }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {asset?.kind === "video" ? (
            <video src={asset.src} className="h-full w-full object-cover" autoPlay muted loop playsInline />
          ) : asset ? (
            <BreathingImage src={asset.src} sizes={sizes} />
          ) : media.live ? (
            <LiveAvatar live={media.live} sizes={sizes} />
          ) : media.guidePortrait ? (
            <BreathingImage src={media.guidePortrait} sizes={sizes} />
          ) : (
            <Silhouette />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Holo-call treatment */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_55%,rgb(0_0_0/0.55))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_240_255/0.08),transparent_40%,rgb(252_238_10/0.06))] mix-blend-screen" />
      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
      <motion.div
        className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-cyan/15 to-transparent"
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
