"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const pool = "⟨◆∴⌁≈⟩%&$#@";

/** Brief decorative shuffle on hover; restores original. */
export function useGlitchText(text: string) {
  const [display, setDisplay] = useState(text);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setDisplay(text);
  }, [text]);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const run = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    let frames = 0;
    timerRef.current = setInterval(() => {
      frames += 1;
      if (frames > 14) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDisplay(text);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((c) => {
            if (c === " " || c === "." || c === "—" || c === "'") return c;
            return Math.random() > 0.42 ? c : pool[Math.floor(Math.random() * pool.length)] ?? c;
          })
          .join(""),
      );
    }, 40);
  }, [text]);

  return { display, run };
}
