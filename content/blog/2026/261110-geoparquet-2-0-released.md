---
date: "2026-11-10T08:00:00-05:00"
slug: geoparquet-2-0-released
title: "GeoParquet 2.0 Released"
tags: []
summary: "GeoParquet 2.0 re-centers the specification on the native Parquet GEOMETRY and GEOGRAPHY types, aligning the geospatial world with mainstream Parquet tooling."
author: "[Chris Holmes](https://9eo.org) and [Dewey Dunnington](https://github.com/paleolimbot)"
---

We are pleased to announce the [release of GeoParquet 2.0](https://github.com/opengeospatial/geoparquet/releases/tag/v2.0.0)! The clearest explanation is in the release notes:

> GeoParquet 2.0 re-centers the specification on the [Parquet Geospatial Logical Types](https://github.com/apache/parquet-format/blob/master/Geospatial.md) that became part of the core Parquet format in version 2.11 (March 2025). Where GeoParquet 1.x layered geospatial metadata on top of plain binary columns, 2.0 makes the native Parquet GEOMETRY and GEOGRAPHY types the foundation: the geometry column is typed by the format itself, the CRS travels on the column, and per–row-group geospatial statistics enable efficient spatial filtering with no extra columns. The GeoParquet `geo` metadata remains for tool compatibility, and it provides some small things beyond what the Parquet core does, including a guaranteed inline CRS definition, polygon winding order, epoch and the primary geometry column.
>
> The overall goal of 2.0 is to align the geospatial world with mainstream Parquet tooling: any tool that writes the native Parquet geospatial types correctly produces a file the GeoParquet 2.0 ecosystem can read, whether or not it carries GeoParquet metadata, and the spec supplies that metadata in the same way previous GeoParquet versions did. In practice that already covers engines writing native types, so their files are first-class input for GeoParquet 2.0 readers. See the [Parquet Geospatial Compatibility guide](https://github.com/opengeospatial/geoparquet/blob/v2.0.0/format-specs/compatible-parquet.md) for how the pieces fit together.

{{< img src="images/20261110-geoparquet-2-spec.png" alt="The GeoParquet 2.0 specification, showing the Overview, Version and schema, and Geometry columns sections" >}}

It's taken us a bit longer than expected since we announced 20 months ago that 2.0 would be coming in [GeoParquet 2.0: Going Native](https://cloudnativegeo.org/blog/2025/02/geoparquet-2.0-going-native/). But that additional time has helped us to get a number of little things right, and also gave the GeoParquet ecosystem time to implement the Parquet Geospatial types. This means that many of the tools that work with GeoParquet 1.1 work today with GeoParquet 2.0.

The core specification did not have all that many changes. The biggest one was changing geometry columns, from our custom column of WKB to just making use of the new GEOMETRY and GEOGRAPHY columns. We removed the GeoArrow 'native' types, as they never got a huge amount of use and the new geospatial types provide the biggest advantage of GeoArrow types, which was native statistics. The `bbox` column was also removed, as it seemed less necessary with native statistics, but we brought it back when users noted that there was still a gap for page level statistics. We also added new edge values (vincenty, thomas, andoyer and karney) to match what Parquet did — they provide additional nuance on representing edges that we didn't have in the original specification.

There are a couple places where GeoParquet 2.0 provides a bit more guidance than the Parquet geospatial types. The first of these was with CRS, as GeoParquet only offered PROJJSON, but the new Parquet types let users use `<authority>:<code>`, `srid:<identifier>` or `projjson:<key_name>`. We recommend that readers should accept all options, but only recommend PROJJSON and `<authority>:<code>`, to try to nudge the ecosystem towards what we believe are better choices. We also wanted to continue to provide a way for files to communicate that they have an unknown or undefined CRS. GeoParquet metadata for that remains `crs:null` and we use `srid:0` to denote that in the Parquet CRS field.

The final bit of work in the spec repo was not in the spec itself, but is a guide for [publishing GeoParquet data](https://github.com/opengeospatial/geoparquet/blob/v2.0.0/format-specs/distributing-geoparquet.md) that lives beside the spec. Parquet gives a lot of options, so we made this to recommend some options that work well in most cases. There have also been some nice advances in the ecosystem.

* The [geoparquet-testing](https://github.com/geoparquet/geoparquet-testing) repository provides an official 'test corpus', with many sample files that can be used by implementors to test with as they develop.
* [GeoParquet Validator](https://validator.geoparquet.org/) provides an online validator for files up to 500mb, and the [geoparquet-validator repository](https://github.com/geoparquet/geoparquet-validator) powers the online validator but also provides command-line, python and rust options for running GeoParquet validation.

{{< img src="images/20261110-geoparquet-2-validator.png" alt="The GeoParquet Validator web app, validating an example file as GeoParquet 2.0.0 and reporting conformance for the Core and Cloud-Optimized Distribution classes" >}}
