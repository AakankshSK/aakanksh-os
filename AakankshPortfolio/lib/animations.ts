"use client";

import { gsap } from "gsap";

type CtxScope = Element | string | null;

export const EASE = {
  p3: "power3.out",
  p4: "power4.out",
  expo: "expo.out",
} as const;

export function withContext(scope: CtxScope, fn: () => void | (() => void)) {
  const ctx = gsap.context(fn, scope ?? undefined);
  return () => ctx.revert();
}

type EntranceOpts = { immediateRender?: boolean };

/** Motion only — no opacity / autoAlpha (avoids stuck invisible content). */
export function fadeUp(target: gsap.TweenTarget, delay = 0, duration = 0.75, opts: EntranceOpts = {}) {
  const { immediateRender = true } = opts;
  return gsap.fromTo(
    target,
    { y: 28 },
    { y: 0, delay, duration, ease: EASE.p3, immediateRender },
  );
}

export function revealText(target: gsap.TweenTarget, delay = 0, duration = 0.85, opts: EntranceOpts = {}) {
  const { immediateRender = true } = opts;
  return gsap.fromTo(
    target,
    { yPercent: 108 },
    { yPercent: 0, delay, duration, ease: EASE.p4, immediateRender },
  );
}

export const textReveal = revealText;

export function staggerReveal(
  target: gsap.TweenTarget,
  opts: { delay?: number; duration?: number; stagger?: number; y?: number; immediateRender?: boolean } = {},
) {
  const { delay = 0, duration = 0.78, stagger = 0.1, y = 22, immediateRender = true } = opts;
  return gsap.fromTo(
    target,
    { y },
    { y: 0, delay, duration, stagger, ease: EASE.p3, immediateRender },
  );
}

export function scaleIn(target: gsap.TweenTarget, delay = 0, duration = 0.78, opts: EntranceOpts = {}) {
  const { immediateRender = true } = opts;
  return gsap.fromTo(
    target,
    { scale: 0.98, y: 10 },
    { scale: 1, y: 0, delay, duration, ease: EASE.expo, immediateRender },
  );
}
