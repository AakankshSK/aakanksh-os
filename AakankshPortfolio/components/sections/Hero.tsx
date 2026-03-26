"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroTypewriter } from "@/components/hero/HeroTypewriter";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { revealText, staggerReveal, withContext } from "@/lib/animations";

const SystemScene = dynamic(
  () => import("@/components/hero/SystemScene").then((m) => m.SystemScene),
  { ssr: false },
);

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const dispose = withContext(root.current, () => {
      const shell = root.current?.querySelector<HTMLElement>(".hero-shell");
      const reactive = root.current?.querySelector<HTMLElement>(".hero-reactive");
      if (!shell) return;

      if (!reduced) {
        revealText(".hero-kicker-line", 0.02, 0.78);
        staggerReveal(".hero-line", { delay: 0.06, duration: 0.88, stagger: 0.1, y: 18 });
        staggerReveal(".hero-typewriter-slot, .hero-actions .hero-action-slot", {
          delay: 0.2,
          duration: 0.72,
          stagger: 0.08,
          y: 12,
        });
      }

      if (reduced) return;

      const toX = gsap.quickTo(shell, "x", { duration: 0.48, ease: "power3.out" });
      const toY = gsap.quickTo(shell, "y", { duration: 0.48, ease: "power3.out" });
      const bgX = reactive ? gsap.quickTo(reactive, "x", { duration: 0.8, ease: "power3.out" }) : null;
      const bgY = reactive ? gsap.quickTo(reactive, "y", { duration: 0.8, ease: "power3.out" }) : null;

      const onMove = (e: MouseEvent) => {
        const r = root.current!.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        toX(nx * 18);
        toY(ny * 12);
        bgX?.(nx * -12);
        bgY?.(ny * -8);
      };

      const onLeave = () => {
        toX(0);
        toY(0);
        bgX?.(0);
        bgY?.(0);
      };

      root.current?.addEventListener("mousemove", onMove);
      root.current?.addEventListener("mouseleave", onLeave);

      return () => {
        root.current?.removeEventListener("mousemove", onMove);
        root.current?.removeEventListener("mouseleave", onLeave);
      };
    });
    return () => dispose();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate min-h-[100dvh] overflow-hidden bg-background px-4 pb-20 pt-[clamp(5.25rem,11vh,6.75rem)] sm:px-8"
    >
      <div className="hero-reactive pointer-events-none absolute inset-0 z-0">
        <SystemScene />
        <HeroBackdrop />
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-background/45 to-background" />

      <div className="hero-stage relative z-10 mx-auto max-w-[1400px]">
        <div className="hero-shell grid gap-16 will-change-transform lg:grid-cols-12 lg:gap-8 lg:pt-8">
          <div className="lg:col-span-7 lg:col-start-2">
            <p className="hero-kicker kicker overflow-hidden text-foreground/55">
              <span className="hero-kicker-line inline-block will-change-transform">
                Practice · {new Date().getFullYear()}
              </span>
            </p>

            <h1 className="heading-display mt-8 text-[clamp(2.75rem,9.2vw,6.25rem)] leading-[0.98]">
              <span className="block overflow-hidden">
                <span className="hero-line block will-change-transform">Aakanksh S</span>
              </span>
              <span className="mt-[0.06em] block overflow-hidden">
                <span className="hero-line block will-change-transform">
                   <span className="text-accent">Kallihal</span>.
                </span>
              </span>
            </h1>

            <div className="hero-typewriter-slot mt-10 overflow-hidden will-change-transform">
              <HeroTypewriter className="text-muted" />
            </div>

            <div className="hero-actions mt-12 flex flex-wrap items-center gap-6">
              <div className="hero-action-slot overflow-hidden">
                <Magnetic>
                  <a
                    href="#projects"
                    data-cursor="pointer"
                    className="inline-flex items-center justify-center border-b-2 border-accent pb-1 font-medium text-foreground transition hover:border-accent-muted"
                  >
                    Selected work
                  </a>
                </Magnetic>
              </div>
              <div className="hero-action-slot overflow-hidden">
                <Magnetic strength={0.14}>
                  <a href="#contact" data-cursor="pointer" className="text-sm font-medium text-muted transition hover:text-foreground">
                    Start a conversation
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <div className="overflow-hidden lg:mt-24">
              <div className="surface-raised hero-line relative rounded-sm p-8 will-change-transform">
                <p className="kicker text-accent2">Statement</p>
                <p className="mt-6 font-display text-xl font-medium leading-snug text-foreground sm:text-2xl">
                  Software should read as clearly as the brief behind it.
                </p>
                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-8">
                  <div>
                    <p className="font-display text-3xl font-medium text-foreground">02</p>
                    <p className="mt-1 kicker !normal-case !tracking-normal text-muted">AI systems built</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl font-medium text-accent2">01</p>
                    <p className="mt-1 kicker !normal-case !tracking-normal text-muted">patent-qualified project</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
