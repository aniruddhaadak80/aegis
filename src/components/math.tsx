import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Renders LaTeX to static HTML at build time. No client-side maths library,
 * no hydration mismatch, no layout shift.
 */
export function Math({
  tex,
  display = false,
  className = "",
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  let html: string;
  try {
    html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: false,
      output: "html",
    });
  } catch {
    html = `<code>${tex}</code>`;
  }

  return (
    <span
      className={className}
      // KaTeX output is generated locally from a fixed string in our own data
      // files, with `trust: false` disabling \href and \htmlClass injection.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}