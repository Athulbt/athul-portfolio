"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CONTACT_TEMPLATES, composeLinks, type ContactKind } from "@/models/contact.model";

const OPEN_EVENT = "open-contact";

/** Opens the "how do you want to reach me?" popup from anywhere on the page. */
export const openContact = (kind: ContactKind) => window.dispatchEvent(new CustomEvent<ContactKind>(OPEN_EVENT, { detail: kind }));

export default function ContactModal({ email }: { email: string }) {
  const [kind, setKind] = useState<ContactKind | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const open = (e: Event) => {
      setCopied(false);
      setKind((e as CustomEvent<ContactKind>).detail);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setKind(null);
    window.addEventListener(OPEN_EVENT, open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const links = kind ? composeLinks(email, kind) : null;
  const template = kind ? CONTACT_TEMPLATES[kind] : null;

  return (
    <AnimatePresence>
      {kind && links && template && (
        <motion.div
          className="fixed inset-0 z-[95] grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setKind(null)}
        >
          <motion.div
            role="dialog"
            aria-label={template.title}
            className="cut panel w-full max-w-md !bg-bg-2"
            initial={{ y: 30, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-yellow px-4 py-2 text-black">
              <span className="font-display text-xs font-bold tracking-widest uppercase">{template.title}</span>
              <button onClick={() => setKind(null)} aria-label="Close" className="px-1 text-lg font-bold hover:opacity-60">
                ✕
              </button>
            </div>
            <div className="p-5">
              <p className="text-lg">How do you want to reach me?</p>
              <p className="mt-1 text-sm text-muted">The subject and a short template are filled in for you.</p>

              <div className="mt-5 grid gap-3">
                <a href={links.gmail} target="_blank" rel="noopener noreferrer" className="btn-y justify-center" onClick={() => setKind(null)}>
                  Open in Gmail
                </a>
                <a href={links.outlook} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-center" onClick={() => setKind(null)}>
                  Open in Outlook
                </a>
                <a href={links.mailto} className="btn-ghost justify-center" onClick={() => setKind(null)}>
                  Use my email app
                </a>
              </div>

              <button
                onClick={() => copy(email)}
                className="mt-5 flex w-full items-center justify-between border border-line bg-black/40 px-4 py-3 font-mono text-sm hover:border-cyan"
              >
                <span>{email}</span>
                <span className="text-cyan">{copied ? "✓ copied" : "copy"}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
