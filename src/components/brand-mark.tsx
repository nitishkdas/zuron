// The Zuron logo mark — same shape data as src/app/icon.svg and
// src/app/apple-icon.tsx, except the tile background tracks the
// app's light/dark mode via --brand-mark-bg (globals.css) instead of
// staying fixed dark like the favicon. Self-contained (own
// background tile), so drop it in directly without a wrapping
// bg-primary/rounded box.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="116 46 268 268"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="116"
        y="46"
        width="268"
        height="268"
        rx="48"
        fill="var(--brand-mark-bg)"
      />
      <line
        x1="185"
        y1="180"
        x2="315"
        y2="180"
        stroke="#9367d4"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <line
        x1="185"
        y1="180"
        x2="245"
        y2="250"
        stroke="#b08eed"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <circle cx="185" cy="180" r="39" fill="#c39df5" />
      <circle cx="315" cy="180" r="39" fill="#855bce" />
      <circle cx="245" cy="110" r="16" fill="#885ccf" />
      <circle cx="245" cy="250" r="16" fill="#c49ef5" />
    </svg>
  );
}
