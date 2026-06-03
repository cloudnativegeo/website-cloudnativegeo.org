# Dynamic Open Graph cards

Every page on cloudnativegeo.org gets a generated 1200×630 Open Graph card — the
`og:image` for that page. There are three styles, picked by page type:

- **Blog posts → Masthead**: Soft White ground, Bonus Blue top bar + white CNG
  wordmark + the URL, a `BLOG POST` eyebrow (Bonus Blue) over an auto-fit iA Writer
  Quattro headline in ink, and a footer over a thin rule: author (left), date (right).
- **Single event pages → Event**: the photo-negative — Bonus Blue ground, Soft
  White bar with a blue wordmark + the events URL, an `EVENT` eyebrow (Sunshine
  Yellow) over a centered white headline, and a footer over a thin rule with the
  same grammar as the blog card: location (left), date with the time tucked under
  it (right). Flagship events can use a duotone photo ground.
- **Home, section landings (/blog, /events), and all generic pages → Brand**:
  full-bleed Bonus Blue, **no bar** — a larger white wordmark sits directly on the
  blue, with the white title + tagline centered, a faint rule, and the page URL
  bottom-right.

Unlike the old approach (`images.Text` over `og_base.png`, blog-only), this is done
**entirely in the Hugo build** — no headless browser, no Node step, no Vercel-specific
runtime. The build command stays `hugo --gc --minify`.

## How it works

| Piece | What it is | Regenerate when |
|---|---|---|
| `assets/og/base.png` | Masthead chrome (Soft White ground + Bonus Blue bar + white wordmark), baked once. Hugo can't draw shapes or rasterize SVG, so this is committed. | The bar/logo/colors change |
| `assets/og/base-event.png` | Event chrome (Bonus Blue ground + Soft White bar + blue wordmark + footer rule), baked once. | The event chrome changes |
| `assets/og/base-event-chrome.png` | Transparent event chrome + legibility gradients, composited over a duotone photo for flagship events. | The event chrome changes |
| `assets/og/base-brand.png` | Brand chrome: full-bleed Bonus Blue + a larger white wordmark (no bar) + footer rule. | The brand chrome changes |
| `data/og_metrics.json` | Per-glyph advance widths for Quattro Bold + the Berkeley Mono advance, in em units. Lets the template *measure* text to reproduce the headline auto-fit. | The fonts change |
| `layouts/partials/og/fit.html` | Shared auto-fit: greedy word-wrap + largest font size fitting the headline box, from the metrics. Used by all renderers. | — |
| `layouts/partials/og/card.html` | Dispatcher + Masthead (blog) renderer. Routes single event pages to `card-event.html`, everything else (home, lists, generic pages) to `card-brand.html`. | — |
| `layouts/partials/og/card-event.html` | Event renderer: date/headline/tagline/footer onto `base-event.png` (or a duotone photo ground). | — |
| `layouts/partials/og/card-brand.html` | Brand renderer: title/tagline/URL onto `base-brand.png`. | — |
| `layouts/partials/og/mono.html` | Loads the Berkeley Mono TTF (CDN at build, local fallback for dev). | — |
| `layouts/partials/opengraph.html` | Picks the card per page type and emits the og:image meta. | — |

Precedence for `og:image`: every page gets a card by default. A blog or generic
single page may override with an explicit front-matter `images:`; events keep
their card (`images:` is the in-page hero) and home/list pages keep the brand card.

Content mapping:

| Slot | Blog (Masthead) | Single event | Brand (home/lists/pages) |
|---|---|---|---|
| top-bar right | the URL | the events URL | — (no bar) |
| eyebrow | `BLOG POST` (Bonus Blue) | `EVENT` (Sunshine Yellow) | — |
| headline | `.Title` (ink) | `.Title` (white) | `.Title` (white, " - CNG" stripped) |
| under headline | — | — | site tagline |
| footer left | `author` | location (`where` before ` - `) | — |
| footer right | date (`02 Jan 2006`) | `display_date`, with `when_time` tucked under it | the page URL |

Blog and event share one footer grammar: a thin rule (dark on the light ground,
faint white on blue) above a left/right metadata row. Footer slots auto-hide when
empty; the long slot truncates with an ellipsis so it never collides with the other.

### Flagship event backgrounds (duotone photo)

A flagship event can swap the flat blue ground for a **Bonus-Blue duotone of a
photo**, converted at build time — no pre-baked asset. In the event's front matter:

```yaml
og_card_photo: images/250603-cng-conf-open.jpg   # path under assets/
og_card_treatment: duotone                        # optional; duotone is the default/only treatment
```

`card-event.html` crops the photo to 1200×630 (`.Fill … Smart`), desaturates it
(`images.Grayscale`), recolors it blue (`images.Colorize`), then composites the
transparent `assets/og/base-event-chrome.png` overlay on top — that overlay carries
the opaque Soft White bar, the blue wordmark, the footer rule, and the dark-blue
left/bottom legibility gradients that keep the white headline and footer readable.
Text is then drawn exactly as on the flat card, so the layout never moves.

`og_card_photo` is independent of `images:` (which remains the in-page hero in
`events/single.html`); setting it makes the duotone card the event's `og:image`.
Tune the duotone with the `images.Colorize HUE SAT PERCENT` args in card-event.html.

## Regenerating the committed artifacts

Both are one-time / on-change steps, **not** part of `hugo` builds.

**Metrics** (stdlib + fonttools, already available):

```bash
python3 scripts/og/gen-metrics.py     # writes data/og_metrics.json
```

**Base chrome** (needs a one-off SVG rasterizer; keep it out of the repo):

```bash
npm i @resvg/resvg-js              # in repo root; do NOT commit node_modules
node scripts/og/build-base.mjs     # writes assets/og/base.png + base-event.png
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
