---
date: 2025-11-03T08:00:00-00:00
title: "STAC+Zarr Community Sprint 2025 Recap"
author: "[Emmanuel Mathot](https://www.linkedin.com/in/emmanuelmathot/),[Julia Signell](https://www.linkedin.com/in/jsignell/), & [Michelle Roby](https://www.linkedin.com/in/the-michelle-roby/)"
author_title: "STAC PSC Members"
summary: "The first European STAC sprint brought together developers at ESA ESRIN to establish practical patterns and best practices for integrating STAC with Zarr for cloud-native multidimensional geospatial data."
---

From October 14-16, the STAC and Zarr communities came together at ESA ESRIN in Frascati, Italy, for the first-ever STAC sprint in Europe focused on advancing cloud-native multidimensional geospatial data. After three intensive days of collaborative development, we're excited to share what we accomplished and what we hope to be the path forward for STAC-Zarr integration.
{{< img src="images/251025-stac-sprint-group-photo.jpg" caption="Participants gathered at ESA ESRIN for the first European STAC sprint">}}

## A Community Comes Together

Twenty-six developers from across Europe and beyond converged on ESA's facility in Frascati, representing a remarkable cross-section of the geospatial data community. Organizations including ESA, CEDA, DLR, EODC, Eurac Research, CloudFerro, Terradue, Element 84, Development Seed, DKRZ, Tilebox, and many others brought their unique perspectives and expertise to hammer out how multidimensional data should be represented in STAC.

What made this sprint particularly powerful was the convergence of two communities, STAC and Zarr, working together on shared problems. For several years there have been discussions and ideas floating around about how to use STAC with Zarr, but getting everyone together, and being able to look at some existing implementations proved incredibly fruitful.

The sprint focused on fundamental questions that STAC faces as it gains popularity outside of the Earth observation community:

- How do you represent multidimensional Zarr stores in STAC?
- What's the best way to handle variables and dimensions for datacubes?
- How should we navigate hierarchical Zarr structures?

These aren't theoretical exercises, they're the real challenges faced by organizations working with petabytes of Earth observation data.

## Key Achievements

### Specification Work

The sprint produced several concrete proposals that will shape how we work with multidimensional geospatial data:

- **[Best Practices for STAC Zarr and N-Dimensional Arrays](https://github.com/radiantearth/stac-best-practices/pull/29)**: A comprehensive draft providing guidance on using Zarr with STAC. This is significant because, until now, nobody had proper guidance on this integration. The PR is ready for community review and needs feedback to refine and finalize the recommendations. We would like to merge it by the end of November to provide clarity to implementers. We encourage everyone to review and contribute feedback by participating in the next community meetings or commenting directly on the PR.

- **[Datacube Extension Overhaul of Variables](https://github.com/stac-extensions/datacube/issues/30)**: A proposal to replace `cube:variables` with `bands` to better align with how STAC structures metadata. This change could make the datacube extension more intuitive and powerful for multidimensional datasets. This PR will probably require further discussion before merging, as it represents a breaking change in the extension.

- **[EOPF STAC Patterns](https://github.com/EOPF-Sample-Service/eopf-stac/pull/54)**: ESA-specific best practices for their Earth Observation Processing Framework (EOPF) Zarr products. EOPF STAC represents the largest effort to-date of representing Zarr stores in STAC. Aligning EOPF STAC with the newly emerging best practices serves as a test of the feasibility of these best practices and provides a concrete example. Part of this effort also involves reusing existing STAC extensions wherever possible to improve compatibility between EOPF products and external products.

- **[STAC in Zarr](https://github.com/radiantearth/community-sprints/blob/main/14102025-esrin-rome-italy/sprint-notes/STAC%20in%20Zarr.md)**: Explorations into embedding STAC metadata directly inside Zarr stores, making it trivial to create a STAC object directly from the Zarr metadata and ensuring that Zarr stores are entirely self-describing.

{{< img src="images/251025-stac-sprint-at-work.png" caption="Participants collaborating during the sprint sessions">}}

## Connecting with the Zarr Community

On Friday, October 17th, STAC sprint participants were invited to join the Zarr Adopter Summit, which was happening the same week in Rome. This was a perfect opportunity to share our progress and learnings with the broader Zarr community. Several sprint participants presented the work accomplished during the week, including the proposal for a [Zarr convention](https://github.com/zarr-conventions/zarr-conventions-spec) for STAC (similar to a STAC extension, but defined within Zarr metadata to describe how STAC metadata can be embedded in Zarr stores). This cross-pollination between communities, with STAC folks learning more about Zarr developments and Zarr folks understanding STAC use cases, exemplified the collaborative spirit that makes open standards work so well.

## Beyond STAC

While the technical achievements were substantial, some of the most valuable moments came from informal conversations and community building. On Wednesday evening, Development Seed and Earthmover sponsored a happy hour at Casadante in Rome, bringing together participants from both the STAC sprint and the concurrent Zarr Summit. Seeing people from Earth observation, climate science, and cloud infrastructure all discussing the same data challenges was remarkable.

{{< img src="images/251025-stac-sprint-aperitivo.jpg" caption="Aperitivo at Casadante with STAC and Zarr communities">}}

On Tuesday, ESA graciously provided a tour of their multimedia center and long-term archive facilities, including what may be one of the first catalogs of Earth observation data ever created. These glimpses into the history and future of Earth observation provided valuable context for our work.

{{< img src="images/251025-stac-sprint-esa-visit.png" caption="Exploring ESA’s Φ-lab experience center and the early version of Earth observation catalog">}}

## Why This Matters

The STAC specification has been relatively quiet over the past couple of years, and that's actually a sign of success. The specs are stable, it is now a [OGC community standard](https://www.ogc.org/standards/stac/), and companies are building production systems on them. But we're entering a new phase now.

Multidimensional arrays are fundamentally different from traditional geospatial files. Zarr is rapidly becoming the format of choice for massive Earth observation datasets, with major organizations like ESA (with EOPF) making plans to distribute archival data as Zarr. STAC needs to evolve to handle this properly, not through changes to the core specification, but through the development of clear patterns, best practices, and extensions.

This sprint was about establishing those patterns before the community fragments into incompatible implementations. The work we did here will influence how organizations catalog and discover multidimensional Earth observation data for years to come.

## Get Involved

Want to contribute to these efforts or learn more? Here's how you can participate:

- **GitHub**: Follow the issues and PRs linked above. Your feedback on the best practices draft is especially valuable right now.
- **Community Meetings**: Join the STAC Community meetups held for different timezones - biweekly meetings every other Monday at 11 a.m. EST for Americas/Europe, and monthly meetings for Asia/Oceania. Add yourself to the [STAC Community Google Group](https://groups.google.com/g/stac-community) to receive meeting invitations for both.
- **Slack**: Connect with the community on the [Cloud-Native Geospatial Forum Slack](https://join.slack.com/t/cloudnativegeo/shared_invite/zt-259rmhcyo-bT6tabt3X_5_s6zUfxCwEg).

## Acknowledgments

This sprint wouldn't have been possible without the support of **ESA ESRIN** for providing the venue, logistics support, and hospitality in Frascati.
A huge thank you to all 26 participants who took time away from work and family to advance these specifications. Your expertise, patience in explaining complex concepts, and willingness to engage in detailed technical discussions made this sprint successful.
