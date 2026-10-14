# Security Policy

## Scope

AEGIS is a **fully static educational web application**. It has no server, no
backend, no database, no authentication, and no data collection. Everything
runs in the browser from a static export.

That means the attack surface is small, but it is not zero.

## What is in scope

| Concern | Status |
|:--|:--|
| Server-side vulnerabilities | **None possible** — there is no server |
| Data exfiltration | **None** — the app sends no data anywhere |
| Malicious dependency | Low — see below |
| Cross-site scripting (XSS) | Mitigated — see below |
| Supply-chain via build | Mitigated — lockfile committed, `bun install --frozen-lockfile` in CI |

## Reporting

**Please do not open a public issue for a security report.**

Use [GitHub's private vulnerability reporting](https://github.com/aniruddhaadak80/aegis/security/advisories/new)
instead, or email the address in [`CODEOWNERS`](.github/CODEOWNERS) if present.
You can expect an acknowledgement within a few days.

## XSS posture

The one place user-controlled input reaches the DOM is the PRA configuration
codec in [`src/lib/pra-config.ts`](src/lib/pra-config.ts). It is written so that
a malformed or adversarial URL fragment **cannot** reach the DOM:

- Every field is parsed and range-checked before use.
- Unknown control ids are rejected, not ignored.
- A malformed fragment returns `null` and the app falls back to the default
  stack rather than half-applying a configuration.
- The codec's rejection rules are covered by tests in
  [`scripts/verify-pra.ts`](scripts/verify-pra.ts).

The JSON-LD block in `src/app/layout.tsx` is serialised with
`JSON.stringify` over a static literal — never over user data — so there is no
injection surface there.

## Dependency posture

- `bun.lock` is committed and CI installs with `--frozen-lockfile`, so the
  resolved dependency set cannot drift without an explicit commit.
- Dependencies are few: Next.js, React, KaTeX, Tailwind, TypeScript, ESLint.
- There are no runtime secrets in the repository. If you find one, treat it as a
  bug and report it privately.

## Content Security Policy

The deployed site sends a CSP that is deliberately permissive where the
framework requires it — `script-src 'unsafe-inline'` for the JSON-LD block and
`style-src 'unsafe-inline'` for Tailwind's runtime — while still denying
framing (`frame-ancestors 'none'`), restricting `base-uri` and `form-action'`,
and setting `default-src 'self'`.

If you believe the CSP can be tightened without breaking the site, that is a
welcome contribution.
