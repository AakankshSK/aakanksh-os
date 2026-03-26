export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="absolute left-4 top-4 z-[110] -translate-y-24 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background opacity-0 transition focus:translate-y-0 focus:opacity-100 focus:duration-200"
    >
      Skip to main content
    </a>
  );
}
