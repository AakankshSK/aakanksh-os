"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/ui/Magnetic";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { usePointerFine } from "@/hooks/usePointerFine";

const tiltSpring = { stiffness: 280, damping: 42, mass: 0.9 };
const hoverSpring = { stiffness: 240, damping: 36, mass: 0.72 };
const fadeSpring = { stiffness: 200, damping: 38, mass: 0.65 };

const MAX_TILT_X = 6.5;
const MAX_TILT_Y = 7.5;

type Props = {
  project: Project;
  priority?: boolean;
  className?: string;
};

export function Project3DCard({ project, priority, className }: Props) {
  const reduced = usePrefersReducedMotion();
  const fine = usePointerFine();
  const rootRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [touchDetail, setTouchDetail] = useState(false);

  const tiltX = useSpring(0, tiltSpring);
  const tiltY = useSpring(0, tiltSpring);
  const lift = useSpring(0, hoverSpring);
  const scale = useSpring(1, hoverSpring);
  const frontOpacity = useSpring(1, fadeSpring);
  const detailOpacity = useSpring(0, fadeSpring);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowBg = useMotionTemplate`radial-gradient(420px circle at ${glowX}px ${glowY}px, rgba(125,249,255,0.11), rgba(201,243,29,0.03) 38%, transparent 62%)`;

  const showDetail = fine ? hovering : touchDetail;

  useEffect(() => {
    if (fine || reduced) return;
    const open = touchDetail;
    lift.set(open ? 10 : 0);
    scale.set(open ? 1.012 : 1);
    frontOpacity.set(open ? 0 : 1);
    detailOpacity.set(open ? 1 : 0);
  }, [touchDetail, fine, reduced, lift, scale, frontOpacity, detailOpacity]);

  const applyHoverVisuals = useCallback(
    (active: boolean) => {
      if (reduced) return;
      lift.set(active ? 14 : 0);
      scale.set(active ? 1.022 : 1);
      frontOpacity.set(active ? 0 : 1);
      detailOpacity.set(active ? 1 : 0);
    },
    [detailOpacity, frontOpacity, lift, reduced, scale],
  );

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !fine) return;
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tiltX.set(-py * MAX_TILT_X * 2);
      tiltY.set(px * MAX_TILT_Y * 2);
      glowX.set(e.clientX - r.left);
      glowY.set(e.clientY - r.top);
    },
    [fine, reduced, tiltX, tiltY, glowX, glowY],
  );

  const onEnter = useCallback(() => {
    if (!fine || reduced) return;
    setHovering(true);
    applyHoverVisuals(true);
  }, [applyHoverVisuals, fine, reduced]);

  const onLeave = useCallback(() => {
    setHovering(false);
    tiltX.set(0);
    tiltY.set(0);
    if (!reduced) {
      applyHoverVisuals(false);
    }
  }, [applyHoverVisuals, reduced, tiltX, tiltY]);

  const accentBorder =
    project.accentKey === "primary" ? "border-accent/25" : "border-accent2/25";
  const accentTag =
    project.accentKey === "primary"
      ? "border-accent/35 text-accent/90"
      : "border-accent2/35 text-accent2/90";

  if (reduced) {
    return (
      <div className={cn("grid gap-8 overflow-hidden rounded-sm border border-border-strong bg-surface shadow-lift-sm lg:grid-cols-12 lg:items-stretch", className)}>
        <div className="relative aspect-[4/3] w-full lg:col-span-6 lg:aspect-auto lg:min-h-[280px]">
          <Image src={project.imageSrc} alt="" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" priority={priority} />
        </div>
        <div className="flex flex-col p-6 sm:p-8 lg:col-span-6">
          <p className="kicker text-muted">{project.subtitle}</p>
          <h3 className="mt-3 font-display text-2xl font-medium text-foreground sm:text-[1.85rem]">{project.title}</h3>
          <p className="mt-4 text-sm leading-[var(--prose-rhythm)] text-muted">{project.description}</p>
          <p className="mt-5 text-sm leading-[var(--prose-rhythm)] text-muted/90">{project.technicalBreakdown}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className={cn("rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em]", accentTag)}>
                {t}
              </span>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted">
            {project.metadata.year} · {project.metadata.scope}
            {project.metadata.platform ? ` · ${project.metadata.platform}` : ""}
          </p>
          <ul className="mt-5 space-y-2 text-sm text-muted">
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="pointer"
                className={cn(
                  "inline-flex px-5 py-2.5 text-sm font-medium text-background",
                  project.accentKey === "primary" ? "bg-accent" : "bg-accent2",
                )}
              >
                View live
              </a>
            </Magnetic>
            {project.caseUrl ? (
              <a
                href={project.caseUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="pointer"
                className="inline-flex border border-border-strong px-5 py-2.5 text-sm font-medium text-foreground"
              >
                Source
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("[perspective:1400px]", className)}
      style={{ perspectiveOrigin: "50% 50%" }}
    >
      <motion.div
        ref={rootRef}
        data-cursor="interactive"
        className={cn(
          "relative cursor-crosshair overflow-hidden rounded-sm border bg-surface shadow-lift-sm",
          accentBorder,
        )}
        style={{
          rotateX: fine ? tiltX : 0,
          rotateY: fine ? tiltY : 0,
          translateZ: lift,
          scale,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
        role="group"
        aria-label={`${project.title} case study`}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-sm"
          style={{ background: glowBg }}
          animate={{ opacity: fine && hovering ? 1 : 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="project-image relative aspect-[4/3] w-full sm:aspect-[16/10]">
          <Image
            src={project.imageSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 70vw, 100vw"
            priority={priority}
          />

          <motion.div
            className={cn(
              "absolute inset-0 z-[1] flex flex-col justify-end bg-gradient-to-t from-background via-background/55 to-transparent p-6 sm:p-8",
              showDetail && "pointer-events-none",
            )}
            style={{ opacity: frontOpacity }}
          >
            <p className="kicker text-foreground/55">{project.subtitle}</p>
            <h3 className="mt-3 font-display text-[clamp(1.65rem,4.5vw,2.35rem)] font-medium leading-tight text-foreground">
              {project.title}
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-[var(--prose-rhythm)] text-muted line-clamp-3 sm:line-clamp-none">
              {project.description}
            </p>
          </motion.div>

          <motion.div
            className={cn(
              "absolute inset-0 z-[2] flex flex-col overflow-y-auto bg-background/[0.93] p-6 sm:p-8",
              !showDetail && "pointer-events-none",
            )}
            style={{ opacity: detailOpacity }}
          >
            <p className="kicker text-accent2">Technical</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className={cn(
                    "rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
                    accentTag,
                  )}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-[var(--prose-rhythm)] text-foreground/88">{project.technicalBreakdown}</p>
            <p className="mt-5 font-mono text-[11px] leading-relaxed text-muted">
              <span className="text-foreground/70">{project.metadata.year}</span>
              <span className="mx-2 text-border-strong">/</span>
              {project.metadata.scope}
              {project.metadata.platform ? (
                <>
                  <span className="mx-2 text-border-strong">/</span>
                  {project.metadata.platform}
                </>
              ) : null}
            </p>
            <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm text-muted">
              {project.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className={cn("mt-2 h-px w-4 shrink-0", project.accentKey === "primary" ? "bg-accent" : "bg-accent2")} aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <Magnetic>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="pointer"
                  className={cn(
                    "inline-flex px-5 py-2.5 text-sm font-medium text-background",
                    project.accentKey === "primary" ? "bg-accent" : "bg-accent2",
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  View live
                </a>
              </Magnetic>
              {project.caseUrl ? (
                <a
                  href={project.caseUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="pointer"
                  className="inline-flex border border-border-strong bg-surface px-5 py-2.5 text-sm font-medium text-foreground"
                  onClick={(e) => e.stopPropagation()}
                >
                  Source
                </a>
              ) : null}
            </div>
          </motion.div>
        </div>

        {!fine && !reduced ? (
          <button
            type="button"
            data-cursor="pointer"
            onClick={() => setTouchDetail((v) => !v)}
            className="w-full border-t border-border bg-surface-2 px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            {touchDetail ? "Overview" : "Technical detail"}
          </button>
        ) : null}
      </motion.div>
    </div>
  );
}
