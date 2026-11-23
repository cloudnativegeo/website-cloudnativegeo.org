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

The core specification didn't change much. The biggest change is the geometry column itself: where in 1.1 we defined our own WKB column, 2.0 simply uses the new GEOMETRY and GEOGRAPHY types. We also removed the infrequently used GeoArrow 'native' encodings whose native statistics are now available via the GeoStatistics of the GEOMETRY and GEOGRAPHY columns. We removed the `bbox` covering column too, since GeoStatistics make it largely redundant — then brought it back as an option when users pointed out it still fills a real gap at the page level. We also added four new `edges` values — vincenty, thomas, andoyer, and karney — to match Parquet, giving a finer description of how edges are interpolated than the original spec allowed.

{{< img src="images/20261124-geoparquet-1-1-vs-2-0.png" alt="Side-by-side comparison of a GeoParquet 1.1 file and a GeoParquet 2.0 file. In 1.1 the geometry column is a plain BYTE_ARRAY, a separate bbox struct column is needed for filtering, and all the geospatial meaning sits in the 'geo' metadata in the file footer. In 2.0 the geometry column is a native GEOMETRY or GEOGRAPHY logical type carrying its own CRS and per-row-group bounding box statistics, the bbox column is optional, and the 'geo' metadata becomes a helper." >}}

## Where GeoParquet still adds guidance

In a couple of places GeoParquet 2.0 is more opinionated than the Parquet types require. The first is CRS. GeoParquet has only ever offered PROJJSON, while the Parquet types also accept `<authority>:<code>`, `srid:<identifier>` and `projjson:<key_name>`. Readers should accept all of them; writers should stick to PROJJSON or `<authority>:<code>`. The asymmetry is deliberate — it nudges the ecosystem toward the forms we think will age best.

The second is saying "I don't know." A file still needs a way to declare an unknown or undefined CRS. That stays `crs: null` in the GeoParquet metadata, and `srid:0` in the Parquet CRS field.

## Publishing GeoParquet well

