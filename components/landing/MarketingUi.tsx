import Link from "next/link";
import type { ReactNode } from "react";

const COLORS = {
  bg: "#f6faf7",
  bgMuted: "#f1f5f2",
  primary: "#003527",
  primaryContainer: "#064e3b",
  secondary: "#ac3400",
  onSurface: "#181d1b",
  onSurfaceVariant: "#404944",
  outline: "#707974",
  border: "rgba(191,201,195,0.3)",
  mint: "#b0f0d6",
};

export function MarketingPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, fontFamily: "var(--font-hanken, sans-serif)" }}>
      {children}
    </div>
  );
}

export function MarketingHero({
  eyebrow,
  title,
  description,
  children,
  centered = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  children?: ReactNode;
  centered?: boolean;
}) {
  return (
    <section className="relative py-20 lg:py-28 px-6 overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: "radial-gradient(circle at 80% 20%, rgba(176,240,214,0.5) 0%, transparent 50%)" }} />
      <div className={`relative max-w-screen-xl mx-auto ${centered ? "text-center max-w-3xl" : ""}`}>
        {eyebrow && (
          <p className="text-xs uppercase tracking-widest mb-4 font-mono" style={{ color: COLORS.secondary, letterSpacing: "0.1em" }}>
            {eyebrow}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: COLORS.primary, letterSpacing: "-0.02em" }}>
          {title}
        </h1>
        {description && (
          <p className={`text-lg md:text-xl mb-8 ${centered ? "mx-auto" : "max-w-2xl"}`} style={{ color: COLORS.onSurfaceVariant }}>
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function MarketingSection({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: "default" | "muted" | "white";
  className?: string;
}) {
  const bg = variant === "muted" ? COLORS.bgMuted : variant === "white" ? "#ffffff" : COLORS.bg;
  return (
    <section className={`py-20 lg:py-24 px-6 ${className}`} style={{ backgroundColor: bg }}>
      <div className="max-w-screen-xl mx-auto">{children}</div>
    </section>
  );
}

export function MarketingHeading({
  title,
  description,
  centered = true,
}: {
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={`mb-14 ${centered ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: COLORS.primary, letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      {description && <p className="text-lg" style={{ color: COLORS.onSurfaceVariant }}>{description}</p>}
    </div>
  );
}

export function MarketingCard({
  children,
  className = "",
  featured = false,
}: {
  children: ReactNode;
  className?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 border transition-all ${className}`}
      style={{
        backgroundColor: featured ? COLORS.primaryContainer : "#ffffff",
        borderColor: featured ? "rgba(255,255,255,0.1)" : COLORS.border,
        boxShadow: featured ? "0 20px 40px -15px rgba(6,78,59,0.15)" : "0 10px 30px -5px rgba(6,78,59,0.08)",
        color: featured ? "#ffffff" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export function MarketingIconBox({ icon, variant = "mint" }: { icon: string; variant?: "mint" | "lime" | "terracotta" | "dark" }) {
  const styles = {
    mint: { bg: "#b0f0d6", color: "#0b513d" },
    lime: { bg: "#bbf37c", color: "#1c3400" },
    terracotta: { bg: "#ffdbd0", color: "#832600" },
    dark: { bg: "#064e3b", color: "#b0f0d6" },
  }[variant];

  return (
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: styles.bg }}>
      <span className="material-symbols-outlined text-[24px]" style={{ color: styles.color, fontVariationSettings: "'FILL' 1" }}>
        {icon}
      </span>
    </div>
  );
}

export function MarketingCheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2 text-sm font-bold" style={{ color: COLORS.primary, fontFamily: "var(--font-jetbrains, monospace)" }}>
          <span className="material-symbols-outlined text-[18px]" style={{ color: COLORS.secondary, fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function MarketingButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? { backgroundColor: COLORS.secondary, color: "#ffffff", border: "none" }
      : variant === "secondary"
      ? { backgroundColor: COLORS.primary, color: "#ffffff", border: "none" }
      : { backgroundColor: "transparent", color: COLORS.primary, border: `1px solid ${COLORS.border}` };

  const cls = `inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:opacity-90 ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} style={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} style={styles}>
      {children}
    </button>
  );
}

export function MarketingStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-bold mb-2" style={{ color: COLORS.primary, letterSpacing: "-0.02em" }}>
        {value}
      </p>
      <p className="text-xs font-mono uppercase tracking-widest" style={{ color: COLORS.outline }}>
        {label}
      </p>
    </div>
  );
}
