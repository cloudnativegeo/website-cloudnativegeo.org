---
title: "Adding native multiscales to virtual Icechunk stores"
date: 2026-04-03T00:00:00-04:00
slug: virtual-icechunk-multiscale
summary:
  "Exploring virtualized NetCDF with native Icechunk multiscales for seamless
  multi-resolution snow data on the web."
author:
  "[Raphael Hagen](https://github.com/norlandrhagen) and [Shane
  Loeffler](https://github.com/Shane98c)"
hide_cta: true
---

<div id="snow-hero">
  <div id="snow-hero-map"></div>
</div>

## A rough winter

This winter provided one of the lowest snowpacks in recent memory to the Western
U.S. Looking at the NWCC Snotel basin map, we can see just how bad it was.

If we wanted to explore just how little snowpack we got, we could look somewhere
like NOAA’s NOHRSC to get raster data of the snowpack. They provide gridded
NetCDF files generally used for scientific analysis. So, how can we use these to
visualize the snowpack in a web-map?

## Web mapping primer

Common ways to visualize gridded data on the web usually involve setting up a
dynamic tile-server, which is just a computer tasked with reading some source
data and serving you images based on where you are looking in your map. This is
super common, but has some downsides. Instead of giving you the un-modified
analysis data, it sends a PNG or image. This means that updating time sliders or
colormaps requires fetching new images. You also need to usually set up a
service that has to run whenever anyone uses the map. Viewing high-resolution
data at very zoomed out views is also challenging, either requiring data
aggregation on-the-fly or duplication of the full dataset to a pre-built
pyramid.

Web-maps, without a tile-server. Recently, we at CarbonPlan released zarr-layer,
an open-source library for rendering gridded data directly in the browser. Given
a pointer to a Zarr store, `zarr-layer` reprojects the data on your GPU and
renders it in a web-map without requiring an intermediary tile-server.

This approach works great…if you have full control over your data and can write
it to Zarr or Icechunk, but there are Petabytes of gridded climate and weather
data stored in archival file formats such as NetCDF/HDF5, GRIB, TIFF and others.
Fortunately, tools like VirtualiZarr let you read these data archives as if they
were Zarr. So if all\* of these data can be thought of as Zarr, can zarr-layer
render them in a serverless web-map? Tying together a few tools
`Virtualizarr + Icechunk + Icechunk-js + Zarrita + ZarrLayer`, we can render
archival gridded datasets directly in the browser!

<Diagram>

This works as of today, but it’s still super new and experimental. This means
that there are bound to be lots of edge cases that don’t work, for example, too
large chunk sizes or incompatible codecs.

## Building the pyramids

zarr-layer shares another challenge with tile-servers: it is really hard to
visualize high spatial resolution data when you are zoomed out. Dynamic
tile-servers try to get around this with some on-the-fly aggregation, where the
images they send to the map are coarsened versions of the data. Since zarr-layer
is serverless, you can't do that. However, borrowing a concept from GeoTIFF, we
can create overviews / pyramids / multiscales, which are pre-generated coarsened
versions of data at multiple zoom levels. To make this easy, we released a
light-weight accompanying library called topozarr, which allows you to create
coarsened Zarr multiscales in the evolving GeoZarr spec.

## Putting it all together

With these tools we can create a hybrid multiscale pyramid stored in a single
Icechunk store. The base level is a virtual Zarr store that points directly to
the analysis-grade archival data, while the coarsened overviews are
pre-generated and stored as Zarr, giving you performant visualization across
zoom levels without having to duplicate the data.

## So you’re not running a server… what else?

This seems like a lot of work to have to avoid paying a cloud provider to rent a
computer, but now that we have the actual data in the browser, we can do lots of
cool stuff with it that can’t be done with a tile-server. The data that you are
looking at in the map is the actual analysis data, not some image representation
of it. We can do math on this data! As a quick example, this next map shows the
difference between each grid cell’s SWE/snow--depth/ between this winter and the
previous. This is just the tip-of-the iceberg in complexity, but it shows you
what you have access to.

<div id="icechunk-panel">
  <div id="map-legend">
    <div id="legend-bar"></div>
    <div id="legend-labels">
      <span id="legend-min"></span>
      <span id="legend-max"></span>
    </div>
  </div>
  <div id="icechunk-map"></div>
  <div id="zoom-indicator">
    <div id="season-row">
      <span class="label">Season</span>
      <div id="season-toggle">
        <button type="button" data-mode="diff">Δ this − last</button>
        <button type="button" data-mode="prev">Last season 2024/25</button>
        <button type="button" data-mode="this">This season 2025/26</button>
      </div>
    </div>
    <div class="top-row">
      <span class="label">Source</span>
      <span id="zoom-level" class="zoom-level"></span>
    </div>
    <span id="source-native" class="source-row"><span class="dot"></span>Zarr Multiscales</span>
    <span id="source-virtual" class="source-row"><span class="dot"></span>Virtualized NetCDF</span>
  </div>
</div>

## Bonus

We can also query the data, from a point selector, or with a custom polygon.
Here we have a simple GeoJSON boundary of the [WATERSHED]. We can use it to do a
geospatial query to get the basin average.

Disclaimer This is exploratory, but it’s all free and open-source. We want to
see what you build with it. Please open issues on GitHub, reach out to us at
hello@carbonplan.org, or reach out in the CNG Slack channel.

<link rel="stylesheet" href="https://esm.sh/maplibre-gl@5.16.0/dist/maplibre-gl.css" />

<script type="importmap">
{
  "imports": {
    "icechunk-js": "https://esm.sh/icechunk-js@0.4.0?external=zarrita",
    "@carbonplan/zarr-layer": "https://esm.sh/@carbonplan/zarr-layer@0.5.0?external=zarrita",
    "zarrita": "https://esm.sh/zarrita@0.7.2"
  }
}
</script>

<style>
  #icechunk-panel,
  #snow-hero {
    position: relative;
    margin: 2rem 0;
    border: 1px solid var(--color-border, #ccc);
    overflow: hidden;
  }
  #snow-hero-map {
    width: 100%;
    height: 450px;
    background: var(--color-bg, #f2f4f6);
  }
  #map-legend {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 1;
    padding: 6px 8px;
    background: var(--color-bg-code, #e5e7ea);
    border: 1px solid var(--color-border, #ccc);
    color: var(--color-text, #2f343b);
    font-family: 'IBMPlexSansMono', monospace;
    font-size: 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 3px;
    pointer-events: none;
  }
  #legend-bar {
    width: 140px;
    height: 8px;
  }
  #legend-labels {
    display: flex;
    justify-content: space-between;
  }
  #icechunk-map {
    width: 100%;
    height: 520px;
    background: var(--color-bg, #f2f4f6);
  }
  #zoom-indicator {
    font-family: 'iAWriterQuattro', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 1.8rem;
    line-height: 1.25;
    padding: 0.7rem 1.2rem;
    background: var(--color-bg-code, #e5e7ea);
    color: var(--color-text, #2f343b);
    border-top: 1px solid var(--color-border, #ccc);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  #zoom-indicator .top-row {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 10px;
  }
  #zoom-indicator .label {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 1.2rem;
    color: var(--color-text-muted, #666);
  }
  #zoom-indicator .zoom-level {
    font-family: 'IBMPlexSansMono', monospace;
    font-size: 1.15rem;
    color: var(--color-text-muted, #666);
  }
  #zoom-indicator .source-row {
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-border, #ccc);
  }
  #zoom-indicator .source-row.active { color: var(--color-text, #2f343b); }
  #zoom-indicator .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-border, #ccc);
    flex-shrink: 0;
  }
  #zoom-indicator .source-row.active .dot { background: var(--color-text, #2f343b); }
  #season-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 10px;
  }
  #season-toggle {
    display: inline-flex;
    border: 1px solid var(--color-border, #ccc);
    border-radius: 2px;
    overflow: hidden;
  }
  #season-toggle button {
    font-family: 'IBMPlexSansMono', monospace;
    font-size: 1.2rem;
    padding: 3px 9px;
    background: transparent;
    color: var(--color-text-muted, #666);
    border: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  #season-toggle button + button { border-left: 1px solid var(--color-border, #ccc); }
  #season-toggle button.active {
    background: var(--color-text, #2f343b);
    color: var(--color-bg, #f2f4f6);
  }
</style>

<script type="module">
import maplibregl from 'https://esm.sh/maplibre-gl@5.16.0'
import { ZarrLayer, codecRegistry } from '@carbonplan/zarr-layer'
import { IcechunkStore } from 'icechunk-js'
import { withRangeCoalescing } from 'zarrita'
import { Protocol } from 'https://esm.sh/pmtiles@4.3.0'
import { layers, namedFlavor } from 'https://esm.sh/@protomaps/basemaps@5.0.1'

const zlibFactory = codecRegistry.get('zlib')
if (zlibFactory) codecRegistry.set('numcodecs.zlib', zlibFactory)

codecRegistry.set('numcodecs.shuffle', async () => ({
  fromConfig(config) {
    const elementsize = config?.elementsize ?? 1
    return {
      kind: 'bytes_to_bytes',
      decode(bytes) {
        if (elementsize <= 1) return bytes
        const n = bytes.length
        const count = Math.floor(n / elementsize)
        const out = new Uint8Array(n)
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < elementsize; j++) {
            out[i * elementsize + j] = bytes[j * count + i]
          }
        }
        for (let i = count * elementsize; i < n; i++) {
          out[i] = bytes[i]
        }
        return out
      },
    }
  },
}))

