# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About

The cloudnativegeo.org website for the Cloud-Native Geospatial Forum (CNG), built with [Hugo](https://gohugo.io) and deployed on Vercel. Hugo version: **0.143.1** (see `vercel.json`).

## Commands

```bash
# Local development server with live reload
hugo server

# Build for production
hugo --gc --minify

# Build for staging (sets noindex meta tag)
HUGO_ENV=staging hugo server
```

## Architecture

This is a standard Hugo site with custom layouts (no theme is active — the `themes/` submodules are present but unused).

### Content organization

- `content/blog/YYYY/YYMMDD-slug.md` — blog posts, organized by year
- `content/events/YYMMDD-slug.md` — event pages
- `content/sponsorship/` — sponsorship prospectus pages
- `content/ctas/` — call-to-action pages (e.g. join, conference registration)
- `data/members.json`, `data/editorial_board.json`, `data/virtual_keynotes.json` — structured data rendered via shortcodes

### URL structure

Permalinks are configured in `hugo.toml`:
- Blog posts: `/blog/:year/:month/:slug/`
- Events: `/events/:slug/`

### Images

Blog post images live in `assets/images/` (not alongside the content files). The naming convention is `YYYYMMDD-descriptive-name.ext`. Reference them in markdown using the `{{< img >}}` shortcode with a path relative to `assets/`:

```
{{< img src="images/20250127-duckdb-map1.gif" alt="Description" >}}
```

The `{{< img >}}` shortcode (in `layouts/shortcodes/img.html`) handles responsive srcsets for raster images and passes GIFs/SVGs through as-is.

### Open Graph cards

Every single page gets a generated 1200×630 OG card as its `og:image`, rendered entirely in the Hugo build — no headless browser or Node step. Two styles: the **Masthead** card (blog + generic pages) and an inverted **Event** card (the `events` section — blue ground, white headline, `venue · time` / URL footer). The dispatcher/renderer is `layouts/partials/og/card.html` (wired in via `opengraph.html`), with `card-event.html` for events and a shared `fit.html` auto-fit; text is overlaid onto the committed chrome `assets/og/base.png` / `base-event.png`, sized via the font metrics in `data/og_metrics.json`. Explicit front-matter `images:` still overrides; flagship events can set `og_card_base:` for a duotone background. See `scripts/og/README.md` for the full pipeline.

### Front matter

Blog posts use these front matter fields:
```yaml
title: "Post Title"
date: 2025-01-27T01:00:38-04:00
summary: "Used as meta description and post preview."
author: "[Name](https://link)"
author_title: "Title, Organization"
```

Event pages additionally support: `event_date`, `display_date`, `where`, `description`, `images`, `hide_cta`, `cta_text`, `cta_url`.

Set `hide_cta: true` to suppress the membership CTA banner on a page. Set `prs_open: true` to show a "suggest edits on GitHub" link on non-blog pages.

### Layouts

- `layouts/_default/baseof.html` — base template (header, footer, prefetch/speculation rules)
- `layouts/_default/single.html` — default single page (renders author/date meta, blog edit link)
- `layouts/partials/` — reusable partials (header, footer, head, opengraph, etc.)
- `layouts/shortcodes/` — custom shortcodes: `img`, `imgh`, `editorial-board`, `member-list`, `virtual-keynotes`, `staff`, `tweet`, `zoom-registration`, `email-signup`, `join-button`, `donate`, `toc`

### Styling

CSS lives in `assets/css/main.css` and `assets/css/syntax.css`. Both are minified and fingerprinted at build time. Syntax highlighting CSS is only loaded on blog posts or pages with `highlight: true` in front matter.

### Deployment

Deployed automatically via Vercel on push. The `staging` branch deploys with `HUGO_ENV=staging`, which adds `noindex` meta tags. The `main` branch is the production site.
