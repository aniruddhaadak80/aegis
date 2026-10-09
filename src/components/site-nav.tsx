import Link from "next/link";

export const NAV = [
  { href: "/", label: "Briefing", index: "01" },
  { href: "/stack", label: "Stack", index: "02" },
  { href: "/atlas", label: "Atlas", index: "03" },
  { href: "/risk", label: "PRA Engine", index: "04" },
  { href: "/math", label: "Math", index: "05" },
  { href: "/governance", label: "Governance", index: "06" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[100rem] items-center gap-6 px-[var(--shell-pad)]">
        <Link
          href="/"
          className="group flex shrink-0 items-baseline gap-2.5"
          aria-label="AEGIS home"
        >
          <span className="display text-[1.35rem] leading-none tracking-tight text-fg">
            AEGIS
          </span>
          <span className="hidden h-3 w-px bg-rule-2 sm:block" />
          <span className="label hidden transition-colors group-hover:text-fg-2 sm:block">
            Control Stack
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-0.5 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative flex items-center gap-1.5 px-2.5 py-1.5 text-[0.8125rem] whitespace-nowrap text-fg-3 transition-colors hover:text-fg"
            >
              <span className="num text-[0.625rem] text-fg-4 transition-colors group-hover:text-amber">
                {item.index}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}