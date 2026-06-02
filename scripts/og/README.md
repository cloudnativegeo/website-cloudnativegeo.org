# Dynamic Open Graph cards

Every single page on cloudnativegeo.org gets a generated 1200×630 Open Graph card
(the "Masthead" design: Bonus Blue top bar + CNG wordmark, auto-fit iA Writer
Quattro headline, Berkeley Mono footer). The card is the `og:image` for that page.

Unlike the old approach (`images.Text` over `og_base.png`, blog-only), this is done
**entirely in the Hugo build** — no headless browser, no Node step, no Vercel-specific
runtime. The build command stays `hugo --gc --minify`.

## How it works

| Piece | What it is | Regenerate when |
|---|---|---|
| `assets/og/base.png` | The static chrome (Soft White ground + Bonus Blue bar + CNG wordmark), baked once. Hugo can't draw shapes or rasterize SVG, so this is committed. | The bar/logo/colors change |
| `data/og_metrics.json` | Per-glyph advance widths for Quattro Bold + the Berkeley Mono advance, in em units. Lets the Hugo template *measure* text to reproduce the headline auto-fit. | The fonts change |
| `layouts/partials/og/card.html` | The renderer. Picks the per-section content (title/url/footer), greedy-wraps + binary-searches the headline size against the metrics, and overlays headline/URL/footer onto `base.png` with `images.Text`. Returns the `og.png` resource. | — |
| `layouts/partials/opengraph.html` | Calls `og/card.html` for any single page lacking an explicit front-matter `images:`. | — |

Precedence for `og:image`: explicit front-matter `images:` → dynamic card (single
pages) → `home_og.jpg` (home + list pages).

Content mapping (footer slots auto-hide when empty; the left slot truncates with an
ellipsis so it never collides with the right):

| Slot | Blog | Event | Other page |
|---|---|---|---|
| url | `/blog` | `/events` | root |
| left | `author` | `where` | — |
| right | date (`02 Jan 2006`) | `display_date` | — |

## Regenerating the committed artifacts

Both are one-time / on-change steps, **not** part of `hugo` builds.

**Metrics** (stdlib + fonttools, already available):

```bash
python3 scripts/og/gen-metrics.py     # writes data/og_metrics.json
```

**Base chrome** (needs a one-off SVG rasterizer; keep it out of the repo):

```bash
npm i @resvg/resvg-js              # in repo root; do NOT commit node_modules
node scripts/og/build-base.mjs     # writes assets/og/base.png
rm -rf node_modules package*.json  # clean up
```

After regenerating, rebuild and spot-check a few cards in `public/**/og.png`
(a short title, a long title, an event, a generic page).

## Known fidelity notes vs the approved card.html

`images.Text` has no letter-spacing, so the headline lacks the design's −0.026em
tracking and the footer its +0.04em; wrapping is greedy rather than `text-wrap:
balance`; text is Go-rendered rather than browser-rendered. All are minor at
feed-thumbnail scale. If exactness ever matters more than a self-contained build,
the fallback is the Satori or headless-browser pipeline from the original design
handoff.
