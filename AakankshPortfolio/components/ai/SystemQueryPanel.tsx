"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import { useMaxWidth768 } from "@/hooks/useMaxWidth768";

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

function QueryOutputSection({
  error,
  hasOutput,
  loading,
  displayed,
  outputKey,
  status,
  logStep,
  loadingLogs,
  actionLabel,
  simpleMotion,
}: {
  error: string | null;
  hasOutput: boolean;
  loading: boolean;
  displayed: string;
  outputKey: number;
  status: "success" | "fallback" | "error";
  logStep: number;
  loadingLogs: string[];
  actionLabel: string | null;
  simpleMotion: boolean;
}) {
  const lines = useMemo(() => displayed.split("\n").filter(Boolean), [displayed]);

  return (
    <AnimatePresence mode="wait">
      {error ? (
        <motion.div
          key="err"
          initial={simpleMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={simpleMotion ? undefined : { opacity: 0, y: -4 }}
          transition={{ duration: simpleMotion ? 0.12 : 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative border-t border-white/[0.08] px-4 py-4"
        >
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-red-500/85">STATUS: ERROR</p>
          <p className="font-mono text-[12px] leading-relaxed text-accent">→ {error}</p>
        </motion.div>
      ) : null}
      {(hasOutput && !error) || loading ? (
        <motion.div
          key={outputKey}
          initial={simpleMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={simpleMotion ? undefined : { opacity: 0 }}
          transition={{ duration: simpleMotion ? 0.15 : 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden border-t border-white/[0.08] px-4 py-4"
        >
          {loading ? (
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(105deg, transparent 15%, rgba(255,255,255,0.07) 50%, transparent 85%)",
                backgroundSize: "200% 100%",
                animation: simpleMotion ? "none" : "system-query-shimmer 1.35s linear infinite",
              }}
              aria-hidden
            />
          ) : null}
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-red-500/85">
            STATUS: {loading ? "PROCESSING" : status.toUpperCase()}
          </p>
          <div className="text-sm leading-[var(--prose-rhythm)] text-foreground/90">
            {loading && !hasOutput ? (
              <div className="space-y-2">
                <p className="font-mono text-[12px] text-muted">processing...</p>
                <div className="flex min-h-[44px] items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-red-400/75" />
                  <span className="font-mono text-[11px] text-muted/85">{loadingLogs[logStep]}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/80">[ RESPONSE ]</p>
                {lines.map((line, idx) =>
                  simpleMotion ? (
                    <p
                      key={`${outputKey}-${idx}-${line}`}
                      className={cn(
                        "whitespace-pre-wrap",
                        line.startsWith("-") || line.startsWith("→") ? "pl-1 text-foreground/95" : "",
                      )}
                    >
                      {line}
                    </p>
                  ) : (
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
                  ),
                )}
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
  );
}

export function SystemQueryPanel() {
  const isMobile = useMaxWidth768();
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
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const actionTimerRef = useRef<number | null>(null);
  const typingTimerRef = useRef<number | null>(null);
  const startTimerRef = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const hasOutput = useMemo(() => displayed.length > 0, [displayed]);
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

  useEffect(() => {
    if (!isMobile || !mobileExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, mobileExpanded]);

  /** Collapse mobile dock when crossing to desktop so layout stays predictable. */
  useEffect(() => {
    if (!isMobile) setMobileExpanded(false);
  }, [isMobile]);

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

  const onMobileTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };

  const onMobileTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const y = e.changedTouches[0]?.clientY;
    if (y == null) return;
    const dy = y - touchStartY.current;
    if (dy > 56) setMobileExpanded(false);
    touchStartY.current = null;
  };

  const glassPanel =
    "border border-white/[0.12] bg-[linear-gradient(160deg,rgba(16,16,18,0.88)_0%,rgba(8,8,9,0.92)_100%)] " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_54px_-30px_rgba(0,0,0,0.65)] " +
    "backdrop-blur-xl supports-[backdrop-filter]:bg-[linear-gradient(160deg,rgba(16,16,18,0.72)_0%,rgba(8,8,9,0.78)_100%)]";

  const outputProps = {
    error,
    hasOutput,
    loading,
    displayed,
    outputKey,
    status,
    logStep,
    loadingLogs,
    actionLabel,
  };

  return (
    <>
      {/* Desktop — unchanged layout; hidden ≤768px */}
      <div
        className="fixed bottom-6 right-4 z-50 hidden w-[min(94vw,460px)] min-[769px]:block sm:bottom-8 sm:right-8"
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

          <QueryOutputSection {...outputProps} simpleMotion={false} />
        </motion.div>
      </div>

      {/* Mobile bottom assistant — hidden ≥769px */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-[48] hidden max-[768px]:flex max-[768px]:justify-center",
          "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          mobileExpanded && "z-[58]",
        )}
        role="region"
        aria-label="Assistant"
      >
        <div
          className={cn(
            "pointer-events-auto flex w-[min(90vw,28rem)] flex-col transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none",
            mobileExpanded ? "max-h-[65vh]" : "max-h-12",
          )}
        >
          <div
            className={cn(
              "flex min-h-0 flex-col overflow-hidden text-foreground",
              mobileExpanded ? "rounded-2xl" : "rounded-full",
              glassPanel,
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: "radial-gradient(70% 55% at 50% 0%, rgba(239,68,68,0.07), transparent 60%)" }}
              aria-hidden
            />

            {!mobileExpanded ? (
              <button
                type="button"
                className={cn(
                  "relative z-[1] flex h-12 min-h-[48px] w-full items-center gap-3 rounded-full px-4 text-left",
                  "transition-transform duration-150 ease-out active:scale-[0.97]",
                )}
                aria-expanded={false}
                onClick={() => setMobileExpanded(true)}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-500/85">Ask</span>
                <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-muted/80">
                  {query.trim() ? query : PLACEHOLDERS[placeholderIndex]}
                </span>
                <span className="shrink-0 text-muted/60" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 15l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            ) : (
              <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
                <div
                  className="flex shrink-0 flex-col border-b border-white/[0.08] px-3 pt-2"
                  onTouchStart={onMobileTouchStart}
                  onTouchEnd={onMobileTouchEnd}
                >
                  <div className="mx-auto mb-2 h-1 w-10 shrink-0 rounded-full bg-white/20" aria-hidden />
                  <div className="flex items-center justify-between gap-2 pb-2">
                    <p className="kicker text-red-500/80">Assistant</p>
                    <button
                      type="button"
                      className={cn(
                        "flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-full",
                        "border border-white/[0.12] bg-black/25 font-mono text-lg leading-none text-foreground/85",
                        "transition-transform duration-150 ease-out active:scale-[0.97]",
                      )}
                      aria-label="Close assistant"
                      onClick={() => setMobileExpanded(false)}
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  <form onSubmit={onSubmit} className="relative px-4 pb-3 pt-2">
                    <label htmlFor="system-query-mobile" className="sr-only">
                      Query string
                    </label>
                    <div className="flex flex-col gap-3">
                      <div className="relative min-w-0">
                        <input
                          id="system-query-mobile"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder={PLACEHOLDERS[placeholderIndex]}
                          disabled={loading}
                          autoComplete="off"
                          onFocus={() => setFocused(true)}
                          onBlur={() => setFocused(false)}
                          className={cn(
                            "min-h-[48px] w-full rounded-xl border border-white/[0.1] bg-black/[0.26] px-3 py-3",
                            "font-mono text-[13px] text-foreground placeholder:text-muted/45",
                            "outline-none transition-[border-color,box-shadow] duration-200",
                            "focus:border-red-400/35 focus:ring-1 focus:ring-red-500/15",
                            "disabled:opacity-60",
                          )}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className={cn(
                          "flex min-h-[48px] w-full items-center justify-center rounded-xl border border-white/[0.14] bg-black/[0.3]",
                          "font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/92",
                          "transition-transform duration-150 ease-out active:scale-[0.97]",
                          "disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100",
                        )}
                      >
                        {loading ? "RUNNING" : "RUN"}
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {SUGGESTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          disabled={loading}
                          onClick={() => void runQuery(item)}
                          className={cn(
                            "min-h-[44px] rounded-full border border-white/[0.1] bg-black/[0.22] px-3 py-2",
                            "font-mono text-[10px] uppercase tracking-[0.12em] text-muted",
                            "transition-transform duration-150 ease-out active:scale-[0.97]",
                            "disabled:opacity-40 disabled:active:scale-100",
                          )}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </form>

                  <QueryOutputSection {...outputProps} simpleMotion />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
