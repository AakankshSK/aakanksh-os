"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { skillGroups } from "@/lib/skillGroups";
import type { CalibrationReadout } from "@/components/skills/FieldResponseSurface";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useMaxWidth768 } from "@/hooks/useMaxWidth768";
import { cn } from "@/lib/cn";

/** Reserved box — same footprint for loading and loaded field (reduces CLS). */
const FIELD_SLOT_CLASS =
  "relative w-full max-w-full overflow-hidden rounded-lg border border-border-strong bg-[#070708] shadow-lift-sm " +
  "aspect-[16/10] min-h-[260px] sm:min-h-[280px] max-h-[min(52vh,32rem)]";

const FieldResponseSurface = dynamic(
  () => import("@/components/skills/FieldResponseSurface").then((m) => m.FieldResponseSurface),
  { ssr: false, loading: () => <FieldFallback /> },
);

const initialReadout: CalibrationReadout = {
  surface: [],
  deep: [],
  charge: 0,
  executionTick: 0,
};

function FieldFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.04] to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/70">
          Calibration · loading
        </span>
      </div>
    </div>
  );
}

function CalibrationReadoutPanel({ readout }: { readout: CalibrationReadout }) {
  const pct = Math.round(readout.charge * 100);
  return (
    <div className="space-y-8">
      <dl className="grid gap-6 border-t border-border-strong pt-6 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-500/80">Awareness layer</dt>
          <dd className="mt-3 break-words font-mono text-xs leading-relaxed text-muted/90">
            {readout.surface.length ? readout.surface.join(" · ") : "— idle —"}
          </dd>
          <p className="mt-2 text-[10px] normal-case leading-relaxed text-muted/55">
            Activated nodes map to the surface stack (individual tools and runtimes).
          </p>
        </div>
        <div className="min-w-0">
          <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-500/80">Deep system</dt>
          <dd className="mt-3 break-words font-mono text-xs leading-relaxed text-muted/90">
            {readout.deep.length ? readout.deep.join(" · ") : "— latent —"}
          </dd>
          <p className="mt-2 text-[10px] normal-case leading-relaxed text-muted/55">
            Stronger coupling surfaces architectural layers — how pieces compose.
          </p>
        </div>
      </dl>

      <div className="flex flex-col gap-4 border-t border-border-strong pt-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">Intensity</p>
          <div
            className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/[0.06]"
            role="meter"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Sustained hold intensity"
          >
            <div
              className="h-full rounded-full bg-red-500/55 transition-[width] duration-75 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted/75">
          Executions <span className="tabular-nums text-foreground/80">{readout.executionTick}</span>
        </p>
      </div>
    </div>
  );
}

function FieldSurfaceBlock({
  reduced,
  onReadout,
}: {
  reduced: boolean;
  onReadout: (r: CalibrationReadout) => void;
}) {
  return (
    <div className={cn(FIELD_SLOT_CLASS, "relative touch-none")}>
      <FieldResponseSurface
        className="absolute inset-0 h-full min-h-0 w-full rounded-none border-0 bg-transparent shadow-none"
        onLayersChange={onReadout}
      />
      <span className="sr-only">
        {reduced
          ? "System calibration field: reduced motion."
          : "Calibration module: proximity is awareness, click releases execution, hold scales intensity, rings show propagation."}
      </span>
    </div>
  );
}

