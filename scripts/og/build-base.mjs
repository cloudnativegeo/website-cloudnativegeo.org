// build-base.mjs — bake the static OG card "chrome" to assets/og/base.png (1200×630).
//
// Hugo can't draw shapes or rasterize SVG, so the parts of the card that never
// change — the Soft White ground, the full-bleed Bonus Blue top bar, and the
// CNG wordmark — are rendered ONCE here and committed. At build time the Hugo
// partial (layouts/partials/opengraph.html) overlays only the dynamic text
// (URL, headline, footer) onto this base with images.Text.
//
// This is a one-time / on-design-change step, NOT part of `hugo` builds. Run it
// from a throwaway dir so the dependency never lands in the repo:
//
//   mkdir -p /tmp/ogbake && cd /tmp/ogbake && npm i @resvg/resvg-js
//   node /ABS/PATH/scripts/og/build-base.mjs   # writes assets/og/base.png
//
// Geometry mirrors design_handoff_og_cards/card.html exactly:
//   card 1200×630 · padding 0 88 76 · top bar padding 32 88, logo 48px tall
//   → bar height = 48 + 2*32 = 112px, wordmark at x=88 y=32.

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
const LOGO_VB_W = 702.61; // wordmark viewBox width
const LOGO_VB_H = 311.75; // wordmark viewBox height
const LOGO_W = (LOGO_H * LOGO_VB_W) / LOGO_VB_H;
const LOGO_Y = 32;

// CNG wordmark path (from card.html, fill=currentColor → Soft White here).
const WORDMARK_D =
  "M415.02 208.9c-21.69 0-28.11-10.42-28.11-47.87s6.42-48.46 28.11-48.46c14.26 0 19.28 4.4 21.89 19.03h25.1c-1.2-31.45-11.85-40.86-46.99-40.86-41.58 0-53.82 16.02-53.82 70.29s12.26 69.7 53.82 69.7c35.34 0 46.39-9.01 48.2-39.66h-25.1c-2.21 13.82-7.43 17.83-23.09 17.83Zm142.08-37.84 2.8 28.43h-.6L510.43 92.75h-31.24v136.18h24.64v-78.3l-2.81-28.44h.61l48.86 106.75h31.24V92.76H557.1zm92.56 2.99h28.28v30.65c-6.82 3-11.84 4.01-22.26 4.01-23.67 0-30.69-9.8-30.69-47.26s6.41-48.67 28.08-48.67c17.85 0 23.47 4.01 24.67 17.63h24.87c-1.61-30.65-13.04-39.66-49.74-39.66-40.92 0-53.15 16.02-53.15 70.09s12.83 69.9 56.56 69.9c17.65 0 28.08-2.41 45.93-10.62v-67.89h-52.54v21.83ZM291.6 85.81 189.84 2.36C187.98.83 185.64 0 183.23 0h-35.76c-1.82 0-3.62.4-5.27 1.16L24.09 55.73c-4.5 2.08-7.59 6.37-8.14 11.3L.1 209.11a15.59 15.59 0 0 0 5.61 13.8l105.25 86.47c1.87 1.53 4.2 2.37 6.62 2.37h32.16c1.82 0 3.63-.4 5.28-1.16l120.56-55.85c4.22-1.96 7.11-5.98 7.63-10.6l15.57-140.72c.74-6.7-1.96-13.32-7.17-17.6ZM149.8 226.17c-69.08-19.75-67.08-121.75-.64-141.69 33.56 9.11 51.71 39.48 51.42 71.33-.27 30.38-18.2 61.67-50.78 70.36";

// Wordmark <g> at the standard bar position, in a given color.
const wordmark = (fill) =>
  `<g transform="translate(${PAD_X}, ${LOGO_Y}) scale(${LOGO_H / LOGO_VB_H})"><path d="${WORDMARK_D}" fill="${fill}"/></g>`;

// Masthead base (blog/pages): Soft White ground, Bonus Blue bar, white wordmark.
const baseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect x="0" y="0" width="1200" height="630" fill="${SOFT_WHITE}"/>
  <rect x="0" y="0" width="1200" height="${BAR_H}" fill="${BONUS_BLUE}"/>
  ${wordmark(SOFT_WHITE)}
</svg>`;

// Event base (inverted): Bonus Blue ground, Soft White bar, blue wordmark, and a
// faint white footer rule (the tagline must clear it; see card-event.html).
const eventSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect x="0" y="0" width="1200" height="630" fill="${BONUS_BLUE}"/>
  <rect x="0" y="0" width="1200" height="${BAR_H}" fill="${SOFT_WHITE}"/>
  ${wordmark(BONUS_BLUE)}
  <line x1="${PAD_X}" y1="500" x2="${RIGHT_EDGE}" y2="500" stroke="${SOFT_WHITE}" stroke-opacity="0.28" stroke-width="2"/>
</svg>`;

fs.mkdirSync(OG, { recursive: true });
for (const [name, svg] of [["base.png", baseSvg], ["base-event.png", eventSvg]]) {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  fs.writeFileSync(path.join(OG, name), png);
  console.log(`wrote ${path.join(OG, name)}`);
}
