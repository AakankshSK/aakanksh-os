"use client";

import { useSyncExternalStore } from "react";

const MEDIA = "(max-width: 768px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(MEDIA);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(MEDIA).matches;
}

function getServerSnapshot() {
  return false;
}

/** True when viewport width is at most 768px (matches mobile CSS breakpoint). */
export function useMaxWidth768() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
