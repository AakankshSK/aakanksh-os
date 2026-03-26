"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type RecordTab = "education" | "work" | "research" | "awards";

type RecordItem = {
  title: string;
  detail?: string;
  bullets?: string[];
};

type RecordSection = {
  id: RecordTab;
  label: string;
  node: string;
  description: string;
  items: RecordItem[];
};

const RECORDS: RecordSection[] = [
  {
    id: "education",
    label: "Education",
    node: "EDU_NODE",
    description: "Academic system inputs and training foundations.",
    items: [
      { title: "RNSIT — B.E. ISE (2022–2026)" },
      { title: "Jnanasweekar PU College (Deeksha) (2020–2022)" },
      { title: "Jyothy Kendriya Vidyalaya (2010–2020)" },
    ],
  },
  {
    id: "work",
    label: "Work Experience",
    node: "WORK_NODE",
    description: "Execution logs from industry and independent delivery.",
    items: [
      { title: "Agentic AI Intern — Quest Global", detail: "Jan 2026 – Apr 2026" },
      { title: "Freelance Developer", detail: "Web Dev, UI/UX, AI, Cybersecurity" },
    ],
  },
  {
    id: "research",
    label: "Research",
    node: "RND_NODE",
    description: "Published and accepted research system records.",
    items: [
      {
        title: "Dishcovery — AI Powered Personalized Diet Planner Platform",
        bullets: [
          "Accepted at AIS 2026 (International Conference on AI Systems)",
          "Accepted at International Conference on Sustainable Management and Advanced Research Technologies",
        ],
      },
    ],
  },
  {
    id: "awards",
    label: "Awards",
    node: "ACH_NODE",
    description: "Competitive outcomes and institutional recognition.",
    items: [
      { title: "1st Place — PROP 2025 (RNSIT)" },
      { title: "Qualified for patent application (RNSIT)" },
    ],
  },
];

const tabs = RECORDS.map((section) => ({
  id: section.id,
  label: section.label,
  node: section.node,
}));

export function Education() {
  const [active, setActive] = useState<RecordTab>("education");
  const activeSection = useMemo(
    () => RECORDS.find((section) => section.id === active) ?? RECORDS[0],
    [active],
  );

  return (
    <section
      id="education"
      className="border-t border-border bg-surface px-4 py-[var(--section-y-mobile)] sm:px-8 sm:py-[var(--section-y-desktop)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <header className="max-w-3xl">
          <p className="kicker text-accent2">System records</p>
          <h2 className="heading-section mt-6 max-w-[16ch]">Structured timeline interface.</h2>
          <p className="mt-6 text-sm leading-[var(--prose-rhythm)] text-muted sm:text-base">
            Core records are grouped as modules. Select a node to load the corresponding system dataset.
          </p>
        </header>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted/75">record index</p>
            <div className="mt-4 border border-border-strong bg-[#080809]">
              {tabs.map((tab) => {
                const isActive = active === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActive(tab.id)}
                    className="group relative flex w-full items-center justify-between border-b border-border-strong px-4 py-3 text-left last:border-b-0"
                    data-cursor="pointer"
                  >
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                        isActive ? "text-red-500/90" : "text-muted/70 group-hover:text-foreground/85"
                      }`}
                    >
                      {tab.node}
                    </span>
                    <span
                      className={`text-sm transition-colors ${
                        isActive ? "text-foreground" : "text-muted group-hover:text-foreground/90"
                      }`}
                    >
                      {tab.label}
                    </span>
                    {isActive ? <span className="absolute inset-y-0 left-0 w-px bg-red-500/75" aria-hidden /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="relative min-h-[320px] overflow-hidden border border-border-strong bg-background/70">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection.id}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                  transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  className="p-5 sm:p-7"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-red-500/85">
                    {activeSection.node}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-medium tracking-tight text-foreground">
                    {activeSection.label}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-[var(--prose-rhythm)] text-muted sm:text-base">
                    {activeSection.description}
                  </p>

                  <motion.ul
                    className="mt-8 space-y-4 border-t border-border-strong pt-6"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: {},
                      show: {
                        transition: { staggerChildren: 0.08, delayChildren: 0.04 },
                      },
                    }}
                  >
                    {activeSection.items.map((item) => (
                      <motion.li
                        key={item.title}
                        variants={{
                          hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
                          show: {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                          },
                        }}
                        className="border-l border-border-strong pl-4"
                      >
                        <p className="text-sm font-medium leading-snug text-foreground sm:text-base">{item.title}</p>
                        {item.detail ? (
                          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted/75">
                            {item.detail}
                          </p>
                        ) : null}
                        {item.bullets?.length ? (
                          <ul className="mt-3 space-y-2">
                            {item.bullets.map((bullet) => (
                              <li key={bullet} className="text-sm leading-relaxed text-muted">
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
