import { NextResponse } from "next/server";
import { getAssistantSkillContext } from "@/lib/skillGroups";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const ASSISTANT_SYSTEM = [
  "You are a precise systems interface for a developer portfolio. Answer briefly in plain language. No emojis.",
  "When discussing skills or stack, stay aligned with ONLY this canonical list (do not invent tools):",
  getAssistantSkillContext(),
].join("\n\n");

type Body = { query?: string };
type Intent = "projects" | "skills" | "contact" | "about" | "internship";
type AssistantResponse = { response: string; status: "success" | "fallback" | "error"; action?: string };

const INTENT_KEYWORDS: Record<Intent, string[]> = {
  projects: ["project", "work", "case study", "build", "portfolio"],
  skills: ["skill", "stack", "tech", "technology", "tools", "capabilities"],
  contact: ["contact", "email", "reach", "message", "hire", "call", "whatsapp"],
  about: ["about", "who are you", "background", "intro", "introduce", "profile"],
  internship: ["internship", "intern", "fte", "open to", "availability", "opportunity"],
};

const intentPriority: Intent[] = ["internship", "projects", "skills", "contact", "about"];

function normalize(input: string): string {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function detectIntent(query: string): Intent | null {
  const q = normalize(query);
  for (const intent of intentPriority) {
    if (INTENT_KEYWORDS[intent].some((kw) => q.includes(kw))) return intent;
  }
  return null;
}

function detectDirectAction(query: string): string | null {
  const q = normalize(query);
  if (q.includes("github") || q.includes("source code") || q.includes("repo")) return "openGithub";
  return null;
}

function intentResponse(intent: Intent): AssistantResponse {
  switch (intent) {
    case "projects":
      return {
        status: "success",
        action: "scrollToProjects",
        response: [
          "Key builds:",
          "- Dishcovery: AI-powered personalized diet planner",
          "- Neural Copilot Studio: multi-agent workflow control surface",
          "- SignalRoom Analytics: narrative telemetry with verified metrics",
        ].join("\n"),
      };
    case "skills":
      return {
        status: "success",
        action: "scrollToSkills",
        response: [
          "Core capabilities:",
          "- AI Systems: Agentic AI, RAG Modeling, AI & LLM exploration",
          "- Frontend: React 19, Tailwind CSS, TypeScript",
          "- Backend: Node.js, API routing, SupabaseDB",
          "- Design: Figma, Framer, prototype development",
        ].join("\n"),
      };
    case "contact":
      return {
        status: "success",
        action: "scrollToContact",
        response: [
          "Reach out:",
          `- Email: ${site.email}`,
          `- WhatsApp: ${site.whatsappDisplay}`,
          "- LinkedIn: linkedin.com/in/aakanksh-s-677405252",
        ].join("\n"),
      };
    case "about":
      return {
        status: "success",
        action: "scrollToAbout",
        response: [
          "Profile summary:",
          `- ${site.name}`,
          "- AI engineer and creative developer focused on system-first products",
          "- Builds interfaces, models, and motion with production discipline",
        ].join("\n"),
      };
    case "internship":
      return {
        status: "success",
        action: "scrollToContact",
        response: [
          "Internship status:",
          `- Availability: Open to ${site.openTo}`,
          "- Recent role: Agentic AI Intern at Quest Global (Jan 2026 – Apr 2026)",
          `- Best contact channel: ${site.email}`,
        ].join("\n"),
      };
  }
}

async function openAiFallback(query: string, apiKey: string, model: string): Promise<AssistantResponse | null> {
  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `${ASSISTANT_SYSTEM}

You are a command interface fallback.
Return concise responses that help users navigate this portfolio.`,
          },
          { role: "user", content: query },
        ],
        max_tokens: 240,
        temperature: 0.35,
      }),
    });
    if (!upstream.ok) return null;
    const data = (await upstream.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const response = data.choices?.[0]?.message?.content?.trim();
    if (!response) return null;
    return { response, status: "success" };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query) {
    return NextResponse.json({ error: "Empty query" }, { status: 400 });
  }

  const directAction = detectDirectAction(query);
  if (directAction === "openGithub") {
    return NextResponse.json({
      status: "success",
      response: "Source endpoint:\n- Opening GitHub profile in a new tab.",
      action: directAction,
    });
  }

  const intent = detectIntent(query);
  if (intent) {
    return NextResponse.json(intentResponse(intent));
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  if (apiKey) {
    const ai = await openAiFallback(query, apiKey, model);
    if (ai) {
      return NextResponse.json(ai);
    }
  }

  return NextResponse.json({
    status: "fallback",
    response: [
      "I didn’t recognize that query.",
      "Try:",
      "→ projects",
      "→ skills",
      "→ about",
      "→ contact",
      "→ internship status",
    ].join("\n"),
  });
}
