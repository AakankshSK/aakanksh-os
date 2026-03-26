"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  reducedMotion?: boolean;
};

export function ContactInfoRow({ label, icon, children, href, external, reducedMotion }: Props) {
  const inner = (
    <motion.div
      className={cn(
        "group flex items-start gap-4 rounded-xl px-3 py-3 sm:px-3.5 sm:py-3.5",
        "-mx-1 transition-colors duration-300",
      )}
      whileHover={reducedMotion ? undefined : { x: 5 }}
      transition={{ type: "tween", duration: 0.22, ease: [0, 0, 0.58, 1] }}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          "border border-white/[0.09] bg-white/[0.035] text-muted",
          "transition-[color,background-color,border-color] duration-300",
          "group-hover:border-accent2/30 group-hover:bg-accent2/[0.08] group-hover:text-accent2",
        )}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="kicker text-foreground/40">{label}</p>
        <div
          className={cn(
            "mt-1.5 text-sm leading-snug text-muted transition-colors duration-300",
            "group-hover:text-foreground/92",
          )}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        data-cursor="pointer"
        className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent2/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        {inner}
      </a>
    );
  }

  return <div className="group block rounded-xl">{inner}</div>;
}
