"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";
import { allSkillLabels, skillGroups } from "@/lib/skillGroups";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Props = {
  className?: string;
  onLayersChange?: (readout: CalibrationReadout) => void;
};

export type CalibrationReadout = {
  surface: string[];
  deep: string[];
  charge: number;
  executionTick: number;
};

const COLS = 22;
const ROWS = 13;
const TOTAL = COLS * ROWS;
const INFLUENCE_PX = 128;
const MAX_SCALE_BOOST = 0.28;
const BASE_OPACITY = 0.2;
const ACTIVE_OPACITY_BOOST = 0.48;
const PULSE_SPEED = 0.38;
const PULSE_RING = 22;
const PULSE_DECAY_MS = 880;
const MAX_PULSES = 3;
const CHARGE_MS = 820;
const TICK_MS = 32;

const SPRING = { stiffness: 260, damping: 34, mass: 0.42 };

const SURFACE_TAGS = allSkillLabels;
const DEEP_TAGS = skillGroups.map((g) => g.title);

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0 + 1e-9), 0, 1);
  return t * t * (3 - 2 * t);
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  const s = dx * dx + dy * dy;
  if (!Number.isFinite(s)) return Number.POSITIVE_INFINITY;
  return Math.sqrt(Math.max(0, s));
}

function contentPointer(
  e: React.PointerEvent<HTMLElement>,
  el: HTMLElement,
  contentW: number,
  contentH: number,
): { x: number; y: number } {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const bl = parseFloat(cs.borderLeftWidth) || 0;
  const bt = parseFloat(cs.borderTopWidth) || 0;
  const pl = parseFloat(cs.paddingLeft) || 0;
  const pt = parseFloat(cs.paddingTop) || 0;
  const x = clamp(e.clientX - r.left - bl - pl, 0, Math.max(1, contentW));
  const y = clamp(e.clientY - r.top - bt - pt, 0, Math.max(1, contentH));
  return { x, y };
}

type Pulse = { ox: number; oy: number; t0: number; power: number };

function pulseContribution(cx: number, cy: number, pulses: Pulse[], now: number): number {
  let sum = 0;
  for (const p of pulses) {
    const age = now - p.t0;
    if (age < 0 || age > PULSE_DECAY_MS) continue;
    const waveR = age * PULSE_SPEED;
    const d = dist(cx, cy, p.ox, p.oy);
    const ring = Math.exp(-Math.pow((d - waveR) / PULSE_RING, 2));
    const decay = Math.exp(-age / 420);
    sum += ring * decay * p.power;
  }
  return clamp(sum, 0, 1.2);
}

function dotStyle(
  cx: number,
  cy: number,
  cursor: { x: number; y: number } | null,
  influence: number,
  charge: number,
  pulses: Pulse[],
  now: number,
): { scale: number; opacity: number; glow: number } {
  let t = 0;
  if (cursor) {
    const d = dist(cursor.x, cursor.y, cx, cy);
    const inf = influence * (1 + charge * 0.38);
    t = smoothstep(inf * 0.22, inf, inf - d);
  }
  const p = pulseContribution(cx, cy, pulses, now);
  t = clamp(t * (1 + charge * 0.22) + p * 0.92, 0, 1.15);
  const scale = clamp(1 + t * MAX_SCALE_BOOST, 1, 1 + MAX_SCALE_BOOST);
  const opacity = clamp(BASE_OPACITY + t * ACTIVE_OPACITY_BOOST, 0.08, 0.94);
  const glow = clamp(t, 0, 1);
  return { scale, opacity, glow };
}

type FieldDotProps = {
  cx: number;
  cy: number;
  cursor: { x: number; y: number } | null;
  reduced: boolean;
  charge: number;
  pulses: Pulse[];
  now: number;
};