function SkillPanel({
  group,
  index,
  reduced,
}: {
  group: (typeof skillGroups)[number];
  index: number;
  reduced: boolean;
}) {
  const [active, setActive] = useState(false);
  const isMobile = useMaxWidth768();

  return (
    <motion.article
      className={cn(
        "group relative min-w-0 h-[240px] overflow-hidden border border-white/10 bg-[linear-gradient(165deg,rgba(24,24,26,0.98)_0%,rgba(12,12,13,0.96)_54%,rgba(8,8,9,0.98)_100%)] p-5",
        "shadow-[inset_0_0_20px_rgba(255,255,255,0.03),inset_0_1px_0_rgba(255,255,255,0.05)]",
        "flex flex-col justify-between",
      )}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      whileHover={
        reduced || isMobile
          ? undefined
          : {
              y: -4,
              scale: 1.01,
              boxShadow:
                "inset 0 0 22px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.07), 0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(255,0,0,0.08)",
            }
      }
      whileTap={reduced || isMobile ? undefined : { scale: 1.02 }}
      animate={
        active
          ? {
              borderColor: "rgba(239,68,68,0.42)",
              background:
                "linear-gradient(165deg, rgba(28,22,22,0.98) 0%, rgba(14,11,11,0.96) 54%, rgba(9,8,8,0.99) 100%)",
            }
          : { borderColor: "rgba(255,255,255,0.08)" }
      }
      transition={
        reduced || isMobile
          ? { duration: 0.35, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }
          : { type: "spring", stiffness: 280, damping: 26, mass: 0.6 }
      }
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 0.8px, transparent 0)",
          backgroundSize: "4px 4px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-[3px] border border-white/[0.04]" aria-hidden />
      <span
        className={cn(
          "pointer-events-none absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-red-500/35 transition-all duration-300",
          active && "shadow-[0_0_10px_rgba(239,68,68,0.45)] bg-red-500/70",
        )}
        aria-hidden
      />
      <span className="pointer-events-none absolute left-2 top-2 h-2 w-2 border-l border-t border-white/[0.22]" aria-hidden />
      <span className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r border-white/[0.22]" aria-hidden />

      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/72">
          module {String(index + 1).padStart(2, "0")}
        </p>
        <h3
          className={cn(
            "mt-2 text-base font-medium leading-snug text-foreground/92 transition-colors sm:text-lg",
            active && "text-foreground",
          )}
        >
          {group.title}
        </h3>
      </div>

      <div className="mt-4 border-t border-dashed border-white/[0.06]" />

      <motion.ul
        className="mt-4 space-y-2"
        initial={false}
        animate={active && !reduced ? "active" : "idle"}
        variants={{
          idle: { transition: { staggerChildren: 0 } },
          active: { transition: { staggerChildren: 0.035, delayChildren: 0.03 } },
        }}
      >
        {group.items.map((item) => (
          <motion.li
            key={item}
            className="group/item flex items-center justify-between border-t border-dashed border-white/[0.06] pt-2 text-sm leading-snug text-muted transition-colors hover:text-foreground/95"
            variants={{
              idle: { opacity: 0.92, y: 0 },
              active: { opacity: 1, y: -2 },
            }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="transition-transform duration-200 group-hover/item:translate-x-[3px]">{item}</span>
            <span className="h-px w-4 bg-white/[0.14] transition-all duration-200 group-hover/item:w-6 group-hover/item:bg-red-400/45" />
          </motion.li>
        ))}
      </motion.ul>
    </motion.article>
  );
}

export function Skills() {
  const reduced = usePrefersReducedMotion();
  const [readout, setReadout] = useState<CalibrationReadout>(initialReadout);
  const handleReadout = useCallback((r: CalibrationReadout) => setReadout(r), []);

  return (
    <section
      id="skills"
      className="overflow-x-hidden border-t border-border bg-background px-4 py-[var(--section-y-mobile)] sm:px-8 sm:py-[var(--section-y-desktop)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="max-w-3xl">
          <p className="kicker text-accent2">System calibration</p>
          <h2 className="heading-section mt-6 max-w-[14ch]">SYSTEM CALIBRATION</h2>
          <div className="mt-6 space-y-4 text-sm leading-[var(--prose-rhythm)] text-muted sm:text-base">
            <p>This module reflects how I design systems.</p>
            <p>
              Proximity activates awareness.
              <br />
              Input drives execution.
              <br />
              Sustained interaction scales intensity.
            </p>
            <p className="text-foreground/90">Each signal propagates with control — not noise.</p>
          </div>

          <dl className="mt-10 grid gap-6 border-t border-border-strong pt-10 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-500/85">Proximity</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">Awareness — the lattice senses where attention is.</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-500/85">Click / release</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">Execution — input signals commit and propagate.</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-500/85">Hold</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">Intensity — sustained pressure scales system response.</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-500/85">Wave</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">Impact — propagation shows how a change moves through the grid.</dd>
            </div>
          </dl>
        </header>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-12">
          <div className="lg:col-span-4 lg:pt-1">
            <p className="kicker text-accent2">Live readout</p>
            <p className="mt-4 max-w-sm text-sm leading-[var(--prose-rhythm)] text-muted">
              {reduced
                ? "Reduced motion: the field stays minimal. Layer tags below still describe the same system map."
                : "Interact with the field — the readout mirrors activation: light coupling shows the surface stack; stronger coupling exposes deeper architectural layers."}
            </p>
            <div className="mt-8">
              <CalibrationReadoutPanel readout={readout} />
            </div>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <FieldSurfaceBlock reduced={reduced} onReadout={handleReadout} />
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-14 lg:mt-20 lg:pt-16">
          <div className="mx-auto max-w-6xl">
            <header className="mb-8 border-b border-white/[0.06] pb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/72">SUBSYSTEMS</p>
              <h3 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                Capability Matrix.
              </h3>
            </header>
          </div>
          <div className="mx-auto max-w-6xl border-t border-white/[0.05] pt-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {skillGroups.map((group, index) => (
                <div key={group.id} className="min-w-0">
                  <SkillPanel group={group} index={index} reduced={reduced} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
