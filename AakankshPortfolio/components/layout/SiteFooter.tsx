import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          © {new Date().getFullYear()} Aakanksh S Kallihal · All rights reserved.
        </p>
        <p className="text-sm text-muted/80">React 19 · TypeScript · Framer</p>
      </div>
    </footer>
  );
}
