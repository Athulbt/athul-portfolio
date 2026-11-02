"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const OPEN_EVENT = "open-build-info";
export const openBuildInfo = () => window.dispatchEvent(new Event(OPEN_EVENT));

/** "How I built this": renders the repo README and links to the source on GitHub. */
export default function BuildInfo({ readme, repoUrl }: { readme: string; repoUrl: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener(OPEN_EVENT, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="How I built this website"
            className="cut panel flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden !bg-bg-2"
            initial={{ y: 40, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="text-yellow">📖 README.md</span>
                <span className="hidden text-muted sm:inline">· how I built this site</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="border border-line px-3 py-1 text-muted hover:text-ink">
                ✕
              </button>
            </div>

            <article className="readme overflow-y-auto px-5 py-6 sm:px-8">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{readme}</ReactMarkdown>
            </article>

            <div className="flex flex-wrap gap-3 border-t border-line p-4">
              <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn-y !py-2.5">
                View the code on GitHub ↗
              </a>
              <a href={`${repoUrl}#readme`} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-2.5">
                Open README on GitHub ↗
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