const FieldDot = function FieldDot({ cx, cy, cursor, reduced, charge, pulses, now }: FieldDotProps) {
  const { scale, opacity, glow } = dotStyle(cx, cy, cursor, INFLUENCE_PX, charge, pulses, now);
  const s = reduced ? 1 : scale;
  const o = reduced ? BASE_OPACITY + 0.06 : opacity;
  const g = reduced ? 0 : glow;

  return (
    <span
      className="pointer-events-none block h-[5px] w-[5px] rounded-full bg-white/[0.82] sm:h-[6px] sm:w-[6px]"
      style={{
        transform: `translateZ(0) scale(${s})`,
        opacity: o,
        boxShadow:
          g > 0.06
            ? `0 0 ${5 + g * 9}px rgba(248, 113, 113, ${0.14 + g * 0.2}), 0 0 ${14 + g * 18}px rgba(248, 113, 113, ${0.06 + g * 0.08})`
            : "none",
        filter: g > 0.12 ? `blur(0.35px) brightness(${1 + g * 0.08})` : "none",
        willChange: reduced ? undefined : "transform, opacity",
      }}
      aria-hidden
    />
  );
};

function computeReadout(
  centers: { cx: number; cy: number; i: number }[],
  cursor: { x: number; y: number } | null,
  charge: number,
  pulses: Pulse[],
  now: number,
): { surface: string[]; deep: string[] } {
  const surface = new Set<string>();
  const deep = new Set<string>();
  const inf = INFLUENCE_PX * (1 + charge * 0.35);

  for (const { cx, cy, i } of centers) {
    let act = pulseContribution(cx, cy, pulses, now);
    if (cursor) {
      const d = dist(cursor.x, cursor.y, cx, cy);
      act += smoothstep(inf * 0.22, inf, inf - d) * (0.75 + charge * 0.25);
    }
    act = clamp(act, 0, 1.2);
    if (act > 0.18) surface.add(SURFACE_TAGS[i % SURFACE_TAGS.length]);
    if (act > 0.5) deep.add(DEEP_TAGS[i % DEEP_TAGS.length]);
  }

  return { surface: Array.from(surface).sort(), deep: Array.from(deep).sort() };
}

/**
 * System calibration field: awareness (proximity), execution (release pulse), intensity (hold),
 * wave propagation (rings). Optional layer readout maps active nodes to canonical skills.
 */
