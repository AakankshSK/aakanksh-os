"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { Magnetic } from "@/components/ui/Magnetic";
import { ContactInfoRow } from "@/components/contact/ContactInfoRow";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const socials = [
  { label: "GitHub", href: site.social.github },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "X", href: site.social.x },
];

function IconMail() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path stroke="currentColor" strokeWidth={1.5} d="M4 6.5h16v11H4z" />
      <path stroke="currentColor" strokeWidth={1.5} d="m4 7.5 8 5.5 8-5.5" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7H8l-5 3v-3.4A8.5 8.5 0 0 1 12.5 3a8.38 8.38 0 0 1 8.5 8.5Z"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
      />
      <circle cx="12" cy="11" r="2" fill="none" stroke="currentColor" strokeWidth={1.5} />
    </svg>
  );
}

function IconSchool() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path stroke="currentColor" strokeWidth={1.5} d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path stroke="currentColor" strokeWidth={1.5} d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path stroke="currentColor" strokeWidth={1.5} d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <rect width="20" height="12" x="2" y="8" rx="2" stroke="currentColor" strokeWidth={1.5} />
      <path stroke="currentColor" strokeWidth={1.5} d="M12 12v3" />
    </svg>
  );
}

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const reduced = usePrefersReducedMotion();

  const leadStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: reduced
          ? { staggerChildren: 0.04, delayChildren: 0 }
          : { staggerChildren: 0.06, delayChildren: 0.05 },
      },
    }),
    [reduced],
  );

  const cardStagger = useMemo(
    () => ({
      hidden: {},
      visible: {
        transition: reduced
          ? { staggerChildren: 0.04, delayChildren: 0 }
          : { staggerChildren: 0.055, delayChildren: 0.04 },
      },
    }),
    [reduced],
  );

  const item = useMemo(
    () =>
      reduced
        ? {
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" as const } },
          }
        : {
            hidden: { opacity: 0, x: -8, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              transition: { duration: 0.6, ease: "easeOut" as const },
            },
          },
    [reduced],
  );

  return (
    <section
      id="contact"
      className="border-t border-border bg-surface px-4 py-[var(--section-y-mobile)] sm:px-8 sm:py-[var(--section-y-desktop)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <motion.div
            className="lg:col-span-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-12% 0px" }}
            variants={leadStagger}
          >
            <motion.p variants={item} className="kicker text-accent2">
              Contact
            </motion.p>
            <motion.h2
              variants={item}
              className="heading-section mt-6 max-w-[14ch] text-balance sm:max-w-[16ch]"
            >
              Let&apos;s build something deliberate.
            </motion.h2>
            <motion.p
              variants={item}
              className="mt-8 max-w-md text-sm leading-[var(--prose-rhythm)] text-muted sm:text-base"
            >
              Share constraints, timelines, and what a good outcome looks like. I reply with a clear next step.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative lg:col-span-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px" }}
            variants={cardStagger}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-2xl",
                "border border-white/[0.09]",
                "bg-surface/[0.42] shadow-[0_24px_56px_-28px_rgba(0,0,0,0.55)]",
                "backdrop-blur-md supports-[backdrop-filter]:bg-surface/[0.34]",
              )}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-accent2/[0.07] from-0% via-accent/[0.025] via-40% to-transparent to-[58%]"
                aria-hidden
              />
              <div className="relative px-6 py-8 sm:px-9 sm:py-10">
                <motion.div variants={item}>
                  <ContactInfoRow
                    label="Email"
                    icon={<IconMail />}
                    href={`mailto:${site.email}`}
                    reducedMotion={reduced}
                  >
                    <span className="font-medium text-foreground/90">{site.email}</span>
                  </ContactInfoRow>
                </motion.div>
                <motion.div variants={item}>
                  <ContactInfoRow
                    label="WhatsApp"
                    icon={<IconChat />}
                    href={site.whatsappUrl}
                    external
                    reducedMotion={reduced}
                  >
                    <span className="font-medium text-foreground/90 underline decoration-white/15 underline-offset-4 transition group-hover:decoration-accent2/40">
                      {site.whatsappDisplay}
                    </span>
                  </ContactInfoRow>
                </motion.div>
                <motion.div variants={item}>
                  <ContactInfoRow label="Location" icon={<IconPin />} reducedMotion={reduced}>
                    {site.location}
                  </ContactInfoRow>
                </motion.div>
                <motion.div variants={item}>
                  <ContactInfoRow label="College" icon={<IconSchool />} reducedMotion={reduced}>
                    {site.college}
                  </ContactInfoRow>
                </motion.div>
                <motion.div variants={item}>
                  <ContactInfoRow label="Open to" icon={<IconBriefcase />} reducedMotion={reduced}>
                    {site.openTo}
                  </ContactInfoRow>
                </motion.div>

                <motion.div
                  variants={item}
                  className="my-8 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
                  aria-hidden
                />

                <motion.form
                  variants={item}
                  className="grid gap-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStatus("sent");
                  }}
                >
                  <Field
                    label="Name"
                    name="name"
                    autoComplete="name"
                    placeholder="Name"
                    required
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    required
                  />
                  <div className="grid gap-2">
                    <label htmlFor="message" className="kicker text-foreground/45">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Brief, links, timelines."
                      className={cn(
                        "rounded-xl border border-white/[0.1] bg-black/[0.18] px-4 py-3 text-sm text-foreground outline-none",
                        "transition-[border-color,box-shadow] duration-300 ease-out",
                        "placeholder:text-muted/45 focus:border-accent2/35 focus:ring-1 focus:ring-accent2/12",
                      )}
                    />
                  </div>
                  <Magnetic className="pt-1">
                    <button
                      type="submit"
                      data-cursor="pointer"
                      className={cn(
                        "w-full rounded-xl py-3.5 text-sm font-semibold text-background transition-colors",
                        "bg-accent/95 hover:bg-accent",
                        "disabled:opacity-50",
                      )}
                      disabled={status === "sent"}
                    >
                      {status === "sent" ? "Sent — I’ll reply soon." : "Send"}
                    </button>
                  </Magnetic>
                </motion.form>

                <motion.ul
                  variants={item}
                  className="mt-8 flex flex-wrap gap-2 border-t border-white/[0.06] pt-8"
                >
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="pointer"
                        className={cn(
                          "inline-flex rounded-lg border border-white/[0.08] px-3 py-2",
                          "font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors",
                          "hover:border-white/[0.14] hover:text-foreground/85",
                        )}
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  name,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const fieldId = id ?? String(name);
  return (
    <div className="grid gap-2">
      <label htmlFor={fieldId} className="kicker text-foreground/45">
        {label}
      </label>
      <input
        id={fieldId}
        name={name}
        className={cn(
          "h-12 rounded-xl border border-white/[0.1] bg-black/[0.18] px-4 text-sm text-foreground outline-none",
          "transition-[border-color,box-shadow] duration-300 ease-out",
          "placeholder:text-muted/45 focus:border-accent2/35 focus:ring-1 focus:ring-accent2/12",
        )}
        {...rest}
      />
    </div>
  );
}
