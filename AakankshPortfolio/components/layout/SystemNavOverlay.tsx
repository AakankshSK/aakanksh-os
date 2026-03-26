"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/lib/site";

const NAV_ITEMS = [
  { num: "01", label: "HOME", href: "#top" },
  { num: "02", label: "ABOUT", href: "#about" },
  { num: "03", label: "WORK", href: "#projects" },
  { num: "04", label: "SKILLS", href: "#skills" },
  { num: "05", label: "EDUCATION", href: "#education" },
  { num: "06", label: "CONTACT", href: "#contact" },
] as const;

const FOOTER_LINKS = [
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "GitHub", href: site.social.github },
  { label: "WhatsApp", href: site.whatsappUrl },
] as const;

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const headerContainerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.06 },
  },
};

const headerLineVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SystemNavOverlay({ open, onClose }: Props) {
  const handleNav = useCallback(
    () => {
      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          id="system-nav-overlay"
          className="fixed inset-0 z-[9999] flex cursor-auto flex-col bg-[#070707] text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ cursor: "auto" }}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_22%,transparent_78%,rgba(0,0,0,0.45)_100%)]" />

          <div className="relative flex items-center justify-between border-b border-border-strong px-4 py-4 sm:px-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">session · nav</p>
            <button
              type="button"
              onClick={onClose}
              className="border border-border-strong bg-surface px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-red-500/40 hover:text-red-400/95"
              data-cursor="pointer"
            >
              [ close ]
            </button>
          </div>

          <div
            className="relative flex flex-1 flex-col overflow-y-auto px-4 py-10 sm:px-10 sm:py-14"
            data-lenis-prevent
          >
            <div className="mx-auto w-full max-w-3xl">
              <motion.div
                variants={headerContainerVariants}
                initial="hidden"
                animate="show"
                className="space-y-1 font-mono text-sm leading-relaxed text-muted/90 sm:text-base"
              >
                <motion.p variants={headerLineVariants} className="text-red-500/85">
                  root@aakanksh:~$ ls
                </motion.p>
                <motion.p variants={headerLineVariants} className="text-foreground/75">
                  navigation/
                </motion.p>
              </motion.div>

              <nav className="mt-14" aria-label="Primary system navigation">
                <motion.ul
                  className="flex flex-col gap-2 sm:gap-3"
                  initial="hidden"
                  animate="show"
                  variants={listVariants}
                >
                  {NAV_ITEMS.map((item) => (
                    <motion.li key={item.href} variants={itemVariants}>
                      <a
                        href={item.href}
                        onClick={handleNav}
                        className="group flex items-baseline gap-4 border-b border-transparent py-2 transition-colors sm:py-3 hover:border-red-500/25"
                        data-cursor="pointer"
                      >
                        <span className="shrink-0 font-mono text-xs tabular-nums text-muted/70 sm:text-sm">
                          {item.num}
                        </span>
                        <span className="font-display text-[clamp(1.75rem,6vw,3.25rem)] font-medium leading-none tracking-tight text-foreground/88 transition-colors group-hover:text-red-500/90">
                          {item.label}
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>
            </div>

            <motion.footer
              className="mx-auto mt-auto flex w-full max-w-3xl flex-wrap gap-x-8 gap-y-3 border-t border-border-strong pt-10 font-mono text-[11px] uppercase tracking-[0.14em]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-red-500/90"
                  data-cursor="pointer"
                >
                  {link.label}
                </a>
              ))}
            </motion.footer>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
