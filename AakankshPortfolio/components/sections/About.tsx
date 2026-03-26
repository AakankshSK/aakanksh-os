"use client";

import { BuilderStep } from "@/components/about/BuilderStep";

const builderSteps = [
  {
    number: "01",
    title: "INPUT",
    description: "I don’t start with features. I start with signal & what actually matters.",
    hint: "Clarity before scope — what the user and the data are really saying.",
    offsetClass: "lg:pr-[8%]",
  },
  {
    number: "02",
    title: "DECOMPOSITION",
    description: "Problems are broken into systems: UI, logic, data, behavior.",
    hint: "Abhyudaya CMS: UI, contact flows, and location as separate, composable layers.",
    offsetClass: "lg:pl-[14%]",
  },
  {
    number: "03",
    title: "EXECUTION",
    description: "Build fast, iterate faster. Shipping beats overthinking.",
    hint: "Applied in Dishcovery: real-time AI pipeline + rapid iteration cycles.",
    offsetClass: "lg:pr-[8%]",
  },
  {
    number: "04",
    title: "INTELLIGENCE",
    description: "AI is integrated where it adds leverage, not noise.",
    hint: "RAG + Cohere + personalization layer where inference earns its place.",
    offsetClass: "lg:pl-[14%]",
  },
  {
    number: "05",
    title: "OUTPUT",
    description: "Clean, scalable, usable systems & not just demos.",
    hint: "Typed stacks, durable data paths, interfaces that survive real use.",
    offsetClass: "lg:pr-[8%]",
  },
] as const;

export function About() {
  return (
    <section
      id="about"
      className="border-t border-white/10 bg-[#0a0a0a] px-4 py-[var(--section-y-mobile)] sm:px-8 sm:py-[var(--section-y-desktop)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
          <aside className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-red-500/80">SYSTEM / BUILDER OS</p>
            <h2 className="heading-section mt-6 max-w-[14ch] text-balance">How I Build Systems.</h2>
            <p className="mt-8 max-w-sm border-t border-white/10 pt-6 text-sm leading-[var(--prose-rhythm)] text-muted">
              Every product I build follows a structured approach — clarity, systems, execution, and scale.
            </p>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <ol className="space-y-10 sm:space-y-12">
              {builderSteps.map((step) => (
                <BuilderStep
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  hint={step.hint}
                  offsetClass={step.offsetClass}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
