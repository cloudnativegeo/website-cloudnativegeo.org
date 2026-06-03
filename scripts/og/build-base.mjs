// build-base.mjs — bake the static OG card "chrome" to assets/og/base*.png (1200×630).
//
// Hugo can't draw shapes or rasterize SVG, so the parts of each card that never
// change — grounds, bars, the CNG wordmark, the footer rule — are rendered ONCE
// here and committed. At build time the og/card-*.html partials overlay only the
// dynamic text (URL, headline, footer) onto these bases with images.Text. Outputs:
//   base.png · base-event.png · base-event-chrome.png · base-brand.png
//
// This is a one-time / on-design-change step, NOT part of `hugo` builds. Run it
// from the repo root so the dependency never lands in git:
//
//   npm i @resvg/resvg-js && node scripts/og/build-base.mjs && rm -rf node_modules package*.json
//
// Geometry: card 1200×630; top bar height = 48px logo + 2*32px padding = 112px;
// bar wordmark at x=88 y=32; footer rule at y=500.

import { Resvg } from "@resvg/resvg-js";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const OG = path.join(REPO, "assets", "og");

const SOFT_WHITE = "#F2F4F6";
const BONUS_BLUE = "#2126F7";
const PAD_X = 88;
const RIGHT_EDGE = 1112;
const BAR_H = 112; // 48px logo + 2 * 32px padding
const LOGO_H = 48;
const LOGO_VB_H = 311.75; // wordmark viewBox height (for the scale factor)
const LOGO_Y = 32;

// CNG wordmark path (from card.html, fill=currentColor → Soft White here).
const WORDMARK_D =
  "M415.02 208.9c-21.69 0-28.11-10.42-28.11-47.87s6.42-48.46 28.11-48.46c14.26 0 19.28 4.4 21.89 19.03h25.1c-1.2-31.45-11.85-40.86-46.99-40.86-41.58 0-53.82 16.02-53.82 70.29s12.26 69.7 53.82 69.7c35.34 0 46.39-9.01 48.2-39.66h-25.1c-2.21 13.82-7.43 17.83-23.09 17.83Zm142.08-37.84 2.8 28.43h-.6L510.43 92.75h-31.24v136.18h24.64v-78.3l-2.81-28.44h.61l48.86 106.75h31.24V92.76H557.1zm92.56 2.99h28.28v30.65c-6.82 3-11.84 4.01-22.26 4.01-23.67 0-30.69-9.8-30.69-47.26s6.41-48.67 28.08-48.67c17.85 0 23.47 4.01 24.67 17.63h24.87c-1.61-30.65-13.04-39.66-49.74-39.66-40.92 0-53.15 16.02-53.15 70.09s12.83 69.9 56.56 69.9c17.65 0 28.08-2.41 45.93-10.62v-67.89h-52.54v21.83ZM291.6 85.81 189.84 2.36C187.98.83 185.64 0 183.23 0h-35.76c-1.82 0-3.62.4-5.27 1.16L24.09 55.73c-4.5 2.08-7.59 6.37-8.14 11.3L.1 209.11a15.59 15.59 0 0 0 5.61 13.8l105.25 86.47c1.87 1.53 4.2 2.37 6.62 2.37h32.16c1.82 0 3.63-.4 5.28-1.16l120.56-55.85c4.22-1.96 7.11-5.98 7.63-10.6l15.57-140.72c.74-6.7-1.96-13.32-7.17-17.6ZM149.8 226.17c-69.08-19.75-67.08-121.75-.64-141.69 33.56 9.11 51.71 39.48 51.42 71.33-.27 30.38-18.2 61.67-50.78 70.36";

// Wordmark <g> at the standard bar position, in a given color.
const wordmark = (fill) =>
  `<g transform="translate(${PAD_X}, ${LOGO_Y}) scale(${LOGO_H / LOGO_VB_H})"><path d="${WORDMARK_D}" fill="${fill}"/></g>`;
// Wordmark at an arbitrary height/y (for the bar-less brand card).
const wordmarkAt = (fill, h, y) =>
  `<g transform="translate(${PAD_X}, ${y}) scale(${h / LOGO_VB_H})"><path d="${WORDMARK_D}" fill="${fill}"/></g>`;

// The thin metadata rule at y=500, in two tones: dark for the light Masthead
// ground, light for the blue event/brand grounds. Same position on every card.
const RULE_DARK = `<line x1="${PAD_X}" y1="500" x2="${RIGHT_EDGE}" y2="500" stroke="#2F343B" stroke-opacity="0.16" stroke-width="2"/>`;
const RULE_LIGHT = `<line x1="${PAD_X}" y1="500" x2="${RIGHT_EDGE}" y2="500" stroke="${SOFT_WHITE}" stroke-opacity="0.28" stroke-width="2"/>`;

// Masthead base (blog): Soft White ground, Bonus Blue bar, white wordmark, dark rule.
const baseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect x="0" y="0" width="1200" height="630" fill="${SOFT_WHITE}"/>
  <rect x="0" y="0" width="1200" height="${BAR_H}" fill="${BONUS_BLUE}"/>
  ${wordmark(SOFT_WHITE)}
  ${RULE_DARK}
</svg>`;

// Event base (inverted): Bonus Blue ground, Soft White bar, blue wordmark, light rule.
const eventSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect x="0" y="0" width="1200" height="630" fill="${BONUS_BLUE}"/>
  <rect x="0" y="0" width="1200" height="${BAR_H}" fill="${SOFT_WHITE}"/>
  ${wordmark(BONUS_BLUE)}
  ${RULE_LIGHT}
</svg>`;

// Event chrome overlay (transparent): the same bar + wordmark + rule PLUS dark-blue
// legibility gradients (left, for the headline; bottom, for the footer). This is
// composited ON TOP of a duotoned photo for flagship events (see card-event.html),
// so the photo never shows through the bar and white text stays legible.
const DEEP_BLUE = "#0B0E66";
const eventChromeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="l" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${DEEP_BLUE}" stop-opacity="0.72"/>
      <stop offset="1" stop-color="${DEEP_BLUE}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="b" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${DEEP_BLUE}" stop-opacity="0.82"/>
      <stop offset="1" stop-color="${DEEP_BLUE}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="${BAR_H}" width="780" height="${630 - BAR_H}" fill="url(#l)"/>
  <rect x="0" y="350" width="1200" height="280" fill="url(#b)"/>
  <rect x="0" y="0" width="1200" height="${BAR_H}" fill="${SOFT_WHITE}"/>
  ${wordmark(BONUS_BLUE)}
  ${RULE_LIGHT}
</svg>`;

// Brand / landing base (home, /about, /join, section landings): full-bleed Bonus
// Blue, NO bar — a larger white wordmark sits directly on the blue, with the same
// faint footer rule. Title/tagline/URL are drawn on top (see card-brand.html).
const BRAND_LOGO_H = 76;   // larger than the bar logo; sits lower for crop safety
const brandSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect x="0" y="0" width="1200" height="630" fill="${BONUS_BLUE}"/>
  ${wordmarkAt(SOFT_WHITE, BRAND_LOGO_H, 80)}
  ${RULE_LIGHT}
</svg>`;

fs.mkdirSync(OG, { recursive: true });
for (const [name, svg] of [
  ["base.png", baseSvg],
  ["base-event.png", eventSvg],
  ["base-event-chrome.png", eventChromeSvg],
  ["base-brand.png", brandSvg],
]) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  fs.writeFileSync(path.join(OG, name), png);
  console.log(`wrote ${path.join(OG, name)}`);
}
