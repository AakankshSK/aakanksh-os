export type ProjectMetadata = {
  year: string;
  scope: string;
  platform?: string;
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  /** Short engineering / architecture note for hover detail layer. */
  technicalBreakdown: string;
  metadata: ProjectMetadata;
  tech: string[];
  features: string[];
  liveUrl: string;
  caseUrl?: string;
  imageSrc: string;
  /** Which accent anchors the index rule — two-color system only. */
  accentKey: "primary" | "secondary";
};

/** Curated case studies — swap URLs and imagery for production. */
export const projects: Project[] = [
  {
    slug: "neural-copilot",
    title: "Neural Copilot Studio",
    subtitle: "Agent orchestration for human teams",
    description:
      "A control surface for multi-agent workflows: trace reasoning, gate tool use, and ship safer automation without losing velocity. Built for operators who need observability as a first-class layer, not an afterthought.",
    technicalBreakdown:
      "React 19 and TypeScript control shell with Tailwind CSS; Node.js services and API routing for policy paths; Python workers for evaluation; Agentic AI training patterns for gated tool use; SupabaseDB for durable session metadata where needed.",
    metadata: { year: "2024", scope: "Product + platform", platform: "Web" },
    tech: [
      "TypeScript",
      "React 19",
      "Tailwind CSS",
      "Node.js",
      "Python",
      "API Routing",
      "Agentic AI Training & Development",
      "SupabaseDB",
    ],
    features: [
      "Session replay for agent traces with redaction rules",
      "Policy tiers for tool invocation and external calls",
      "Realtime collaboration for prompt and playbook edits",
    ],
    liveUrl: "https://vercel.com",
    caseUrl: "https://github.com/AakankshSK",
    imageSrc:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    accentKey: "primary",
  },
  {
    slug: "latentcanvas",
    title: "LatentCanvas",
    subtitle: "Creative toolkit for diffusion-native UX",
    description:
      "A browser-native canvas where generative models feel tactile—region masks, latent travel, and motion-aware export paths. The focus: predictable results for designers, not lottery spins.",
    technicalBreakdown:
      "Figma-to-build handoff with Framer-level motion in the UI; TypeScript and React 19; AI & LLM exploration wired into prototype development loops; Tailwind CSS for a tight design system.",
    metadata: { year: "2024", scope: "Creative tooling", platform: "Browser" },
    tech: [
      "Figma",
      "Framer",
      "TypeScript",
      "React 19",
      "Tailwind CSS",
      "AI & LLM Exploration",
      "Prototype Development",
    ],
    features: [
      "Region-guided generation with live feathering",
      "Motion paths exported to Lottie and MP4",
      "Deterministic seeds with shareable recipe links",
    ],
    liveUrl: "https://vercel.com",
    imageSrc:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
    accentKey: "secondary",
  },
  {
    slug: "signalroom",
    title: "SignalRoom Analytics",
    subtitle: "Telemetry that reads like a story",
    description:
      "From raw events to narratives: anomaly surfacing, cohort overlays, and natural-language summaries grounded in verified metrics. Built to shorten the gap between dashboard and decision.",
    technicalBreakdown:
      "React 19 and TypeScript for dense analytics views; SupabaseDB for data paths; RAG modeling so summaries stay grounded; website enhancement and SEO for discoverable surfaces; API routing for validated queries.",
    metadata: { year: "2023", scope: "Analytics", platform: "Edge + web" },
    tech: [
      "React 19",
      "TypeScript",
      "SupabaseDB",
      "RAG Modeling",
      "Website Enhancement",
      "SEO",
      "API Routing",
    ],
    features: [
      "Streaming anomaly cards pinned to user journeys",
      "Verified NL summaries with cited SQL snippets",
      "Role-aware workspaces for product and GTM",
    ],
    liveUrl: "https://vercel.com",
    imageSrc:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    accentKey: "primary",
  },
];
