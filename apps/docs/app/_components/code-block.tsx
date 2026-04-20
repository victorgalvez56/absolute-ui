/**
 * Simple, dependency-free code block. We intentionally avoid a syntax
 * highlighter on the server because the docs site is static and the
 * primitives library ships its own design language — the monospaced
 * slab reads fine without Prism/Shiki color noise.
 */
export function CodeBlock({
  code,
  language = 'tsx',
  caption,
}: {
  code: string;
  language?: string;
  caption?: string;
}) {
  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-[color:var(--color-divider)] bg-[color-mix(in_oklab,var(--color-background)_60%,black_40%)]">
      <div className="flex items-center justify-between border-b border-[color:var(--color-divider)] px-4 py-2 text-xs uppercase tracking-wider text-[color:var(--color-text-secondary)]">
        <span>{language}</span>
        {caption ? <span className="normal-case tracking-normal">{caption}</span> : null}
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </figure>
  );
}

/**
 * Inline mono rendering with subtle surface so the reader can spot
 * identifiers in body copy.
 */
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-[color:var(--color-divider)] px-1 py-0.5 font-mono text-xs">
      {children}
    </code>
  );
}