const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

const CMAPS = {
  'water-light': ['#ffffff','#feffff','#fcfeff','#fbfeff','#fafeff','#f8fefe','#f7fdfe','#f6fdfe','#f5fdfe','#f3fdfe','#f2fcfe','#f1fcfe','#f0fcfe','#eefbfd','#edfbfd','#ecfbfd','#ebfbfd','#e9fafd','#e8fafd','#e7fafd','#e6f9fd','#e4f9fc','#e3f9fc','#e2f8fc','#e1f8fc','#e0f8fc','#def8fc','#ddf7fc','#dcf7fc','#dbf7fb','#d9f6fb','#d8f6fb','#d7f6fb','#d6f5fb','#d5f5fb','#d4f5fb','#d2f4fa','#d1f4fa','#d0f4fa','#cff3fa','#cef3fa','#cdf3fa','#ccf2fa','#caf2fa','#c9f2f9','#c8f1f9','#c7f1f9','#c6f1f9','#c5f0f9','#c4f0f9','#c3eff9','#c2eff8','#c1eff8','#c0eef8','#bfeef8','#bdeef8','#bcedf8','#bbedf7','#baedf7','#b9ecf7','#b8ecf7','#b7ebf7','#b6ebf7','#b5ebf7','#b4eaf6','#b3eaf6','#b2eaf6','#b1e9f6','#b0e9f6','#afe8f6','#aee8f5','#aee8f5','#ade7f5','#ace7f5','#abe6f5','#aae6f5','#a9e6f4','#a8e5f4','#a7e5f4','#a6e4f4','#a5e4f4','#a5e3f4','#a4e3f3','#a3e3f3','#a2e2f3','#a1e2f3','#a0e1f3','#a0e1f3','#9fe1f2','#9ee0f2','#9de0f2','#9ddff2','#9cdff2','#9bdef2','#9adef1','#9addf1','#99ddf1','#98ddf1','#97dcf1','#97dcf0','#96dbf0','#95dbf0','#95daf0','#94daf0','#94d9f0','#93d9ef','#92d8ef','#92d8ef','#91d7ef','#91d7ef','#90d7ee','#8fd6ee','#8fd6ee','#8ed5ee','#8ed5ee','#8dd4ed','#8dd4ed','#8dd3ed','#8cd3ed','#8cd2ed','#8bd2ec','#8bd1ec','#8ad1ec','#8ad0ec','#8ad0ec','#89cfeb','#89cfeb','#89ceeb','#88ceeb','#88cdeb','#88cdea','#88ccea','#88ccea','#88cbeb','#88caeb','#88caeb','#88c9eb','#88c8eb','#88c8ec','#88c7ec','#88c7ec','#88c6ec','#88c5ec','#88c5ec','#88c4ec','#88c4ed','#88c3ed','#88c2ed','#87c2ed','#87c1ed','#87c1ed','#87c0ed','#87bfed','#87bfee','#87beee','#87beee','#87bdee','#87bcee','#87bcee','#87bbee','#87bbee','#86baee','#86b9ee','#86b9ee','#86b8ee','#86b8ee','#86b7ee','#86b7ee','#86b6ef','#85b5ef','#85b5ef','#85b4ef','#85b4ef','#85b3ef','#85b3ef','#85b2ef','#84b1ef','#84b1ef','#84b0ef','#84b0ef','#84afef','#83afee','#83aeee','#83adee','#83adee','#83acee','#82acee','#82abee','#82abee','#82aaee','#82aaee','#81a9ee','#81a8ee','#81a8ee','#81a7ee','#80a7ed','#80a6ed','#80a6ed','#80a5ed','#7fa5ed','#7fa4ed','#7fa4ed','#7fa3ed','#7ea3ec','#7ea2ec','#7ea2ec','#7da1ec','#7da1ec','#7da0ec','#7da0eb','#7c9feb','#7c9feb','#7c9eeb','#7b9deb','#7b9dea','#7b9cea','#7a9cea','#7a9bea','#7a9bea','#799be9','#799ae9','#799ae9','#7899e9','#7899e8','#7898e8','#7798e8','#7797e8','#7797e7','#7696e7','#7696e7','#7595e6','#7595e6','#7594e6','#7494e5','#7493e5','#7393e5','#7392e4','#7392e4','#7291e4','#7291e3','#7191e3','#7190e3','#7190e2','#708fe2','#708fe1','#6f8ee1','#6f8ee1','#6e8de0','#6e8de0','#6e8ddf','#6d8cdf','#6d8cde','#6c8bde','#6c8bde','#6b8add'],
  'water-dark': ['#1b1e23','#1b1f24','#1c1f25','#1c2026','#1d2027','#1d2128','#1e2129','#1e222a','#1e222b','#1f232c','#1f232d','#20242e','#20242f','#212530','#212531','#212632','#222732','#222733','#232834','#232835','#232936','#242937','#242a38','#252a39','#252b3a','#252c3b','#262c3c','#262d3d','#272d3e','#272e3f','#272e40','#282f41','#283042','#293043','#293144','#293145','#2a3246','#2a3247','#2b3348','#2b3449','#2b344b','#2c354c','#2c354d','#2d364e','#2d364f','#2d3750','#2e3851','#2e3852','#2f3953','#2f3954','#2f3a55','#303b56','#303b57','#313c58','#313c59','#313d5a','#323e5b','#323e5c','#323f5d','#333f5e','#33405f','#344160','#344161','#344262','#354263','#354364','#354465','#364466','#364567','#374568','#374669','#37476a','#38476b','#38486c','#38496d','#39496e','#394a6f','#3a4a70','#3a4b71','#3a4c72','#3b4c74','#3b4d74','#3b4e76','#3c4e77','#3c4f78','#3d4f79','#3d507a','#3d517b','#3e517c','#3e527d','#3e537e','#3f537f','#3f5480','#405581','#405582','#405683','#415784','#415785','#415886','#425987','#425988','#425a89','#435b8a','#435b8b','#445c8c','#445d8d','#445d8e','#455e8f','#455f90','#455f91','#466092','#466193','#476194','#476295','#476396','#486397','#486498','#486599','#496599','#49669a','#49679b','#4a679c','#4a689d','#4b699e','#4b699f','#4b6aa0','#4c6ba1','#4c6ba2','#4c6ca3','#4d6da4','#4d6ea5','#4e6ea6','#4e6fa7','#4e70a7','#4f70a8','#4f71a9','#4f72aa','#5073ab','#5073ac','#5074ad','#5175ae','#5175af','#5276af','#5277b0','#5278b1','#5378b2','#5379b3','#537ab4','#547bb4','#547bb5','#547cb6','#557db7','#557db7','#567eb8','#567fb9','#5680ba','#5780ba','#5781bb','#5782bc','#5883bd','#5884bd','#5884be','#5985bf','#5986bf','#5a87c0','#5a87c0','#5a88c1','#5b89c2','#5b8ac2','#5b8bc3','#5c8bc3','#5c8cc4','#5c8dc4','#5d8ec5','#5d8fc5','#5d90c5','#5e90c6','#5e91c6','#5e92c6','#5f93c6','#5f94c7','#5f95c7','#6095c7','#6096c7','#6097c7','#6098c7','#6099c7','#619ac7','#619bc7','#619cc7','#619dc7','#629ec7','#629fc7','#629fc7','#62a0c7','#62a1c7','#63a2c7','#63a3c7','#63a4c7','#63a5c7','#64a6c7','#64a6c7','#64a7c7','#65a8c8','#65a9c8','#65aac8','#65abc8','#66acc8','#66adc8','#66adc9','#67aec9','#67afc9','#67b0c9','#68b1c9','#68b2ca','#68b3ca','#69b3ca','#69b4ca','#69b5cb','#6ab6cb','#6ab7cb','#6bb8cc','#6bb8cc','#6bb9cc','#6cbacd','#6cbbcd','#6dbccd','#6dbdce','#6ebdce','#6ebecf','#6fbfcf','#6fc0cf','#70c1d0','#70c2d0','#71c2d1','#71c3d1','#72c4d2','#72c5d2','#73c6d3','#73c6d3','#74c7d4','#75c8d4','#75c9d5','#76c9d6','#77cad6','#77cbd7','#78ccd8','#79cdd8','#79cdd9','#7aceda','#7bcfda','#7bd0db','#7cd0dc','#7dd1dc','#7ed2dd'],
  'redteal-light': ['#f57273','#f57374','#f67475','#f67676','#f67777','#f67878','#f77979','#f77a7a','#f77c7b','#f77d7c','#f87e7d','#f87f7e','#f8807f','#f88180','#f98381','#f98482','#f98583','#f98685','#fa8786','#fa8887','#fa8a88','#fa8b89','#fb8c8a','#fb8d8b','#fb8e8c','#fb8f8d','#fb908e','#fc928f','#fc9390','#fc9491','#fc9592','#fc9693','#fd9794','#fd9895','#fd9996','#fd9b98','#fd9c99','#fe9d9a','#fe9e9b','#fe9f9c','#fea09d','#fea19e','#fea29f','#ffa4a0','#ffa5a1','#ffa6a2','#ffa7a3','#ffa8a4','#ffa9a6','#ffaaa7','#ffaba8','#ffaca9','#ffadaa','#ffafab','#ffb0ac','#ffb1ad','#ffb2ae','#ffb3af','#ffb4b0','#ffb5b2','#ffb6b3','#ffb7b4','#ffb8b5','#ffbab6','#ffbbb7','#ffbcb8','#ffbdb9','#ffbeba','#ffbfbc','#ffc0bd','#ffc1be','#ffc2bf','#ffc3c0','#ffc4c1','#ffc6c2','#ffc7c3','#ffc8c4','#ffc9c6','#ffcac7','#ffcbc8','#ffccc9','#ffcdca','#ffcecb','#ffcfcc','#ffd0cd','#ffd2cf','#ffd3d0','#ffd4d1','#ffd5d2','#ffd6d3','#ffd7d4','#ffd8d5','#ffd9d7','#ffdad8','#ffdbd9','#ffdcda','#ffdddb','#ffdfdc','#ffe0dd','#ffe1df','#ffe2e0','#ffe3e1','#ffe4e2','#ffe5e3','#ffe6e4','#ffe7e5','#ffe8e7','#ffe9e8','#ffeae9','#ffecea','#ffedeb','#ffeeec','#ffefed','#fff0ef','#fff1f0','#fff2f1','#fff3f2','#fff4f3','#fff5f4','#fff6f6','#fff7f7','#fff9f8','#fffaf9','#fffbfa','#fffcfb','#fffdfd','#fffefe','#ffffff','#fefeff','#fdfefe','#fcfdfe','#fafdfd','#f9fcfd','#f8fcfc','#f7fbfc','#f6fbfb','#f5fafb','#f4f9fa','#f2f9fa','#f1f8f9','#f0f8f9','#eff7f8','#eef7f8','#edf6f7','#ecf6f7','#eaf5f6','#e9f4f6','#e8f4f6','#e7f3f5','#e6f3f5','#e5f2f4','#e3f2f4','#e2f1f3','#e1f1f3','#e0f0f2','#dfeff2','#deeff1','#ddeef1','#dbeef0','#daedf0','#d9edef','#d8ecef','#d7ecee','#d6ebee','#d4eaee','#d3eaed','#d2e9ed','#d1e9ec','#d0e8ec','#cfe8eb','#cee7eb','#cce7ea','#cbe6ea','#cae6e9','#c9e5e9','#c8e4e8','#c7e4e8','#c5e3e7','#c4e3e7','#c3e2e7','#c2e2e6','#c1e1e6','#c0e1e5','#bee0e5','#bddfe4','#bcdfe4','#bbdee3','#badee3','#b8dde2','#b7dde2','#b6dce1','#b5dce1','#b4dbe0','#b3dae0','#b1dae0','#b0d9df','#afd9df','#aed8de','#add8de','#abd7dd','#aad7dd','#a9d6dc','#a8d6dc','#a7d5db','#a5d4db','#a4d4da','#a3d3da','#a2d3da','#a0d2d9','#9fd2d9','#9ed1d8','#9dd1d8','#9cd0d7','#9acfd7','#99cfd6','#98ced6','#97ced5','#95cdd5','#94cdd4','#93ccd4','#92ccd4','#90cbd3','#8fcbd3','#8ecad2','#8dc9d2','#8bc9d1','#8ac8d1','#89c8d0','#88c7d0','#86c7cf','#85c6cf','#84c6ce','#82c5ce','#81c5ce','#80c4cd','#7ec3cd','#7dc3cc','#7cc2cc','#7ac2cb','#79c1cb','#78c1ca','#76c0ca','#75c0c9','#74bfc9','#72bec9','#71bec8','#6fbdc8','#6ebdc7','#6dbcc7','#6bbcc6','#6abbc6','#68bbc5','#67bac5','#65bac4','#64b9c4'],
  'redteal-dark': ['#f57273','#f37172','#f17172','#ef7071','#ed6f70','#ec6f70','#ea6e6f','#e86d6e','#e66d6e','#e46c6d','#e26b6c','#e06b6c','#de6a6b','#dd696a','#db696a','#d96869','#d76768','#d56768','#d36667','#d16566','#d06466','#ce6465','#cc6364','#ca6264','#c86263','#c66162','#c56062','#c36061','#c15f60','#bf5e60','#bd5e5f','#bc5d5e','#ba5c5e','#b85c5d','#b65b5c','#b45a5c','#b25a5b','#b1595a','#af585a','#ad5859','#ab5758','#aa5658','#a85657','#a65556','#a45456','#a25455','#a15354','#9f5254','#9d5253','#9b5153','#9a5052','#985051','#964f51','#944e50','#934e4f','#914d4f','#8f4d4e','#8d4c4d','#8c4b4d','#8a4b4c','#884a4b','#87494b','#85494a','#83484a','#814749','#804748','#7e4648','#7c4547','#7b4546','#794446','#774345','#754345','#744244','#724143','#704143','#6f4042','#6d3f41','#6b3f41','#6a3e40','#683d40','#663d3f','#653c3e','#633b3e','#613b3d','#603a3c','#5e393c','#5d393b','#5b383b','#59373a','#583739','#563639','#543638','#533538','#513437','#503436','#4e3336','#4c3235','#4b3235','#493134','#473033','#463033','#442f32','#432e32','#412e31','#402d30','#3e2c30','#3c2c2f','#3b2b2f','#392a2e','#382a2d','#36292d','#34282c','#33282c','#31272b','#30262b','#2e262a','#2d2529','#2b2529','#292428','#282328','#262327','#252226','#232126','#212125','#202025','#1e1f24','#1d1f24','#1b1e23','#1c1f24','#1c2025','#1d2126','#1d2227','#1e2328','#1f2429','#1f252b','#20262c','#20272d','#21282e','#212a2f','#222b30','#232c31','#232d32','#242e33','#242f35','#253036','#263137','#263238','#273339','#27343a','#28353b','#28373d','#29383e','#2a393f','#2a3a40','#2b3b41','#2b3c42','#2c3d44','#2c3e45','#2d4046','#2e4147','#2e4248','#2f4349','#2f444b','#30454c','#31464d','#31484e','#32494f','#324a51','#334b52','#334c53','#344d54','#354f56','#355057','#365158','#365259','#37535a','#37555c','#38565d','#39575e','#39585f','#3a5961','#3a5b62','#3b5c63','#3b5d64','#3c5e66','#3d5f67','#3d6168','#3e626a','#3e636b','#3f646c','#3f666d','#40676f','#416870','#416971','#426a72','#426c74','#436d75','#436e76','#446f78','#457179','#45727a','#46737c','#46757d','#47767e','#477780','#487881','#497a82','#497b83','#4a7c85','#4a7d86','#4b7f87','#4b8089','#4c818a','#4d838b','#4d848d','#4e858e','#4e868f','#4f8891','#4f8992','#508a93','#518c95','#518d96','#528e98','#528f99','#53919a','#53929c','#54939d','#55959e','#5596a0','#5697a1','#5699a2','#579aa4','#579ba5','#589da7','#599ea8','#599fa9','#5aa1ab','#5aa2ac','#5ba3ae','#5ba5af','#5ca6b0','#5da7b2','#5da9b3','#5eaab4','#5eabb6','#5fadb7','#5faeb9','#60afba','#61b1bc','#61b2bd','#62b4be','#62b5c0','#63b6c1','#63b8c3','#64b9c4'],
}
const cmode = isDark ? 'dark' : 'light'
const WATER = CMAPS[`water-${cmode}`]
const REDTEAL = CMAPS[`redteal-${cmode}`]

