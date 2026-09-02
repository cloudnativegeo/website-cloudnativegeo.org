---
date: "2026-09-02T10:00:00-04:00"
slug: introducing-portolan
title: "Introducing Portolan: A serverless spatial data infrastructure"
tags: []
summary: "Cloud-optimized formats and STAC metadata make it possible to run a spatial data infrastructure as files in a bucket. Portolan is an open-source spec and toolkit for building one."
author: "Nissim Lebovits"
author_title: "Technical Lead, Portolan"
---

*This post is cross-posted [on the Portolan blog](https://www.portolan-sdi.org/blog/introducing-portolan).*

For decades, publishing geospatial data has meant deploying and maintaining
complex, expensive infrastructure like servers, databases, and APIs, while
using that data has required specialized tools and expertise. This made sense
when spatial files couldn't be queried efficiently over the network. But as
datasets grow larger and more complex — and agents generate query volumes that
traditional serving infrastructure was never designed for — this model of
Spatial Data Infrastructure (SDI) is becoming less sustainable.

Over the past several years, the cloud-native geospatial community has laid the
groundwork for a different way of building SDIs. [Cloud-optimized file
formats](https://guide.cloudnativegeo.org/) and
[`STAC`](https://stacspec.org/en/) metadata make it possible to organize
petabyte-scale datasets in object storage and efficiently access them with
standard tools like [QGIS](https://qgis.org/) and Python, or hand them to an
agent. In other words, an SDI can now be files in S3-compatible cloud storage,
with no servers, databases, or custom APIs. Today, we're launching Portolan, an
open-source specification and toolkit for publishing geospatial data this way.

## A specification built on existing standards

The core of Portolan is a [specification](https://github.com/portolan-sdi/portolan-spec)
that defines what we consider to be the best ways to build a serverless SDI.
The specification lays out how data should be stored, organized, and
documented to maximize ease of publication and utility to end users. The point
is to maintain a high quality bar for publishing geospatial data; working with
any Portolan catalog should be a good experience.

Portolan deliberately builds on existing standards rather than reinventing
them. Cloud-optimized file formats provide the foundation: Portolan uses
[`GeoParquet`](https://geoparquet.org/) and
[`PMTiles`](https://docs.protomaps.com/pmtiles/) for vector data, and
[`COG`](https://cogeo.org/) for raster, with future support planned for formats
like `Zarr` and [`COPC`](https://copc.io/). These formats make it possible
for publishers to cheaply host and share petabyte-scale datasets in
object storage while allowing users to efficiently access just the bytes they
need.

Portolan organizes data using `STAC`, a metadata specification for geospatial
data. Using STAC means that Portolan catalogs are consistently organized and
indexed, allowing people and agents to reliably search and navigate them
whether they contain ten files or ten million.

Portolan also mandates strong data documentation. All Portolan catalogs must
include READMEs and `AGENTS.md` files to make it easy for people and agents
to understand and work with the data. We believe that reducing the
infrastructure required to publish and maintain SDIs means publishers can and
should spend more energy on high-quality metadata and docs. Here, we take
inspiration from frameworks like
[FAIR](https://www.go-fair.org/fair-principles/) and
[Candid Core](https://lettersfromthreadedfoundry.substack.com/p/candid-core-framework),
which aspire to a more comprehensive approach to usability and evaluability.

Across all of these cases, Portolan is deliberately opinionated. There are a
range of ways that you could publish geospatial data in the cloud, but some are
much better than others. Publishing GeoParquet without bbox structs and spatial
ordering can make spatial queries way slower, for instance, while hosting data
without CORS makes it impossible to use directly in a serverless web app.
Portolan lays out clear requirements and best practices for getting these
details right, and ships [rashid](https://github.com/portolan-sdi/rashid), a
validator that checks catalogs against the specification and outputs
agent-friendly JSON, making it straightforward to identify and fix anything that falls short.

## What Portolan makes possible

Once users can query files directly, publishers don't need to maintain a
service whose main job is to stand between users and the data. For public,
read-heavy catalogs, this eliminates a lot of the infrastructure associated
with a traditional SDI, like servers, databases, and custom APIs, as well as
the operational work needed to keep them running.

For publishers of large datasets, this changes both cost and scale. National
geoportals and planetary archives can rely on object storage rather than
maintaining a separate serving layer sized for peak demand. That cuts recurring
infrastructure costs much closer to just the underlying cost of storage and
data transfer, making it practical to host terabytes of data without also
paying to operate a dedicated geospatial service.

[Fields of the World](https://fieldsofthe.world) is one example. Its global
dataset of agricultural field boundaries is published as a Portolan catalog on
object storage, with no serving layer in front of it.

{{< img
  src="images/20260902-portolan-fields-of-the-world.png"
  alt="The Global Fields of the World catalog on Source Cooperative, including its public status and 28-day download statistics."
  link="https://source.coop/ftw/global-data"
  caption="Figure 1. The Global Fields of the World dataset is published as a Portolan catalog on Source Cooperative, contains 369 TB of data, and served 106.6 TB in the 28 days ending August 27, 2026."
>}}

The same shift matters at the other end of the spectrum. Many city governments,
NGOs, researchers, and smaller data producers can't justify maintaining
[GeoServer](https://geoserver.org/), Esri infrastructure, or a custom API just
to publish a handful of datasets. Because a Portolan catalog is just files in a
bucket, it lowers the technical and financial barriers to publishing useful
geospatial data.

With Portolan, your data live in any S3-compatible cloud storage, in any
jurisdiction you choose. Changing providers does not change the file formats or
catalog structure. This gives publishers flexibility to meet sovereignty
requirements.

For data users, Portolan provides a faster, more consistent way to access data.
Portolan catalogs use formats that already work out of the box with tools like
QGIS, ArcGIS, [DuckDB](https://duckdb.org/), and Python, but cloud-optimized
formats permit much faster access than WFS endpoints or Esri servers ever
could.
Portolan catalogs also necessarily include the metadata and documentation
needed to understand what the data contain and how they should be used. The
[registry](https://www.portolan-sdi.org/registry) adds a common place to discover public catalogs.

## Portolan in practice

The Portolan specification can be implemented in a number of ways, but we've
built a set of tools to make publishing and working with Portolan data easy.

First, [rashid](https://github.com/portolan-sdi/rashid), our validator, checks
catalogs against the Portolan specification. It reports failures against MUST
requirements and warnings against SHOULD requirements, and outputs
agent-friendly JSON that makes it straightforward for a person or agent to
bring a catalog into conformance.

The [Portolan CLI](https://cli.portolan-sdi.org/) handles the
deterministic work underneath the broader publishing workflow, including
ingesting source data, converting it into cloud-optimized formats, managing
catalog structure and metadata, and publishing finished catalogs to object
storage.

On top of those tools, we provide
[agent skills](https://github.com/portolan-sdi/portolan-skills) that can
orchestrate publication from start to finish.
[`portolan-bootstrap`](https://github.com/portolan-sdi/portolan-skills/tree/main/skills/portolan-bootstrap),
for example, can start with a folder of files, a WFS endpoint, an Esri service,
or another published dataset, then work through catalog structure, conversion,
documentation, visualization, validation, and publication.

<figure>
  <video controls preload="metadata" playsinline style="width: 100%; height: auto;"
    poster="/videos/20260902-portolan-demo-one.jpg">
    <source src="/videos/20260902-portolan-demo-one.mp4" type="video/mp4">
    A terminal recording shows an agent create and publish a Portolan catalog from ten Open Data Philly housing datasets. It converts source data, adds documentation and map styles, validates the catalog, and publishes the finished files.
  </video>
  <figcaption><p>Figure 2. An agent creates and publishes a Portolan catalog from Philadelphia housing data.</p></figcaption>
</figure>

Because Portolan catalogs are built from existing standards, using them doesn't
require any Portolan-specific tooling. You can explore the same data in the
Portolan browser, query them directly from QGIS, ArcGIS, Python, or DuckDB, or
hand the catalog to an agent. They fit into existing workflows and can be
combined freely with data published elsewhere. We also provide skills for
agents consuming Portolan data, with guidance on navigating STAC metadata,
querying GeoParquet and COG efficiently, joining datasets, and building
analyses or applications from the results.

{{< img
  src="images/20260902-portolan-pdok-demo.gif"
  alt="A walkthrough of the PDOK catalog published as a Portolan catalog."
  caption="Figure 3. Working with the PDOK catalog, the Dutch national mapping agency's data published as a Portolan catalog."
>}}

## Built for people and agents

Agents make it viable to work with geospatial data at a scale that was
previously impractical. They can search across catalogs, inspect hundreds of
assets, combine datasets from different publishers, and iterate through an
analysis in the time it'd take a person to navigate a few portals. That opens
up much more ambitious uses of public geospatial data, but only if the
underlying infrastructure is built for them.

Portolan catalogs are designed for agent-friendly access. Cloud storage and
cloud-optimized formats can handle the much higher query volumes agents
generate, while STAC metadata and strong documentation give them a consistent
way to discover data and use it correctly. Publishers can also encode expertise
alongside the data, including caveats, appropriate-use guidance, and other
context that'd otherwise be scattered across documentation or live only in the
heads of domain experts.

<figure>
  <video controls preload="metadata" playsinline style="width: 100%; height: auto;"
    poster="/videos/20260902-portolan-demo-two.jpg">
    <source src="/videos/20260902-portolan-demo-two.mp4" type="video/mp4">
    A terminal recording shows an agent search the Portolan registry for Moldova flood data, inspect related catalogs, estimate exposed buildings and population, and rank planning corridors.
  </video>
  <figcaption><p>Figure 4. An agent answers questions about flood risk in Moldova using catalogs in the Portolan registry.</p></figcaption>
</figure>

This also reduces the expertise required simply to get at the data. Users
should be able to focus on asking useful questions rather than learning the
quirks of several portals, managing API pagination, wrangling downloads, or
writing geospatial code just to get started. Agents can take on much of that
intermediate work, broadening access for new users while letting experienced
practitioners work across far more data than they could reasonably manage by
hand.

## Toward a federated network

Our long-term goal is for Portolan to become the default way of publishing
geospatial data. If national mapping agencies, cities, researchers, NGOs, and
global data providers publish interoperable, well-documented catalogs in the
same basic shape, datasets can remain distributed across thousands of
publishers while becoming consistently searchable and directly usable across
organizational and geographic boundaries.

The Portolan registry is the first step toward that network. It's deliberately
nothing more than a catalog of independently hosted catalogs. Any publisher can
[submit a catalog](https://github.com/portolan-sdi/portolan-registry) and, once
it passes validation, make it discoverable alongside
data from other publishers. The underlying bytes never leave the publisher's
storage; users continue to query them directly from the source. Even if the
registry disappeared tomorrow, every registered catalog would keep working.

The network has already started to take shape, with catalogs spanning
[global datasets](https://browser.portolan-sdi.org/#/external/data.source.coop/ftw/global-data/catalog.json),
[national government data](https://browser.portolan-sdi.org/#/external/data.source.coop/cholmes/portolan-nl/catalog.json),
and
[community mirrors](https://browser.portolan-sdi.org/#/external/data.source.coop/nlebovits/ghsl/catalog.json).
As it grows,
discovery starts to work very differently. A person or agent can begin with
nothing more than the URL of the registry, find relevant datasets across many
publishers, understand how they're structured, and query them directly from the
source. You can already point an agent at the registry and see what it can do,
with no instructions about individual portals or APIs. Our ambition is to make
that kind of access possible across a substantial share of the world's
published geospatial data.

## What comes next

Portolan is still early stage; right now, we're focused on polishing the
specification and building out the core tooling and reference implementation.
Our approach is to learn by doing: publish useful Portolan catalogs, see what
works across real datasets and publishers, and feed those lessons back into the
specification and tooling. Because we expect breaking changes in the short
term, Portolan is currently best suited to early adopters. The
[roadmap](https://github.com/portolan-sdi/portolan-ops/blob/main/ROADMAP.md)
lists the work in each stage.

The Portolan registry is one useful measure of our progress. The more kinds of
data, publishers, formats, and use cases represented there, the more confident
we can be that Portolan works across the geospatial ecosystem. Our initial goal
is roughly one hundred reference catalogs, covering a range of use cases and
geographic extents.

Other important signs of maturity are stability in the specification and core
tooling. We want to reach a point where real-world use no longer routinely
exposes gaps that require breaking specification changes, and where publishers
can create and maintain conformant catalogs with a stable v1.0 CLI. After the
core reaches that point, we'll focus more heavily on expanding the tooling
ecosystem and making Portolan accessible to publishers and users who don't
work from the command line.

Beyond that, success means an ecosystem forming around the specification rather
than Portolan depending on the tools we build ourselves. We want to see
community and commercial implementations add new capabilities, and existing GIS
tools and data platforms read Portolan metadata directly. At that point,
publishers should be able to choose among different tools and workflows while
producing catalogs that remain interoperable.

## Get involved

The best way to participate in building Portolan right now is to publish data
as Portolan catalogs, test the tooling, and let us know what works and what
doesn't. We're still learning from the different ways people implement the spec,
so testing Portolan against new datasets, publishers, and workflows is
especially valuable. If you work for an organization that publishes geospatial
data, we'd love to see more official Portolan catalogs. If you just want to
help, grab an [open issue](https://github.com/portolan-sdi/portolan-data/issues)
from our list of datasets we'd like to mirror into the Portolan registry. We
also welcome contributions to the spec and tooling through bug reports, feature
requests, and PRs (especially PRs).

Portolan is being built as an open-source community project. To get involved,
join the [`#portolan` channel](https://cloudnativegeo.slack.com/archives/C0A1JBH9529)
in the Cloud-Native Geospatial Forum Slack workspace or the
[Google Group](https://groups.google.com/g/portolan), where we
organize weekly meetings on Fridays at 10am CET. The specification,
documentation, examples, registry, and current catalogs are at
[portolan-sdi.org](https://www.portolan-sdi.org/), and the code lives in the
[Portolan GitHub organization](https://github.com/portolan-sdi).

## Acknowledgements

Portolan is developed by a growing group of contributors, led by technical lead
[Nissim Lebovits](https://nlebovits.github.io/), with major contributions from
[Cayetano Benavent](https://es.linkedin.com/in/cayetano-benavent-vi%C3%B1uales-8b8416a),
[Youssef Harby](https://youssefharby.com/), [Chris Holmes](https://9eo.org/),
[Matthias Mohr](https://moregeo.it/), and
[Javier de la Torre](https://es.linkedin.com/in/jatorre).

The project has been supported and shaped from the start by
[Radiant Earth](https://radiant.earth/), [CARTO](https://carto.com/),
[Planet](https://www.planet.com/),
[Taylor Geospatial](https://www.taylorgeospatial.org/),
[Source Cooperative](https://source.coop/), and
[walkthru.earth](https://walkthru.earth/). We're also grateful to
[PDOK](https://www.pdok.nl/), the [City of Madrid](https://datos.madrid.es/),
[Barcelona](https://opendata-ajuntament.barcelona.cat/), and the
[Municipality of Pergamino](https://pergamino.ar/) for opening up data and
working with us on real-world catalogs and use cases.
