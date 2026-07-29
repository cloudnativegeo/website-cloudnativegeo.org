---
date: "2026-07-23T00:00:00-06:00"
slug: announcing-geo-embedding-sprint-zurich
title: "Announcing the Geo-Embeddings Sprint II: From Emerging Standards to Real-World Adoption"
tags: []
summary: "IBM, CNG, Clark University, and Planet will convene a second Geo-Embeddings Sprint on October 27–28, 2026, in Zürich, Switzerland, focusing on benchmarking, fitness-for-use, and broader adoption of EO embeddings."
author: "[Eli Simonson](https://www.linkedin.com/in/eli-simonson/) and [Michelle Roby](https://www.linkedin.com/in/the-michelle-roby/)"
---

Following the success of the Geo-Embeddings Sprint held at Clark University in March 2026, IBM, Cloud-Native Geospatial (CNG), Clark University, and Planet will convene a second Geo-Embeddings Sprint on October 27–28, 2026, in Zürich, Switzerland. The event is hosted at an IBM office.

The first sprint brought together researchers, model developers, data providers, and downstream users to identify emerging patterns for storing, cataloging, and accessing Earth observation (EO) embeddings. Participants aligned on a set of community recommendations, launched [geoembeddings.org](https://geoembeddings.org/), and established an ongoing forum for collaboration through monthly community meetings.

## Community Progress Since the First Geo-Embeddings Sprint

Since the first sprint, the geo-embeddings community has continued to build momentum through technical discussions and early implementations of the patterns proposed in Worcester. Several notable developments have emerged. The TESSERA project has [adopted the proposed GeoZarr conventions](https://anil.recoil.org/notes/tessera-embeddings-convention) for publishing pixel-level embeddings, providing an early example of community-driven implementation. LGND has released [a global Sentinel-2 embedding dataset](https://source.coop/clay/lgnd-clay-v1-5-sentinel-2-l2a) generated with Clay model v1.5 in GeoParquet format. Earth Genome has also released its [2025 embedding products](https://browser.stac.earthgenome.org/collections/ssl4eo_yearly_embeddings/items/18SUJ_2025-01-01_2026-01-01?.language=en) using the emerging [Geo-Embeddings STAC extension](https://github.com/geo-embeddings/embeddings-stac-specification), embedding standardized metadata directly within the GeoParquet files. Together, these efforts demonstrate how embeddings can be distributed using the storage patterns discussed during the sprint.

Community engagement has also expanded beyond technical implementations. Participants from the first sprint have launched an [Earth Observation Vector Embeddings Survey](https://docs.google.com/forms/d/e/1FAIpQLSfi0M_L6eEy-biGjtEiahcYxe7I5C3eoXvM7QtEdcmC6lUwpA/viewform) to better understand how practitioners are using embeddings, where current approaches are succeeding, and what challenges remain. The survey will help identify common use cases, unmet needs, and priorities for future community efforts.

## Emerging Challenges for the Geo-Embeddings Community

As adoption grows, several challenges have become increasingly clear.

### Fitness-for-use

While organizations are publishing an increasing number of embedding datasets and foundation models, users often struggle to determine whether a given embedding product is appropriate for their application, geographic region, spatial resolution, or sensor type. Documentation of model capabilities, limitations, and intended use cases remains inconsistent, making it difficult for practitioners to understand where embeddings are likely to perform well. Addressing this challenge will require improved evaluation and benchmarking methodologies with a focus on embeddings as products. Emerging community efforts such as [TorchGeo-Bench](https://github.com/torchgeo/torchgeo-bench) are helping establish common approaches for evaluating geospatial foundation models across downstream tasks, but significant work remains before practitioners can confidently compare embedding products and assess their fitness for specific applications.

These challenges were echoed at the [2026 ESA–NASA Workshop on AI Foundation Models for Earth Observation](https://nikal.eventsair.com/2nd-esa-nasa-workshop-on-ai-foundation-model-for-earth-observation-eo/), where participants emphasized the need for more robust approaches to evaluating model performance, communicating fitness-for-use, and supporting operational adoption across diverse application domains. Recent studies have reinforced these concerns, highlighting both the [lack of mature benchmarking frameworks](https://arxiv.org/abs/2605.12678) and the [difficulty of evaluating performance across new geographies, sensors, time periods, and application domains](https://arxiv.org/abs/2605.29330).

### Understanding EO Embeddings

Beyond technical challenges, the community continues to identify a need for stronger educational resources and real-world examples. While interest in EO embeddings is growing, many potential users remain unfamiliar with what embeddings are, how they differ from traditional geospatial products, and where they provide measurable value. Improving accessibility, documentation, and examples of successful deployment will be critical for broader adoption.

## Focus Areas for the Zürich Sprint

The Zürich sprint will build on the foundation established in Worcester, shifting attention from storage and metadata conventions toward evaluation, adoption, and community growth.

A primary focus will be benchmarking and fitness-for-use. Participants will explore how EO embeddings can be evaluated across different modalities and what information users need to determine whether an embedding product is appropriate for a given application. The goal is to identify practical approaches for comparing embeddings as products and communicating their strengths, limitations, and intended use cases.

The sprint will also address adoption beyond the GeoFM research community. Discussions will focus on educational resources, examples of successful operational deployments, and opportunities where embeddings provide clear advantages over traditional geospatial workflows.

Finally, participants will discuss priorities for the next phase of the geo-embeddings effort, including future community contributions, feedback from early adopters, and strategies for sustaining long-term collaboration.

## Who Should Attend

This sprint is for organizations building or using embeddings in Earth observation applications. We aim to bring together individuals who are hands-on with either the generation of EO embeddings or their use in downstream applications. Participants should plan to attend the 2-day sprint in person in Zürich, Switzerland, and continue engaging with the group afterward.

## Registration

This sprint has limited capacity. Please [fill out this form to apply](https://docs.google.com/forms/d/149y9_9kDbev1tbxvjpqimWSzxRHzwPzCxgjeQ5Bv8ok/edit), and we will contact you to confirm participation. The deadline to submit your application is **Sunday, August 30th.**

Travel support is available based on need. The workshop will be followed by coordination through the CNG Slack workspace and GitHub.

## Additional Contribution

Even if you are unable to attend the sprint, we encourage anyone building or using EO embeddings to complete the [Earth Observation Vector Embeddings Survey](https://docs.google.com/forms/d/e/1FAIpQLSeh9C49RNYTtj6h0ALqwxf2z79FxPFurKzCgoFJ1Rg58kWYSQ/viewform). Community feedback will help guide future best practices, standardization efforts, and educational resources.

## Want to Learn More?

Wanting to hear more details on the topics covered in this blog post and more? Join us for an informational livestream on August 6 at 9am PT. You can [register here](https://luma.com/0dcoc81w) and the livestream will be offered on both LinkedIn and YouTube.