const PREV_YEAR_IDX = 0
const THIS_YEAR_IDX = 1

const CONFIG = {
  center: [-113.7, 40.7],
  zoom: 3.70,
  bounds: [-126, 21, -66, 55],
  maxBounds: [[-140, 15], [-55, 62]],
  minZoom: 2.5,
  nativeZoomThreshold: 4.13,
  defaultView: 'diff',
  hero: {
    view: 'diff',
    bounds: [-122, 26, -72, 49],
    fitPadding: 28,
  },
  views: {
    diff: { cmap: REDTEAL, clim: [-2, 2], legend: ['−2 m', '+2 m']  },
    this: { cmap: WATER,   clim: [0, 4],  legend: ['0 m',  '4+ m']  },
    prev: { cmap: WATER,   clim: [0, 4],  legend: ['0 m',  '4+ m']  },
  },
}

const DIFF_FRAG = `
  float diff = season_${THIS_YEAR_IDX} - season_${PREV_YEAR_IDX};
  float norm = (diff - clim.x) / (clim.y - clim.x);
  float cla = clamp(norm, 0.0, 1.0);
  vec4 c = texture(colormap, vec2(cla, 0.5));
  fragColor = vec4(c.r, c.g, c.b, opacity);
`

const bg = isDark ? '#1d232b' : '#f2f4f6'
const waterBg = isDark ? '#283342' : '#dde6ec'
const theme = {
  ...namedFlavor(isDark ? 'dark' : 'light'),
  background: bg, earth: bg, park_a: bg, park_b: bg,
  golf_course: bg, aerodrome: bg, industrial: bg,
  university: bg, school: bg, zoo: bg, farmland: bg,
  wood_a: bg, wood_b: bg, residential: bg, protected_area: bg,
  scrub_a: bg, scrub_b: bg,
  water: waterBg,
  landcover: {
    barren: bg, farmland: bg, forest: bg, glacier: bg,
    grassland: bg, scrub: bg, urban_area: bg,
  },
}

