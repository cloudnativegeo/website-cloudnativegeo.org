---
date: 2025-08-05T01:00:38-04:00
title: "CNG Editorial Board Spotlight – Q&A: Qiusheng Wu"
tags: [ ""
]
summary: "Editorial Board Spotlight series features a different board member sharing their perspectives on geospatial trends and tools, what’s capturing their attention through reading or their current work, and the challenges they believe our community should focus on."
---

<img src="/img/editorial-board/qiusheng-wu.jpg" alt="Qiusheng Wu" style="width: 200px; height: auto; float: right; margin: 0 0 20px 20px;">

Each month, we’re highlighting the community leaders who volunteer their expertise to guide CNG’s direction. Our Editorial Board Spotlight series features a different board member sharing their perspectives on geospatial trends and tools, what’s capturing their attention through reading or their current work, and the challenges they believe our community should focus on.

## 1. What geospatial trend or tool excites you right now?

I'm particularly excited about the growing convergence of geospatial data and AI, especially through open-source tools that lower the barrier to entry. Tools like the Segment Anything Model (SAM), combined with geospatial wrappers such as [segment-geospatial](https://samgeo.gishub.org/) and [GeoAI](https://opengeoai.org/), are enabling rapid experimentation in image segmentation and classification workflows. These tools empower researchers and practitioners to apply cutting-edge vision models to Earth observation data with minimal friction.

In addition, the emergence of geospatial foundation models—large, pretrained models adapted for tasks like land cover classification, change detection, and object recognition—is a major leap forward. These models, trained on vast amounts of remote sensing and environmental data, are poised to accelerate progress in GeoAI much like foundation models have inNatural Language Processing (NLP) and computer vision. When integrated with cloud-native formats such as Cloud-Optimized GeoTIFF and GeoParquet, these models open the door to scalable, reproducible, and near-real-time geospatial analysis on a global scale.

## 2. What are you working on right now?

Right now, I’m actively developing two Python packages—GeoAI and Anymap.

- [GeoAI](https://opengeoai.org) focuses on streamlining workflows for geospatial machine learning, making it easier to train, evaluate, and deploy models for remote sensing tasks.  
- [Anymap](https://anymap.dev/) is designed to bring lightweight, interactive mapping capabilities into Jupyter notebooks and web apps, supporting a range of open formats and libraries like MapLibre and Potree.

These projects are not only technical efforts but also explorations into how we can make geospatial AI and visualization more accessible, reproducible, and cloud-native.

## 3. What is one challenge in cloud-native geospatial that you think the community should focus on?

A key challenge is interactive visualization of GeoParquet datasets in the cloud. While the GeoParquet format is excellent for efficient storage and scalable analytics, seamless browser-based visualization—especially for large and complex datasets—is still lacking. The community would benefit from tools that bridge the gap between efficient cloud storage and dynamic, map-based user interfaces for exploration and analysis.  
