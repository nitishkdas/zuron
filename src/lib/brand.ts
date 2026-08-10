/**
 * Single source of truth for the product's display name and tagline.
 *
 * Scoped to cosmetic branding only — the browser tab title, page
 * copy, localStorage key prefixes. It deliberately does NOT cover:
 *   - `API_KEY_PREFIX` (src/lib/api-keys/keys.ts) and the
 *     `X-Wacrm-*` webhook headers (src/lib/webhooks/) — renaming
 *     those breaks existing API keys and webhook integrations for
 *     anyone already running this instance.
 *   - The `wacrm.tech` fallback in
 *     src/app/api/account/invitations/route.ts — that's a literal
 *     reference to the upstream project's docs site, not this
 *     product's name.
 *   - messages/*.json — translated UI copy that mentions the brand
 *     inline. Swapping those requires editing each locale's prose
 *     directly (and re-checking grammar), not a constant swap.
 */

export const BRAND_NAME = "Zuron";

// Lowercase slug for localStorage key prefixes — kept separate from
// BRAND_NAME so storage keys stay lowercase even though the display
// name is capitalized.
export const BRAND_SLUG = BRAND_NAME.toLowerCase();

export const BRAND_TAGLINE = "Where your team connects with customers on WhatsApp.";

export const BRAND_DESCRIPTION =
  "Zuron is where your team connects with customers on WhatsApp — shared inbox, pipelines, broadcasts, and automations, built for scale.";
