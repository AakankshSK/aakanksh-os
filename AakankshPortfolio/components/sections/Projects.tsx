"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type CaseStudy = {
  id: "01" | "02";
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  detailLabel: string;
  detailText: string;
  role: string;
  features: string[];
  stack: string;
  highlight?: string;
  status: string;
  liveUrl?: string;
  githubUrl?: string;
  liveDisabledText?: string;
  githubDisabledText?: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "01",
    slug: "dishcovery",
    title: "Dishcovery",
    subtitle: "AI-Powered Personalized Diet Planner Platform",
    description:
      "A comprehensive AI-driven system that delivers personalized nutrition guidance and meal planning based on user data and goals.",
    detailLabel: "PROBLEM",
    detailText: "People struggle to determine what to eat based on their body metrics and health goals.",
    role: "Full-stack development + AI pipeline engineering",
    features: ["BMI-based recommendations", "AI-generated recipes", "Nutrition chatbot"],
    stack: "Python · React · Supabase · Cohere LLM APIs",
    highlight: "Real-time AI inference with personalized outputs",
    status: "Live (deployment pending)",
    githubUrl: "https://github.com/AakankshSK/DishCovery",
    liveDisabledText: "Deployment in progress",
  },
  {
    id: "02",
    slug: "abhyudaya-cms",
    title: "Abhyudaya CMS",
    subtitle: "Business Consultancy & Management Platform",
    description:
      "A business-focused platform designed to help organizations scale and operate efficiently through structured digital presence and service delivery.",
    detailLabel: "PURPOSE",
    detailText: "Enable businesses to grow, manage operations, and establish a strong digital presence.",
    role: "Full-stack development (frontend + backend system design)",
    features: ["Clean and user-friendly interface", "Integrated contact system", "Live Google Maps location"],
    stack: "TypeScript · React · Tailwind CSS · Node.js",
    status: "Live",
    liveUrl: "https://abhyudayacms.in",
    githubDisabledText: "Private / Coming soon",
  },
];

export function Projects() {
  return (
    <section
      id="projects"
      className="relative border-t border-border bg-background px-4 py-[var(--section-y-mobile)] sm:px-8 sm:py-[var(--section-y-desktop)]"
    >
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl pb-12 sm:pb-16">
          <p className="kicker text-accent">Case studies</p>
          <h2 className="heading-section mt-6">Cinematic system reveals.</h2>
          <p className="mt-6 text-base leading-[var(--prose-rhythm)] text-muted sm:text-lg">
            Two high-signal builds, presented as structured modules: constraints, decisions, outputs.
          </p>
        </header>

        <div className="relative grid gap-10 sm:gap-12">
          {CASE_STUDIES.map((project) => (
            <CaseStudyModule key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyModule({ project }: { project: CaseStudy }) {
  const rootRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start 92%", "end 12%"],
  });

  const visualYRaw = useTransform(scrollYProgress, [0, 1], [22, -20]);
  const visualY = useSpring(visualYRaw, { stiffness: 120, damping: 26, mass: 0.5 });

  return (
    <motion.article
      ref={rootRef}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        scale: 1.012,
        boxShadow: "0 28px 80px -36px rgba(0,0,0,0.7), 0 0 28px rgba(239,68,68,0.08)",
      }}
      className="group relative overflow-hidden border border-white/[0.08] bg-[linear-gradient(165deg,rgba(17,17,18,0.94)_0%,rgba(10,10,11,0.98)_58%,rgba(8,8,9,1)_100%)]"
    >
      <span className="pointer-events-none absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-red-500/55" aria-hidden />
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.08]" aria-hidden />

      <div className="grid gap-8 p-6 lg:grid-cols-12 lg:gap-10 lg:p-8">
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/72">{project.id}</p>
          <h3 className="mt-3 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h3>
          <p className="mt-3 text-sm uppercase tracking-[0.12em] text-red-500/82">{project.subtitle}</p>
          <p className="mt-5 max-w-3xl text-sm leading-[1.75] text-muted sm:text-base">{project.description}</p>

          <div className="mt-8 space-y-4 border-t border-white/[0.08] pt-6">
            <DetailRow label={project.detailLabel} value={project.detailText} />
            <DetailRow label="ROLE" value={project.role} />
            <DetailRow label="FEATURES" value={project.features.join(" · ")} />
            <DetailRow label="TECH STACK" value={project.stack} />
            {project.highlight ? <DetailRow label="HIGHLIGHT" value={project.highlight} /> : null}
            <DetailRow label="STATUS" value={project.status} />
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-white/[0.08] pt-6">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/[0.14] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground transition-all duration-250 hover:-translate-y-[1px] hover:border-red-400/35 hover:text-red-200/95"
              >
                GitHub
              </a>
            ) : (
              <span className="rounded-md border border-white/[0.1] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted/75">
                {project.githubDisabledText}
              </span>
            )}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/[0.14] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground transition-all duration-250 hover:-translate-y-[1px] hover:border-red-400/35 hover:text-red-200/95"
              >
                Live Site
              </a>
            ) : (
              <span className="rounded-md border border-white/[0.1] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted/75">
                {project.liveDisabledText}
              </span>
            )}
          </div>
        </motion.div>

        <div className="lg:col-span-5">
          <motion.div style={{ y: visualY }} className="relative h-full min-h-[280px] overflow-hidden border border-white/[0.08]">
            <div className="absolute inset-0 bg-[radial-gradient(60%_90%_at_70%_10%,rgba(239,68,68,0.18)_0%,transparent_62%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0)_40%,rgba(255,255,255,0.02)_100%)]" />
            <div
              className={cn(
                "absolute inset-0 opacity-65",
                "bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:34px_34px]",
              )}
              aria-hidden
            />
            <motion.div
              className="absolute -left-16 top-1/3 h-28 w-28 rounded-full border border-red-400/30"
              animate={{ x: [0, 24, 0], opacity: [0.22, 0.44, 0.22] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-10 top-10 h-24 w-24 rounded-full border border-white/[0.16]"
              animate={{ y: [0, 10, 0], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-x-4 bottom-4 border-t border-white/[0.08] pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted/75">visual diagnostic panel</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-2 border-t border-white/[0.08] pt-4 sm:grid-cols-[140px_1fr] sm:items-start sm:gap-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-red-500/78">{label}</p>
      <p className="text-sm leading-relaxed text-foreground/88">{value}</p>
    </div>
  );
}