export function FieldResponseSurface({ className, onLayersChange }: Props) {
  const reduced = usePrefersReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 320, h: 300 });
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, SPRING);
  const smoothY = useSpring(pointerY, SPRING);

  const [pointerActive, setPointerActive] = useState(false);
  const [dotCursor, setDotCursor] = useState<{ x: number; y: number } | null>(null);
  const [charge, setCharge] = useState(0);
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [tick, setTick] = useState(0);
  const executionTickRef = useRef(0);
  const chargeRef = useRef(0);
  chargeRef.current = charge;
  const lastChargeSampleRef = useRef<number | null>(null);

  const pointerActiveRef = useRef(false);
  const reducedRef = useRef(reduced);
  pointerActiveRef.current = pointerActive;
  reducedRef.current = reduced;

  const rafPointerRef = useRef<number | null>(null);
  const pendingPointerRef = useRef<{ x: number; y: number } | null>(null);
  const pointerPrimedRef = useRef(false);

  const rafDotsRef = useRef<number | null>(null);
  const smoothXRef = useRef(smoothX);
  const smoothYRef = useRef(smoothY);
  smoothXRef.current = smoothX;
  smoothYRef.current = smoothY;

  const onLayersRef = useRef(onLayersChange);
  onLayersRef.current = onLayersChange;
  const lastEmitRef = useRef(0);
  const lastSigRef = useRef("");

  const flushDots = useCallback(() => {
    rafDotsRef.current = null;
    if (!pointerActiveRef.current || reducedRef.current) {
      setDotCursor(null);
      return;
    }
    setDotCursor({ x: smoothXRef.current.get(), y: smoothYRef.current.get() });
  }, []);

  const scheduleDots = useCallback(() => {
    if (!pointerActiveRef.current || reducedRef.current) return;
    if (rafDotsRef.current == null) {
      rafDotsRef.current = requestAnimationFrame(flushDots);
    }
  }, [flushDots]);

  useMotionValueEvent(smoothX, "change", scheduleDots);
  useMotionValueEvent(smoothY, "change", scheduleDots);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const read = () => {
      const r = el.getBoundingClientRect();
      const w = Math.max(1, r.width);
      const h = Math.max(1, r.height);
      setSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };

    read();
    const ro = new ResizeObserver(() => read());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const flushRawPointer = useCallback(() => {
    rafPointerRef.current = null;
    const p = pendingPointerRef.current;
    if (p) {
      pointerX.set(p.x);
      pointerY.set(p.y);
    }
  }, [pointerX, pointerY]);

  const centers = useMemo(() => {
    const { w, h } = size;
    const out: { cx: number; cy: number; i: number }[] = [];
    for (let i = 0; i < TOTAL; i++) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const cx = ((col + 0.5) / COLS) * w;
      const cy = ((row + 0.5) / ROWS) * h;
      out.push({ cx, cy, i });
    }
    return out;
  }, [size]);

  const frameNow = performance.now();

  /** Pulse decay + charge — only while holding or while impact waves are active */
  useEffect(() => {
    if (reduced) return;
    const shouldRun = isPointerDown || pulses.length > 0;
    if (!shouldRun) return;

    const id = window.setInterval(() => {
      const t = performance.now();
      setPulses((prev) => prev.filter((p) => t - p.t0 < PULSE_DECAY_MS));
      setTick((x) => x + 1);

      if (!isPointerDown) {
        lastChargeSampleRef.current = null;
        return;
      }
      if (lastChargeSampleRef.current == null) {
        lastChargeSampleRef.current = t;
        return;
      }
      const dt = t - lastChargeSampleRef.current;
      lastChargeSampleRef.current = t;
      setCharge((c) => clamp(c + dt / CHARGE_MS, 0, 1));
    }, TICK_MS);

    return () => clearInterval(id);
  }, [reduced, pointerActive, pulses.length, isPointerDown]);

  useEffect(() => {
    if (reduced || !onLayersRef.current) return;
    const cb = onLayersRef.current;
    const t = performance.now();
    const { surface, deep } = computeReadout(centers, dotCursor, charge, pulses, t);
    const sig = `${surface.join("\0")}|${deep.join("\0")}|${charge.toFixed(2)}|${executionTickRef.current}`;
    if (sig === lastSigRef.current && t - lastEmitRef.current < 140) return;
    lastSigRef.current = sig;
    lastEmitRef.current = t;
    cb({
      surface,
      deep,
      charge,
      executionTick: executionTickRef.current,
    });
  }, [reduced, centers, dotCursor, charge, pulses, tick]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0 || reduced) return;
      setIsPointerDown(true);
      lastChargeSampleRef.current = performance.now();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
    [reduced],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced) return;
      setIsPointerDown(false);
      lastChargeSampleRef.current = null;
      const el = gridRef.current;
      if (el) {
        const { w, h } = sizeRef.current;
        const p = contentPointer(e, el, w, h);
        const power = clamp(0.52 + chargeRef.current * 1.48, 0.45, 2.2);
        executionTickRef.current += 1;
        const t0 = performance.now();
        setPulses((prev) => [...prev, { ox: p.x, oy: p.y, t0, power }].slice(-MAX_PULSES));
      }
      setCharge(0);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
    [reduced],
  );

  const onPointerCancel = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsPointerDown(false);
    lastChargeSampleRef.current = null;
    setCharge(0);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = gridRef.current;
      if (!el || reduced) return;
      pointerActiveRef.current = true;
      setPointerActive(true);
      const { w, h } = sizeRef.current;
      const p = contentPointer(e, el, w, h);
      if (!pointerPrimedRef.current) {
        pointerPrimedRef.current = true;
        pointerX.jump(p.x);
        pointerY.jump(p.y);
        setDotCursor({ x: p.x, y: p.y });
        return;
      }
      pendingPointerRef.current = p;
      if (rafPointerRef.current == null) {
        rafPointerRef.current = requestAnimationFrame(flushRawPointer);
      }
    },
    [flushRawPointer, reduced, pointerX, pointerY],
  );

  const onPointerLeave = useCallback(() => {
    pointerPrimedRef.current = false;
    pointerActiveRef.current = false;
    setPointerActive(false);
    setIsPointerDown(false);
    lastChargeSampleRef.current = null;
    setCharge(0);
    pendingPointerRef.current = null;
    setDotCursor(null);
    if (rafPointerRef.current != null) {
      cancelAnimationFrame(rafPointerRef.current);
      rafPointerRef.current = null;
    }
    if (rafDotsRef.current != null) {
      cancelAnimationFrame(rafDotsRef.current);
      rafDotsRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafPointerRef.current != null) cancelAnimationFrame(rafPointerRef.current);
      if (rafDotsRef.current != null) cancelAnimationFrame(rafDotsRef.current);
    };
  }, []);

  const glowRadiusTight = Math.min(
    INFLUENCE_PX * 1.15 * (1 + charge * 0.22),
    Math.max(size.w, size.h) * 0.42,
  );
  const glowRadiusSoft = glowRadiusTight * 1.85;

  const glowSharp = useMotionTemplate`radial-gradient(${glowRadiusTight}px at ${smoothX}px ${smoothY}px, rgba(248,113,113,0.11) 0%, rgba(248,113,113,0.04) 45%, transparent 68%)`;
  const glowDiffuse = useMotionTemplate`radial-gradient(${glowRadiusSoft}px at ${smoothX}px ${smoothY}px, rgba(248,113,113,0.07) 0%, transparent 62%)`;

  return (
    <div
      className={cn(
        "relative isolate min-h-[300px] w-full overflow-hidden rounded-sm border border-border-strong bg-[#070708]",
        className,
      )}
      role="img"
      aria-label="System calibration: proximity is awareness; release is execution; hold builds intensity; waves show impact"
    >
      <div
        ref={gridRef}
        className="relative grid h-full min-h-0 w-full touch-none gap-y-2.5 p-3 sm:gap-y-3 sm:p-4"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          perspective: "720px",
        }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
      >
        <motion.div
          className="pointer-events-none absolute inset-3 z-0 sm:inset-4"
          initial={false}
          animate={{ opacity: pointerActive && !reduced ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: glowDiffuse, filter: "blur(28px)", opacity: 0.85 }}
          />
          <motion.div className="absolute inset-0" style={{ background: glowSharp }} />
        </motion.div>

        {isPointerDown && charge > 0.04 && !reduced ? (
          <motion.div
            className="pointer-events-none absolute inset-3 z-[2] sm:inset-4"
            initial={false}
            aria-hidden
          >
            <motion.div
              className="absolute rounded-full border border-red-500/22 bg-red-500/[0.03]"
              style={{
                width: 24 + charge * 56,
                height: 24 + charge * 56,
                left: smoothX,
                top: smoothY,
                x: "-50%",
                y: "-50%",
                boxShadow: "0 0 28px -8px rgba(248,113,113,0.18)",
              }}
            />
          </motion.div>
        ) : null}

        {centers.map(({ cx, cy, i }) => (
          <div
            key={i}
            className="relative z-[1] flex items-center justify-center [transform-style:preserve-3d]"
          >
            <FieldDot
              cx={cx}
              cy={cy}
              cursor={reduced ? null : dotCursor}
              reduced={reduced}
              charge={reduced ? 0 : charge}
              pulses={reduced ? [] : pulses}
              now={frameNow}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
