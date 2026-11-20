---
date: "2026-11-24T08:00:00-05:00"
slug: geoparquet-2-0-released
title: "GeoParquet 2.0 Released"
tags: []
summary: "GeoParquet 2.0 re-centers the specification on the native Parquet GEOMETRY and GEOGRAPHY types, aligning the geospatial world with mainstream Parquet tooling."
author: "[Chris Holmes](https://9eo.org), [Dewey Dunnington](https://github.com/paleolimbot), [Joris Van den Bossche](https://github.com/jorisvandenbossche) and [Javier de la Torre](https://github.com/jatorre)"
---

We are pleased to announce the [release of GeoParquet 2.0](https://github.com/opengeospatial/geoparquet/releases/tag/v2.0.0)! The clearest explanation is in the release notes:

> GeoParquet 2.0 re-centers the specification on the [Parquet Geospatial Logical Types](https://github.com/apache/parquet-format/blob/master/Geospatial.md) that became part of the core Parquet format in version 2.11 (March 2025). Where GeoParquet 1.x layered geospatial metadata on top of plain binary columns, 2.0 makes the native Parquet GEOMETRY and GEOGRAPHY types the foundation: the geometry column is typed by the format itself, the CRS travels on the column, and per–row-group geospatial statistics enable efficient spatial filtering with no extra columns. The GeoParquet `geo` metadata remains for tool compatibility, and it provides some small things beyond what the Parquet core does, including a guaranteed inline CRS definition, polygon winding order, epoch and the primary geometry column.
>
> The overall goal of 2.0 is to align the geospatial world with mainstream Parquet tooling: any tool that writes the native Parquet geospatial types correctly produces a file the GeoParquet 2.0 ecosystem can read, whether or not it carries GeoParquet metadata, and the spec supplies that metadata in the same way previous GeoParquet versions did. In practice that already covers engines writing native types, so their files are first-class input for GeoParquet 2.0 readers. See the [Parquet Geospatial Compatibility guide](https://github.com/opengeospatial/geoparquet/blob/v2.0.0/format-specs/compatible-parquet.md) for how the pieces fit together.

{{< img src="images/20261124-geoparquet-2-spec.png" alt="The GeoParquet 2.0 specification, showing the Overview, Version and schema, and Geometry columns sections" >}}

## Twenty months in the making

We announced that 2.0 was coming in [GeoParquet 2.0: Going Native](https://cloudnativegeo.org/blog/2025/02/geoparquet-2.0-going-native/), and then took considerably longer than we meant to. The extra time wasn't wasted. It let us get a lot of small things right, and it gave the ecosystem time to implement the Parquet geospatial types. This means that many of the tools that work with GeoParquet 1.1 can already read GeoParquet 2.0 today.

## What changed in the spec

The core specification didn't change much. The biggest change is the geometry column itself. Where in 1.1 we defined our own WKB column, 2.0 simply uses the new GEOMETRY and GEOGRAPHY types. We removed the GeoArrow 'native' encodings. They never saw much use, and the native statistics that made them attractive now come from the Parquet types themselves. We removed the `bbox` covering column too, since row-group statistics make it largely redundant — then brought it back as an option when users pointed out it still fills a real gap at the page level. And we added four new `edges` values — vincenty, thomas, andoyer and karney — to match Parquet, giving a finer description of how edges are interpolated than the original spec allowed.

{{< img src="images/20261124-geoparquet-1-1-vs-2-0.png" alt="Side-by-side comparison of a GeoParquet 1.1 file and a GeoParquet 2.0 file. In 1.1 the geometry column is a plain BYTE_ARRAY, a separate bbox struct column is needed for filtering, and all the geospatial meaning sits in the 'geo' metadata in the file footer. In 2.0 the geometry column is a native GEOMETRY or GEOGRAPHY logical type carrying its own CRS and per-row-group bounding box statistics, the bbox column is optional, and the 'geo' metadata becomes a helper." >}}

## Where GeoParquet still adds guidance

In a couple of places GeoParquet 2.0 is more opinionated than the Parquet types require. The first is CRS. GeoParquet has only ever offered PROJJSON, while the Parquet types also accept `<authority>:<code>`, `srid:<identifier>` and `projjson:<key_name>`. Readers should accept all of them; writers should stick to PROJJSON or `<authority>:<code>`. The asymmetry is deliberate — it nudges the ecosystem toward the forms we think will age best.

The second is saying "I don't know." A file still needs a way to declare an unknown or undefined CRS. That stays `crs: null` in the GeoParquet metadata, and `srid:0` in the Parquet CRS field.

## Publishing GeoParquet well

The last piece of work in the spec repo isn't in the spec at all. It's a guide to [publishing GeoParquet data](https://github.com/opengeospatial/geoparquet/blob/v2.0.0/format-specs/distributing-geoparquet.md) that lives alongside it. Parquet gives a lot of options, so we made this to recommend some options that work well in most cases: zstd compression at level 15 or higher, spatially ordering the data within each file, row groups of roughly 50,000 to 150,000 rows, spatial partitioning once a dataset grows past a couple of gigabytes, and STAC metadata to describe the result. A companion guide shows [how to do all of that](https://github.com/opengeospatial/geoparquet/blob/v2.0.0/format-specs/distributing-geoparquet-tools.md) in GDAL, DuckDB, SedonaDB and geoparquet-io.

## Testing and validation

There have also been some nice advances in the ecosystem around making 2.0 easy to adopt.

* [geoparquet-testing](https://github.com/geoparquet/geoparquet-testing) is an official test corpus, a pile of sample files for implementers to develop against.
* [GeoParquet Validator](https://validator.geoparquet.org/) checks 1.0, 1.1 and 2.0 files in the browser. Nothing is uploaded — the file stays on your machine, and a URL is read with range requests rather than downloaded whole, so a large file on S3 resolves in seconds. It's the [geoparquet-validator](https://github.com/geoparquet/geoparquet-validator) command-line tool compiled to WebAssembly, and the same project ships Rust, Python, npm and C builds for scripting and CI.

{{< img src="images/20261124-geoparquet-2-validator.png" alt="The GeoParquet Validator web app, validating an example file as GeoParquet 2.0.0 and reporting conformance for the Core and Cloud-Optimized Distribution classes" >}}

## Where tool support stands

The nice thing about building on a core Parquet feature is that a lot of the work happened without us. The Parquet geospatial types landed in Arrow C++ and pyarrow in 21.0.0, which means a surprising number of tools gained the ability to round-trip a typed geometry column without anyone setting out to support GeoParquet at all.

Reading is in good shape. Shipped releases that understand native `GEOMETRY` and `GEOGRAPHY` columns today include:

* **GDAL/OGR** since 3.12 (with libarrow 21 or newer)
* **DuckDB** since 1.5, where `GEOMETRY` moved into core
* **pyarrow / Arrow C++** since 21.0.0
* **GeoPandas** since 1.2.0
* **Apache Spark** since 4.2, and Databricks Runtime 18 on Spark 4.1
* **SedonaDB** since 0.4.0
* **QGIS** since 4.2, through its bundled GDAL — it opens a native-typed file even when there is no `geo` metadata in it at all

Writing is further behind. **Every one of these tools still defaults to GeoParquet 1.0 or 1.1.** You have to ask for 2.0. In DuckDB that means `COPY ... TO 'out.parquet' (FORMAT parquet, GEOPARQUET_VERSION 'V2')`; in GeoPandas it means `to_parquet(..., schema_version="2.0.0")`. SedonaDB and [geoparquet-io](https://github.com/geoparquet/geoparquet-io) will write 2.0 as well, and SedonaDB is currently one of the few things that writes the `GEOGRAPHY` type at all.

A couple of notable gaps are closing shortly. GDAL can write native geospatial types from 3.12 with the `USE_PARQUET_GEO_TYPES=YES` layer creation option, but full GeoParquet 2.0 support arrives in 3.14, which hasn't been released yet. Apache Sedona merged its GeoParquet 2.0 reader and writer in November, targeted at the 2.0.0 release — so it's in the repo but not yet in a release you can install. `GEOGRAPHY` support in general lags `GEOMETRY` across the board; DuckDB, for instance, has no `GEOGRAPHY` type in core today.

## Should you switch?

For most people publishing data today, the answer is: not yet, and that's fine.

GeoParquet 1.1 with a `bbox` covering column remains the right choice if you want the widest possible set of software to read your data, and the [distributing guide](https://github.com/opengeospatial/geoparquet/blob/v2.0.0/format-specs/distributing-geoparquet.md) says so explicitly. The large public datasets are still on 1.1 — Overture Maps, the biggest of them, ships GeoParquet 1.1 today. A 1.1 file written well is not a mistake you'll have to apologize for later.

GeoParquet 2.0 is the right choice now if you control both ends of the pipe. If your data is read by DuckDB, SedonaDB, Spark, a recent GeoPandas, or anything sitting on modern Arrow, you get smaller files (no `bbox` column), spatial filtering for free from row group statistics, and a geometry column that non-geospatial tooling can at least recognize as geospatial. That last point is the one that compounds: the whole bet of 2.0 is that "geospatial" stops being a thing you bolt on and becomes a thing the data warehouse already knows about.

Either way, the guidance that actually determines whether your files are fast — zstd compression, spatial ordering, sensible row group sizes — is the same for 1.1 and 2.0. Get that right first.

## Thank you, and come help

GeoParquet 2.0 is the work of a lot of people across a lot of organizations, and most of it happened somewhere other than the GeoParquet repo. Getting GEOMETRY and GEOGRAPHY into Parquet itself took years of patient work in the Apache Parquet community, and the implementers who shipped those types in Arrow, GDAL, DuckDB, Sedona and elsewhere are the reason a 2.0 file is useful on the day the spec ships rather than a year later. Thank you to everyone who wrote a PR, filed an issue, argued about CRS strings, or just tried the release candidates and told us what broke.

There is plenty left to do, and it is all in the open:

* The spec, issues and discussions live in the [GeoParquet GitHub repo](https://github.com/opengeospatial/geoparquet).
* Page-level spatial statistics are the clearest remaining performance gap — [issue #279](https://github.com/opengeospatial/geoparquet/issues/279) has the benchmarks and is where to weigh in.
* We run biweekly calls on advancing geospatial in Parquet, Iceberg and Arrow. Join the [geoparquet-community group](https://groups.google.com/a/cloudnativegeo.org/g/geoparquet-community) and you'll be added to the calendar.

And if you publish data, the most useful thing you can do is publish some GeoParquet 2.0 and tell us how it went.
