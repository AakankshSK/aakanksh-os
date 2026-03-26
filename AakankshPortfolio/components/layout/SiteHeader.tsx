"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { SystemNavOverlay } from "@/components/layout/SystemNavOverlay";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-300",
          scrolled ? "border-border bg-background/98" : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-4 px-4 sm:h-16 sm:px-8">
          <a href="#top" className="group flex min-w-0 items-center gap-3" data-cursor="pointer">
          <span
  className="
    relative flex h-9 w-12 shrink-0 items-center justify-center
    border border-white/15 bg-[#0a0a0a]
    font-mono text-[10px] tracking-[0.18em] text-white/80
    transition-all duration-300
    group-hover:border-red-500/50 group-hover:text-white
  "
>
AΞ

  {/* CORNER BRACKETS */}
  <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30"></span>
  <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30"></span>
  <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30"></span>
  <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30"></span>
</span>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="border border-border-strong bg-surface px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition hover:border-red-500/35 hover:text-red-400/95"
              aria-expanded={menuOpen}
              aria-controls="system-nav-overlay"
              data-cursor="pointer"
            >
              Menu
            </button>
            <a
              href="#contact"
              data-cursor="pointer"
              className="hidden border border-border-strong bg-surface px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition hover:border-foreground/20 sm:inline-block"
            >
              Contact
            </a>
          </div>
        </div>
      </header>
      <SystemNavOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}
