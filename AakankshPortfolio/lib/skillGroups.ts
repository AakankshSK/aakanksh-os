/** Canonical skill taxonomy — single source for Skills UI, hero, projects, assistant. */

export type SkillGroup = {
  id: string;
  title: string;
  items: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "uiux",
    title: "UI / UX Design & Prototyping",
    items: ["Figma", "Framer"],
  },
  {
    id: "languages",
    title: "Languages",
    items: ["Python", "TypeScript", "React 19", "Tailwind CSS"],
  },
  {
    id: "webseo",
    title: "Website Enhancement & SEO",
    items: ["Website Enhancement", "SEO"],
  },
  {
    id: "backend",
    title: "Database & Backend",
    items: ["Node.js", "SupabaseDB", "API Routing"],
  },
  {
    id: "ai",
    title: "AI & Tools",
    items: ["AI & LLM Exploration", "Agentic AI Training & Development", "RAG Modeling"],
  },
  {
    id: "other",
    title: "Other Skills",
    items: ["Video Editing", "Prompt Engineering", "Prototype Development", "Turn-key Projects"],
  },
  {
    id: "soft",
    title: "Soft Skills",
    items: [
      "Critical Thinking",
      "Multi-Lingual (English, Kannada, Hindi, Sanskrit, Japanese)",
      "Accountability",
      "Creativity",
      "Open-Mindedness",
    ],
  },
] as const;

export const allSkillLabels: string[] = skillGroups.flatMap((g) => [...g.items]);

export const skillGroupTitles = skillGroups.map((g) => g.title).join(" · ");

/** Compact block for LLM system prompts and local assistant fallback. */
export function getAssistantSkillContext(): string {
  return skillGroups.map((g) => `${g.title}: ${g.items.join("; ")}`).join("\n");
}