The last piece of work in the spec repo isn't in the spec at all. It's a guide to [publishing GeoParquet data](https://github.com/opengeospatial/geoparquet/blob/v2.0.0/format-specs/distributing-geoparquet.md) that lives alongside it. Parquet gives a lot of options, so we made this to recommend some options that work well in most cases: zstd compression at level 15 or higher, spatially ordering the data within each file, row groups of roughly 50 000 to 150 000 rows, spatial partitioning once a dataset grows past a couple of gigabytes, and STAC metadata to describe the result. A companion guide shows [how to do all of that](https://github.com/opengeospatial/geoparquet/blob/v2.0.0/format-specs/distributing-geoparquet-tools.md) in GDAL, DuckDB, SedonaDB and geoparquet-io.

## Testing and validation

There have also been some nice advances in the ecosystem around making 2.0 easy to adopt.

* [geoparquet-testing](https://github.com/geoparquet/geoparquet-testing) is an official test corpus, a pile of sample files for implementers to develop against.
* [GeoParquet Validator](https://validator.geoparquet.org/) checks 1.0, 1.1 and 2.0 files in the browser. Nothing is uploaded — the file stays on your machine, and a URL is read with range requests rather than downloaded whole, so a large file on S3 resolves in seconds. It's the [geoparquet-validator](https://github.com/geoparquet/geoparquet-validator) command-line tool compiled to WebAssembly, and the same project ships Rust, Python, npm and C builds for scripting and CI.

{{< img src="images/20261124-geoparquet-2-validator.png" alt="The GeoParquet Validator web app, validating an example file as GeoParquet 2.0.0 and reporting conformance for the Core and Cloud-Optimized Distribution classes" >}}

## Where tool support stands

The Parquet geospatial types landed in Arrow C++ and pyarrow in 21.0.0, back in July 2025, which means a number of tools have gained the ability to round-trip a typed geometry column. Reading is in good shape. Shipped releases that understand native `GEOMETRY` and `GEOGRAPHY` columns today include:

* **GDAL/OGR** since 3.12 (with libarrow 21 or newer)
* **DuckDB** since 1.5, where `GEOMETRY` moved into core
* **pyarrow / Arrow C++** since 21.0.0
* **GeoPandas** since 1.2.0
* **Apache Spark** since 4.2, and Databricks Runtime 18 on Spark 4.1
* **SedonaDB** since 0.4.0
* **hyparquet** since 1.19, decoding native geometry columns straight to GeoJSON in JavaScript
* **Parquetry**, a clean-room Java implementation of Parquet built around the geospatial types from its first release, with a `par` command-line tool alongside the library
* **QGIS** since 4.2, through its bundled GDAL — it opens a native-typed file even when there is no `geo` metadata in it at all
* **GeoServer Cloud** since 3.0.1, which serves native-typed files through its Parquetry-backed Parquet datastore

Plenty of tools can write 2.0 output as well, though none of them do it by default yet — reasonably enough, since the spec has only just landed. In DuckDB you ask for it with `COPY ... TO 'out.parquet' (FORMAT parquet, GEOPARQUET_VERSION 'V2')`; in GeoPandas with `to_parquet(..., schema_version="2.0.0")`. SedonaDB, [geoparquet-io](https://github.com/geoparquet/geoparquet-io) and Parquetry will write 2.0 too, and SedonaDB is currently one of the few things that writes the `GEOGRAPHY` type at all. Expect the defaults to move as the readers become ubiquitous.

A few gaps are worth knowing about. GDAL can write native geospatial types from 3.12 with the `USE_PARQUET_GEO_TYPES=YES` layer creation option, but full GeoParquet 2.0 support arrives in 3.14, which hasn't been released yet. Apache Sedona merged its GeoParquet 2.0 reader and writer in November, targeted at the 2.0.0 release, so it's in the repo but not yet in a release you can install. GeoPandas 1.2 reads and writes 2.0, but only by way of the `geo` metadata — hand it a file carrying nothing but native Parquet types and it will tell you the geo metadata is missing, where GDAL and DuckDB read that file fine. And `GEOGRAPHY` lags `GEOMETRY` across the board; DuckDB, for instance, has no `GEOGRAPHY` type in core today.

## Should you switch?

For most people, we think the answer is yes — give it a go.

If your data is read by DuckDB, SedonaDB, Spark, GeoPandas, QGIS, or anything sitting on modern Arrow, GeoParquet 2.0 gets you smaller files with no `bbox` column, spatial filtering for free from row group statistics, and a geometry column that non-geospatial tooling can recognize as geospatial. That last point is the key one, as geospatial stops being something you bolt on and becomes something your database already understands, and that only happens once there are 2.0 files out there to read.

The reason to stay on 1.1 is to be sure older tooling still works. If you are publishing to the widest possible audience, and can't assume much about what will open your file, 1.1 with a `bbox` covering column is still the safer bet today. It's what the large public datasets do, Overture Maps included, and all readers will continue to read it for many years.

## Thanks, and how to help

GeoParquet 2.0 is the work of a lot of people across a lot of organizations, and most of it happened somewhere other than the GeoParquet repo. Getting GEOMETRY and GEOGRAPHY into Parquet itself took years of patient work in the Apache Parquet community, and the implementers who shipped those types in Arrow, GDAL, DuckDB, Sedona and elsewhere are the reason a 2.0 file is useful on the day the spec ships rather than a year later. Thank you to everyone who wrote a PR, filed an issue, argued about CRS strings, or just tried the release candidates and told us what broke.

If you want to help, the most useful thing you can do is publish some GeoParquet 2.0 and tell us how it went. Every file out in the world gives implementers something real to test against, gives the tools a reason to move their defaults, and shows us where the spec is still vague. If you hit something that doesn't work, or want a hand in what comes next, the [GeoParquet repo](https://github.com/opengeospatial/geoparquet) is where the spec and discussions live.
