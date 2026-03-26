"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const LINES = [
  "AI Engineer crafting intelligent systems.",
  "Focused on AI, full-stack systems & performance.",
  "Based in Bangalore, Karnataka, India.",
  "Stack: TypeScript, React 19, Python, Tailwind, Framer, Node, AI & RAG.",
  "Built 2+ AI-driven projects.",
  "Research work prepared for patent submission.",
] as const;

/** Calm cadence — readable, not rushed */
const TYPING_MS = 54;
const PAUSE_FULL_MS = 2600;
const DELETE_MS = 40;
const BETWEEN_LINES_MS = 420;

type Phase = "typing" | "deleting";

type Props = {
  className?: string;
};

export function HeroTypewriter({ className }: Props) {
  const reduced = usePrefersReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  const line = LINES[lineIndex];

  useEffect(() => {
    if (reduced) return;

    let tid: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < line.length) {
        tid = setTimeout(() => {
          setDisplayed(line.slice(0, displayed.length + 1));
        }, TYPING_MS);
      } else {
        tid = setTimeout(() => setPhase("deleting"), PAUSE_FULL_MS);
      }
    } else {
      if (displayed.length > 0) {
        tid = setTimeout(() => setDisplayed((s) => s.slice(0, -1)), DELETE_MS);
      } else {
        tid = setTimeout(() => {
          setLineIndex((i) => (i + 1) % LINES.length);
          setPhase("typing");
        }, BETWEEN_LINES_MS);
      }
    }

    return () => clearTimeout(tid);
  }, [displayed, phase, line, lineIndex, reduced]);

  if (reduced) {
    return (
      <p className={cn("text-lg leading-[var(--prose-rhythm)] text-muted sm:text-xl", className)}>
        <span className="font-mono text-[0.92em] tracking-tight text-red-500/75">System</span>
        <span className="font-mono text-[0.92em] text-muted/75"> |</span>{" "}
        <span className="text-foreground/88">{LINES[0]}</span>
      </p>
    );
  }

  return (
    <p
      className={cn(
        "min-h-[calc(1.62em*2.25)] max-w-[min(38ch,100%)] text-lg leading-[var(--prose-rhythm)] sm:text-xl",
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="font-mono text-[0.92em] tracking-tight text-red-500/78">System</span>
      <span className="font-mono text-[0.92em] text-muted/70"> |</span>{" "}
      <span className="text-foreground/88">{displayed}</span>
      <span className="hero-typewriter-cursor ml-px inline-block translate-y-px font-mono text-accent2/85" aria-hidden>
        ▍
      </span>
    </p>
  );
}
