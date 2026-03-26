"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePointerFine } from "@/hooks/usePointerFine";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  children: React.ReactNode;
  strength?: number;
  className?: string;
};

/** GSAP magnetic wrapper with quickTo for low overhead. */
export function Magnetic({ children, strength = 0.18, className }: Props) {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;

    const toX = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const toY = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      toX(dx * strength);
      toY(dy * strength);
    };

    const onLeave = () => {
      toX(0);
      toY(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [fine, reduced, strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