const protocol = new Protocol()
maplibregl.addProtocol('pmtiles', protocol.tile)

function makeStyle() {
  return {
    version: 8,
    glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
    sources: {
      protomaps: {
        type: 'vector',
        url: 'pmtiles://https://carbonplan-maps.s3.us-west-2.amazonaws.com/basemaps/pmtiles/global.pmtiles',
        attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
      },
    },
    layers: layers('protomaps', theme, { lang: 'en' }),
  }
}

const ICECHUNK_URL =
  'https://carbonplan-share.s3.us-west-2.amazonaws.com/zarr-layer-examples/CNG/NOHRSC/Icechunk/'

let store = null
const storePromise = IcechunkStore.open(ICECHUNK_URL, {
  branch: 'main',
  formatVersion: 'v1',
  withRangeCoalescing,
}).then(s => { store = s; return s })

function createLayer(mode, store) {
  const view = CONFIG.views[mode]
  const base = {
    id: 'snow',
    variable: 'snowfall_accumulation',
    store,
    opacity: 1,
    zarrVersion: 3,
    bounds: CONFIG.bounds,
    latIsAscending: false,
    colormap: view.cmap,
    clim: view.clim,
  }
  if (mode === 'diff') {
    return new ZarrLayer({
      ...base,
      selector: { season: { selected: [PREV_YEAR_IDX, THIS_YEAR_IDX], type: 'index' } },
      customFrag: DIFF_FRAG,
    })
  }
  return new ZarrLayer({
    ...base,
    selector: { season: { selected: mode === 'prev' ? PREV_YEAR_IDX : THIS_YEAR_IDX, type: 'index' } },
  })
}

