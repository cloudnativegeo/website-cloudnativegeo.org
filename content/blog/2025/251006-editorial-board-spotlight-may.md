---
date: 2025-10-05T01:00:38-04:00
title: "CNG Editorial Board Spotlight – Q&A: Stephanie May"
tags: [ ""
]
summary: "Editorial Board Spotlight series features a different board member sharing their perspectives on geospatial trends and tools, what’s capturing their attention through reading or their current work, and the challenges they believe our community should focus on."
---

<img src="/img/editorial-board/stephanie-may.jpg" alt="Stephanie May" style="width: 200px; height: auto; float: right; margin: 0 0 20px 20px;">

Stephanie May is a geographic technologist and cartographer based in Seattle, Washington. In addition to being a founding member of CNG’s Editorial Board, she serves on the board of the [MapLibre Organization](https://maplibre.org/about/), an open source ecosystem for webmapping, and is the Principal of Liminal Maps.

## 1. What geospatial trend or tool excites you right now?

I’m energized by how much easier it has gotten to build, host, and embed cloud-enabled web maps. A few technologies stand out: [PMTiles](https://docs.protomaps.com/pmtiles/) allow for serverless hosting from anywhere that supports HTTP range requests, which means you can build a map in a GitHub repo and host it via GitHub Pages, or for larger projects shift to a cloud storage bucket. Pair with [Protomaps](https://docs.protomaps.com/) for a full map solution: extract a region in PMTiles format paired with a stylesheet and all the other assets you need to embed a map in your project site or app via [MapLibre](https://maplibre.org/), or customize it in a huge variety of ways, such as mixing in other sources (e.g. OpenStreetMap US just released [hosted layers for trails, contours, hillshades](https://openstreetmap.us/news/2025/09/tileservice-general-availability/)). If you want to go deeper, you can build your own map tiles with [Planetiler](https://github.com/onthegomap/planetiler), understand and modify the stylesheet with [Maputnik](https://maputnik.github.io/), or even build and host your own aesthetic from top to bottom with a custom or branded style and icons.

Just a few years ago, it really wasn’t feasible for non-developers to build a web map they could customize and control at every stage: the cost, effort and technical learning curve were too prohibitive. Thus unless you were a web developer who also understood the cloud, web maps lived in the walled gardens of mapping platforms, like ArcGIS Online or Mapbox. These days, there are options. That means GIS and cartography students can build portfolios that include custom-designed, interactive web maps that showcase their projects, NGOs can build and host maps that build awareness for their cause, and land managers can explicitly communicate their policies and programs.

I’m giving a workshop about this topic at [FOSS4G](https://2025.foss4g.org/) in Auckland, NZ on Tuesday, November 18 at 9 am local time. If you are attending, please come check it out.

## 2. What are you working on right now?

I’m thinking about the future of digital maps, and how spatial cognition and awareness augment decision-making, from turn-by-turn navigation with the next generation of wearables and beyond relying on GPS as it exists today, to the metrics we can make tangible enough to embed in our cultural and economic systems so that we can truly comprehend and address the linkages between resources, markets, and capital in a systemic way.

## 3. What is one challenge in cloud-native geospatial that you think the community should focus on?

Given the advancement of AI and the [uncertainties of climate change](https://ggim.un.org/documents/Geospatial_Information_for_Climate_Resilience.pdf), we have to focus on arguably the unsexiest thing in the world, which is metadata. What I mean by “metadata” is every kind of documentation or attribute that surrounds geographic data, providing every ounce of context and meaning, defining every caveat and process. What I mean by “unsexy” is that there are hundreds if not thousands of standards out there for specifying various types of metadata across the myriad types of geospatial data and still it is onerous to create and maintain, and difficult to parse and consume.

Artificial intelligence, from machine learning to LLMs and geo-embeddings relies fundamentally on the quality of metadata, as does climate change policy: you can’t compare data without it. Yet few who rush to extol the importance of geospatial data for addressing the future of our world mention the fragmentary and inconsistent nature of metadata across datasets.

Cloud-native geospatial has the potential to change that by developing distributed networks of data and services through new concepts like the [SpatioTemporal Asset Catalog (STAC)](https://stacspec.org/), which streamlines the production and distribution of metadata by embedding it within a data network that is traversable and readable across a distributed web. We have a very long way to go, but I think the more we can do as a community to create interconnected, distributed networks of data surrounded by reliable metadata, the better shot we have at harnessing powerful emerging technologies to address not just the challenges in cloud-native geospatial but the biggest challenges facing our world.