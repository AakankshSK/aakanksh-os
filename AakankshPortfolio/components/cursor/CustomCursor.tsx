"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePointerFine } from "@/hooks/usePointerFine";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const spring = { stiffness: 280, damping: 44, mass: 0.65 };

export function CustomCursor() {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const scale = useSpring(1, { stiffness: 280, damping: 28 });

  useEffect(() => {
    if (!fine || reduced) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onDown = () => scale.set(0.94);
    const onUp = () => scale.set(1);

    const hoverables = () =>
      document.querySelectorAll<HTMLElement>(
        'a, button, [role="button"], [data-cursor="pointer"], input, textarea, select',
      );

    const onEnter = (el: HTMLElement) => {
      const mode = el.dataset.cursor;
      scale.set(mode === "interactive" ? 1.45 : 1.2);
      if (outerRef.current) {
        outerRef.current.style.borderColor = mode === "interactive" ? "rgba(125,249,255,0.9)" : "rgba(237,237,237,0.35)";
        outerRef.current.style.backgroundColor = mode === "interactive" ? "rgba(201,243,29,0.12)" : "rgba(10,10,10,0.9)";
      }
      if (dotRef.current) {
        dotRef.current.style.backgroundColor = mode === "interactive" ? "rgb(125,249,255)" : "rgb(237,237,237)";
      }
    };
    const onLeave = () => {
      scale.set(1);
      if (outerRef.current) {
        outerRef.current.style.borderColor = "rgba(237,237,237,0.35)";
        outerRef.current.style.backgroundColor = "rgba(10,10,10,0.9)";
      }
      if (dotRef.current) {
        dotRef.current.style.backgroundColor = "rgb(201,243,29)";
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    const observers: Array<{ el: HTMLElement; enter: () => void; leave: () => void }> = [];
    const bindHover = () => {
      observers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      observers.length = 0;
      hoverables().forEach((el) => {
        const enter = () => onEnter(el);
        const leave = () => onLeave();
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        observers.push({ el, enter, leave });
      });
    };

    bindHover();
    const mo = new MutationObserver(bindHover);
    mo.observe(document.body, { childList: true, subtree: true });

    document.documentElement.classList.add("custom-cursor");
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      mo.disconnect();
      observers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [fine, reduced, scale, x, y]);

  if (!fine || reduced) return null;

  return (
    <>
      <motion.div
        aria-hidden
        ref={outerRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[10001] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full",
          "border border-foreground/35 bg-background/90",
        )}
        style={{ x: sx, y: sy, scale }}
      />
      <motion.div
        aria-hidden
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-0.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        style={{ x, y }}
      />
    </>
  );
}
