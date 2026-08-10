import { ImageResponse } from "next/og";

// Apple touch icons must be a raster image — iOS doesn't accept SVG
// here — so this re-renders the same mark as icon.svg via next/og
// instead of referencing that file directly. Keep the two in sync if
// the mark ever changes.

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="116 46 268 268"
        width={size.width}
        height={size.height}
      >
        <rect x="116" y="46" width="268" height="268" rx="48" fill="#1b1c24" />
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
    ),
    { ...size },
  );
}
