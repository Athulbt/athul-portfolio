"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import type { MediaManifest } from "@/models/media.model";

const NEON = ["0,240,255", "252,238,10", "255,0,60", "255,90,200", "120,90,255", "255,160,40"];

/**
 * Cinematic night-city fallback drawn on canvas: out-of-focus neon bokeh,
 * tower light columns, distant flying-car lights and rain.
 * Replaced by /media/city-loop.mp4 when that file exists.
 */
function NightCityCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    type Bokeh = { x: number; y: number; r: number; c: string; a: number; vx: number; tw: number };
    type Drop = { x: number; y: number; len: number; v: number };
    type Car = { x: number; y: number; v: number; c: string };
    let bokeh: Bokeh[] = [], rain: Drop[] = [], cars: Car[] = [], towers: { x: number; w: number; h: number; c: string }[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    function init() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w * h) / 9000);
      bokeh = Array.from({ length: n }, () => ({
        x: rand(0, w), y: rand(h * 0.15, h), r: rand(4, 38) * (Math.random() < 0.15 ? 2 : 1),
        c: NEON[(Math.random() * NEON.length) | 0], a: rand(0.04, 0.22), vx: rand(-0.08, 0.08), tw: rand(0, Math.PI * 2),
      }));
      rain = Array.from({ length: Math.round(w / 5) }, () => ({ x: rand(0, w), y: rand(0, h), len: rand(10, 26), v: rand(9, 16) }));
      cars = Array.from({ length: 5 }, () => ({ x: rand(0, w), y: rand(h * 0.12, h * 0.5), v: rand(0.6, 1.8) * (Math.random() < 0.5 ? -1 : 1), c: NEON[(Math.random() * 3) | 0] }));
      towers = Array.from({ length: Math.round(w / 70) }, () => ({ x: rand(0, w), w: rand(2, 6), h: rand(h * 0.3, h * 0.8), c: NEON[(Math.random() * NEON.length) | 0] }));
    }

    function frame(t: number) {
      ctx.clearRect(0, 0, w, h);

      // Soft vertical light columns: lit edges of distant towers
      for (const tw of towers) {
        const g = ctx.createLinearGradient(0, h - tw.h, 0, h);
        g.addColorStop(0, `rgba(${tw.c},0)`);
        g.addColorStop(0.6, `rgba(${tw.c},0.10)`);
        g.addColorStop(1, `rgba(${tw.c},0.02)`);
        ctx.fillStyle = g;
        ctx.fillRect(tw.x, h - tw.h, tw.w, tw.h);
      }

      // Out-of-focus neon lights
      ctx.globalCompositeOperation = "lighter";
      for (const b of bokeh) {
        b.x += b.vx;
        if (b.x < -50) b.x = w + 50;
        if (b.x > w + 50) b.x = -50;
        const a = b.a * (0.75 + 0.25 * Math.sin(t / 900 + b.tw));
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, `rgba(${b.c},${a})`);
        g.addColorStop(0.7, `rgba(${b.c},${a * 0.6})`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
      }

      // Flying-car head/tail lights with motion trails
      for (const c of cars) {
        c.x += c.v;
        if (c.x > w + 120) c.x = -120;
        if (c.x < -120) c.x = w + 120;
        const trail = ctx.createLinearGradient(c.x - c.v * 60, c.y, c.x, c.y);
        trail.addColorStop(0, `rgba(${c.c},0)`);
        trail.addColorStop(1, `rgba(${c.c},0.55)`);
        ctx.strokeStyle = trail; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(c.x - c.v * 60, c.y); ctx.lineTo(c.x, c.y); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath(); ctx.arc(c.x, c.y, 1.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // Rain
      ctx.strokeStyle = "rgba(180,220,255,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const d of rain) {
        d.y += d.v; d.x -= d.v * 0.18;
        if (d.y > h) { d.y = -d.len; d.x = rand(0, w * 1.1); }
        ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.len * 0.18, d.y - d.len);
      }
      ctx.stroke();

      if (!reduce) raf = requestAnimationFrame(frame);
    }

    init();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", init);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", init); };
  }, [reduce]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

// Film grain (SVG noise) for a photographic finish
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/** Fixed realistic city behind the whole site. */
export default function CityBackdrop({ media }: { media: MediaManifest }) {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  // Vivid behind the hero, darker under the content
  const shade = useTransform(scrollYProgress, [0, 0.08], [0.25, 0.7]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <motion.div className="absolute inset-0" style={{ scale }}>
        {media.cityVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={media.cityVideo}
            poster={media.cityStill}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : media.cityStill ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={media.cityStill} alt="" className="absolute inset-0 h-full w-full object-cover" />
            {/* Still image + live rain, neon and flying-car trails on top */}
            <div className="absolute inset-0 opacity-70">
              <NightCityCanvas />
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_110%,#3a0a3f_0%,#14061f_45%,#050509_80%)]" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(60%_60%_at_30%_100%,rgb(0_240_255/0.18),transparent_70%),radial-gradient(50%_50%_at_75%_100%,rgb(255_0_60/0.16),transparent_70%)] blur-2xl" />
            <NightCityCanvas />
          </>
        )}
      </motion.div>

      {/* Haze, grain, scanlines, vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_5_9/0.55)_0%,transparent_30%,transparent_70%,rgb(5_5_9/0.75)_100%)]" />
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      <div className="scanlines absolute inset-0 opacity-40" />
      <div className="absolute inset-0 shadow-[inset_0_0_200px_60px_rgb(0_0_0/0.85)]" />
      <motion.div className="absolute inset-0 bg-bg" style={{ opacity: shade }} />
    </div>
  );
}
