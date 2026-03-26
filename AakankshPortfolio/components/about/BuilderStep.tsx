"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/cn";
import { useMaxWidth768 } from "@/hooks/useMaxWidth768";

export type BuilderStepProps = {
  number: string;
  title: string;
  description: string;
  /** Subtle contextual hint shown on hover */
  hint?: string;
  /** Alternating horizontal offset on large screens */
  offsetClass: string;
};

export function BuilderStep({ number, title, description, hint, offsetClass }: BuilderStepProps) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.32 });
  const [hovered, setHovered] = useState(false);
  const isMobile = useMaxWidth768();

  return (
    <motion.li
      ref={ref}
      className={cn("group/step relative", offsetClass)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Timeline segment + glow on hover */}
      <div
        className="pointer-events-none absolute -left-1 top-2 h-[calc(100%-0.5rem)] w-px lg:-left-8"
        aria-hidden
      >
        <motion.span
          className={cn(
            "absolute inset-0 w-px origin-top bg-white/10 transition-[background-color,box-shadow] duration-300",
            "group-hover/step:bg-red-500/45 group-hover/step:shadow-[0_0_14px_rgba(239,68,68,0.35)]",
          )}
          initial={false}
          animate={inView ? { opacity: [0.28, 0.55, 0.38] } : { opacity: 0.28 }}
          transition={{ duration: 1.35, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className={cn(
          "relative overflow-hidden border border-white/10 bg-[#0a0a0a] p-5 sm:p-6",
          "transition-colors duration-300",
          "group-hover/step:border-red-500/40",
        )}
        whileHover={isMobile ? undefined : { x: 5 }}
        transition={isMobile ? { duration: 0.2 } : { type: "spring", stiffness: 420, damping: 32 }}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
            "bg-[radial-gradient(120%_80%_at_0%_0%,rgba(239,68,68,0.06),transparent_55%)]",
            hovered && "opacity-100",
          )}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />

        <div className="relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted/80 transition-colors duration-300 group-hover/step:text-white/90">
            <span className="tabular-nums">{hovered ? `${number}_` : number}</span>
          </p>
          <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-foreground transition-colors duration-300 group-hover/step:text-white/90 sm:text-[1.85rem]">
            {title}
          </h3>
          <p className="mt-5 max-w-prose text-sm leading-[var(--prose-rhythm)] text-muted transition-colors duration-300 group-hover/step:text-white/80 sm:text-base">
            {description}
          </p>

          {hint ? (
            <div
              className={cn(
                "overflow-hidden transition-[max-height,margin,opacity] duration-300 ease-out",
                hovered ? "mt-4 max-h-24 border-t border-white/[0.08] pt-4 opacity-100" : "mt-0 max-h-0 border-t-0 pt-0 opacity-0",
              )}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-red-500/70">→ {hint}</p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.li>
  );
}
