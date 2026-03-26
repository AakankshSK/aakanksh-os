"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

type ApiResponse = {
  response?: string;
  action?: string;
  error?: string;
  status?: "success" | "fallback" | "error";
};

const ACTION_DELAY_MS = 260;
const START_OUTPUT_DELAY_MS = 180;
const TYPE_INTERVAL_MS = 12;
const PLACEHOLDERS = ["ask about projects...", "check skills...", "internship status..."];
const SUGGESTIONS = ["projects", "skills", "about", "contact", "internship"];

function runAction(action?: string) {
  if (!action) return;

  const scroll = (id: string) => {
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (action === "scrollToProjects") scroll("projects");
  else if (action === "scrollToContact") scroll("contact");
  else if (action === "scrollToAbout") scroll("about");
  else if (action === "scrollToSkills") scroll("skills");
  else if (action === "openGithub") window.open(site.social.github, "_blank", "noopener,noreferrer");
}

export function SystemQueryPanel() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string>("");
  const [displayed, setDisplayed] = useState<string>("");
  const [outputKey, setOutputKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "fallback" | "error">("success");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLabel, setActionLabel] = useState<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [logStep, setLogStep] = useState(0);
  const actionTimerRef = useRef<number | null>(null);
  const typingTimerRef = useRef<number | null>(null);
  const startTimerRef = useRef<number | null>(null);

  const hasOutput = useMemo(() => displayed.length > 0, [displayed]);
  const lines = useMemo(() => displayed.split("\n").filter(Boolean), [displayed]);
  const loadingLogs = ["routing query...", "fetching data...", "rendering response..."];

  useEffect(() => {
    if (query.trim() || loading) return;
    const id = window.setInterval(
      () => setPlaceholderIndex((idx) => (idx + 1) % PLACEHOLDERS.length),
      2200,
    );
    return () => window.clearInterval(id);
  }, [query, loading]);

  useEffect(() => {
    return () => {
      if (actionTimerRef.current != null) window.clearTimeout(actionTimerRef.current);
      if (typingTimerRef.current != null) window.clearInterval(typingTimerRef.current);
      if (startTimerRef.current != null) window.clearTimeout(startTimerRef.current);
    };
  }, []);

  async function runQuery(raw: string) {
    const q = raw.trim();
    if (!q || loading) return;
    setQuery(q);
    setLoading(true);
    setLogStep(0);
    setError(null);
    setStatus("success");
    setResponse("");
    setDisplayed("");
    setActionLabel(null);
    if (typingTimerRef.current != null) window.clearInterval(typingTimerRef.current);
    if (startTimerRef.current != null) window.clearTimeout(startTimerRef.current);
    if (actionTimerRef.current != null) window.clearTimeout(actionTimerRef.current);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      let data: ApiResponse = {};
      try {
        data = (await res.json()) as ApiResponse;
      } catch {
        setError(`Request failed (${res.status})`);
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? data.response ?? `Request failed (${res.status})`);
        return;
      }
      if (data.response) {
        setStatus(data.status ?? "success");
        setResponse(data.response);
        setOutputKey((k) => k + 1);
        const nextAction = data.action;
        if (nextAction) {
          setActionLabel(nextAction);
          actionTimerRef.current = window.setTimeout(() => runAction(nextAction), ACTION_DELAY_MS);
        }
      } else setError("No output");
    } catch {
      setStatus("error");
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await runQuery(query);
  }

  useEffect(() => {
    if (!loading) return;
    const id = window.setInterval(() => {
      setLogStep((n) => (n + 1) % loadingLogs.length);
    }, 520);
    return () => window.clearInterval(id);
  }, [loading, loadingLogs.length]);

  useEffect(() => {
    if (!response) return;
    if (typingTimerRef.current != null) window.clearInterval(typingTimerRef.current);
    if (startTimerRef.current != null) window.clearTimeout(startTimerRef.current);
    setDisplayed("");

    startTimerRef.current = window.setTimeout(() => {
      let i = 0;
      typingTimerRef.current = window.setInterval(() => {
        i += 1;
        setDisplayed(response.slice(0, i));
        if (i >= response.length && typingTimerRef.current != null) {
          window.clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
      }, TYPE_INTERVAL_MS);
    }, START_OUTPUT_DELAY_MS);

    return () => {
      if (typingTimerRef.current != null) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      if (startTimerRef.current != null) {
        window.clearTimeout(startTimerRef.current);
        startTimerRef.current = null;
      }
    };
  }, [response]);

  return (
    <div
      className="fixed bottom-6 right-4 z-50 w-[min(94vw,460px)] sm:bottom-8 sm:right-8"
      role="region"
      aria-label="System query"
    >
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-xl border border-white/[0.1] bg-[linear-gradient(160deg,rgba(16,16,18,0.92)_0%,rgba(8,8,9,0.95)_100%)] text-foreground",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_54px_-30px_rgba(0,0,0,0.65)]",
        )}
        animate={{ scale: focused ? 1.01 : 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 24, mass: 0.55 }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(70% 60% at 50% 0%, rgba(239,68,68,0.08), transparent 65%)" }}
          aria-hidden
        />

        <div className="relative border-b border-white/[0.08] px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="kicker text-red-500/80">QUERY</p>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">/api/assistant</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="relative p-4">
          <label htmlFor="system-query" className="sr-only">
            Query string
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <input
                id="system-query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={PLACEHOLDERS[placeholderIndex]}
                disabled={loading}
                autoComplete="off"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className={cn(
                  "min-w-0 w-full rounded-md border border-white/[0.1] bg-black/[0.26] px-3 py-3",
                  "font-mono text-[13px] text-foreground placeholder:text-muted/45",
                  "outline-none transition-[border-color,box-shadow] duration-250",
                  "focus:border-red-400/35 focus:ring-1 focus:ring-red-500/15",
                  "disabled:opacity-60",
                )}
                data-cursor="pointer"
              />
              <span
                className="pointer-events-none absolute bottom-2 right-2 h-3 w-px bg-red-400/75"
                style={{ animation: "hero-typewriter-cursor 1.05s ease-in-out infinite" }}
                aria-hidden
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={cn(
                "shrink-0 rounded-md border border-white/[0.14] bg-black/[0.3] px-4 py-3",
                "font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/92",
                "transition-all duration-200 hover:-translate-y-[1px] hover:border-red-400/35 hover:shadow-[0_10px_28px_-18px_rgba(239,68,68,0.5)]",
                "disabled:cursor-not-allowed disabled:opacity-45",
              )}
              data-cursor="pointer"
            >
              {loading ? "RUNNING" : "RUN"}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                disabled={loading}
                onClick={() => void runQuery(item)}
                className="rounded-full border border-white/[0.1] bg-black/[0.22] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-red-400/28 hover:text-foreground disabled:opacity-40"
              >
                {item}
              </button>
            ))}
          </div>
        </form>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative border-t border-white/[0.08] px-4 py-4"
            >
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-red-500/85">STATUS: ERROR</p>
              <p className="font-mono text-[12px] leading-relaxed text-accent">→ {error}</p>
            </motion.div>
          ) : null}
          {((hasOutput && !error) || loading) ? (
            <motion.div
              key={outputKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden border-t border-white/[0.08] px-4 py-4"
            >
              {loading ? (
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 15%, rgba(255,255,255,0.07) 50%, transparent 85%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.35s linear infinite",
                  }}
                  aria-hidden
                />
              ) : null}
              <style jsx>{`
                @keyframes shimmer {
                  0% {
                    background-position: 120% 0;
                  }
                  100% {
                    background-position: -120% 0;
                  }
                }
              `}</style>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-red-500/85">
                STATUS: {loading ? "PROCESSING" : status.toUpperCase()}
              </p>
              <div className="text-sm leading-[var(--prose-rhythm)] text-foreground/90">
                {loading && !hasOutput ? (
                  <div className="space-y-2">
                    <p className="font-mono text-[12px] text-muted">processing...</p>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400/75" />
                      <span className="font-mono text-[11px] text-muted/85">{loadingLogs[logStep]}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/80">[ RESPONSE ]</p>
                    {lines.map((line, idx) => (
                      <motion.p
                        key={`${outputKey}-${idx}-${line}`}
                        initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 0.22, delay: idx * 0.03, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          "whitespace-pre-wrap",
                          line.startsWith("-") || line.startsWith("→") ? "pl-1 text-foreground/95" : "",
                        )}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                )}
              </div>
              {actionLabel ? (
                <p className="mt-3 border-t border-white/[0.08] pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-red-500/85">
                  ACTION :: {actionLabel}
                </p>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