const hero = new maplibregl.Map({
  container: 'snow-hero-map',
  style: makeStyle(),
  bounds: [[CONFIG.hero.bounds[0], CONFIG.hero.bounds[1]], [CONFIG.hero.bounds[2], CONFIG.hero.bounds[3]]],
  fitBoundsOptions: { padding: CONFIG.hero.fitPadding },
  interactive: false,
  attributionControl: false,
})
hero.on('load', async () => {
  try {
    hero.addLayer(createLayer(CONFIG.hero.view, await storePromise), 'landuse_pedestrian')
  } catch (err) {
    console.error('Failed to load Icechunk dataset (hero):', err)
  }
})

const map = new maplibregl.Map({
  container: 'icechunk-map',
  style: makeStyle(),
  center: CONFIG.center,
  zoom: CONFIG.zoom,
  maxBounds: CONFIG.maxBounds,
  minZoom: CONFIG.minZoom,
  attributionControl: false,
})

map.addControl(new maplibregl.AttributionControl({
  compact: true,
  customAttribution: 'Snow: <a href="https://www.nohrsc.noaa.gov/snowfall_v2/" target="_blank" rel="noopener">NOAA NOHRSC</a>',
}), 'bottom-right')
map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-left')

function updateIndicator() {
  const z = map.getZoom()
  document.getElementById('zoom-level').textContent = 'z ' + z.toFixed(2)
  const native = z < CONFIG.nativeZoomThreshold
  document.getElementById('source-native').classList.toggle('active', native)
  document.getElementById('source-virtual').classList.toggle('active', !native)
}
map.on('zoom', updateIndicator)

let currentMode = CONFIG.defaultView

function updateLegend(mode) {
  const view = CONFIG.views[mode]
  document.getElementById('legend-bar').style.background =
    'linear-gradient(to right,' + view.cmap.join(',') + ')'
  document.getElementById('legend-min').textContent = view.legend[0]
  document.getElementById('legend-max').textContent = view.legend[1]
}

function setMode(mode) {
  if (mode === currentMode || !store) return
  currentMode = mode
  if (map.getLayer('snow')) map.removeLayer('snow')
  map.addLayer(createLayer(mode, store), 'landuse_pedestrian')
  document.querySelectorAll('#season-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode)
  })
  updateLegend(mode)
}

document.querySelectorAll('#season-toggle button').forEach(btn => {
  btn.addEventListener('click', () => setMode(btn.dataset.mode))
  btn.classList.toggle('active', btn.dataset.mode === currentMode)
})

updateIndicator()
updateLegend(currentMode)

map.on('load', async () => {
  try {
    map.addLayer(createLayer(currentMode, await storePromise), 'landuse_pedestrian')
  } catch (err) {
    console.error('Failed to load Icechunk dataset:', err)
    document.getElementById('zoom-level').textContent = 'Failed to load dataset'
  }
})
</script>
