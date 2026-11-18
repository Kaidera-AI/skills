# Rust library starter catalog

**Reviewed:** 2026-11-18  
**Status:** Curated candidates for project evaluation. No library here is approved or required for every project.

## How to use this catalog

This is a practical starting shortlist for teams building Rust services, command-line tools, tests, and data or machine-learning features. The two supplied repositories are useful discovery indexes; their presence in the list is not an endorsement of every entry.

- [best-of-ml-rust](https://github.com/e-tornike/best-of-ml-rust) is an ML-focused ranked index using collected repository and package-manager metrics. Its ranking and update indicators are discovery signals, not a current compatibility, security, license, or quality review.
- [Rust-awesome-frameworks](https://github.com/venuswhispers/Rust-awesome-frameworks) is a broad topical list. Use it to find names to investigate, then follow the project’s own documentation and source.

The summaries below were checked against the projects’ own documentation on the review date. This is desk research: we have not built these crates in our projects, run comparative benchmarks, or completed a release-by-release license and security audit. Links to “latest” docs move over time. Do not infer a version pin or a shared dependency policy from this page.

## Cross-project candidates

| Area | Candidate | Consider it for | Selection notes |
|---|---|---|---|
| Data interchange | [Serde](https://serde.rs/) and a format crate such as [serde_json](https://docs.rs/serde_json/latest/serde_json/) | Serializing and deserializing Rust types across JSON and other supported formats. | Serde defines the data model and serialization interfaces; it is not itself a parser for arbitrary formats. Choose the format crate the project actually needs. |
| Error types | [thiserror](https://docs.rs/thiserror/latest/thiserror/) | Explicit error enums and types in libraries or domain boundaries. | Derives the standard error traits while leaving the chosen type in the API. Keep public errors intentional and stable. |
| Application errors | [anyhow](https://docs.rs/anyhow/latest/anyhow/) | Context-rich error propagation at an application boundary. | Useful for composing failures in binaries and services. Prefer a deliberate typed error contract where a library’s callers need to match on errors. |
| Async runtime | [Tokio](https://tokio.rs/tokio/tutorial) | Applications that need asynchronous I/O and concurrent network work, or whose selected libraries require a runtime. | Add it for an actual async workload. Tokio’s guide distinguishes I/O concurrency from CPU-bound parallelism and notes cases where a blocking API is simpler. Select only required features. |
| Inbound HTTP | [axum](https://docs.rs/axum/latest/axum/) with [tower](https://docs.rs/tower/latest/tower/) | HTTP APIs and composable middleware. | Axum handlers integrate with Tower services and middleware. Confirm runtime, protocol, and feature needs for the target service. |
| Outbound HTTP | [reqwest](https://docs.rs/reqwest/latest/reqwest/) | Calling external HTTP APIs. | Offers async and blocking clients; the async client requires Tokio. Reuse a client for repeated requests and enable only needed features such as JSON. |
| SQL access | [SQLx](https://docs.rs/sqlx/latest/sqlx/) | Direct SQL access when compile-time query checking and an async toolkit fit the project. | SQLx is not an ORM. Choose the database, runtime, TLS backend, and feature set explicitly; verify compile-time query setup in the project’s build environment. |
| Diagnostics | [tracing](https://docs.rs/tracing/latest/tracing/) and [tracing-subscriber](https://docs.rs/tracing-subscriber/latest/tracing_subscriber/) | Structured events and spans in services, async applications, or command-line tools. | A subscriber collects and formats or exports the instrumentation. Agree field names, filtering, and sensitive-data rules within each application. |
| Command-line interface | [clap](https://docs.rs/clap/latest/clap/) | User-facing commands, flags, help output, and subcommands. | Choose derive or builder style based on the CLI shape; test the user-visible command contract. |
| Property tests | [proptest](https://docs.rs/proptest/latest/proptest/) | Testing invariants over generated inputs, including shrinking a failing input to a smaller case. | Use for properties and edge cases that are hard to cover with a few examples. Check current maintenance and MSRV against the project before adoption. |
| HTTP test doubles | [wiremock](https://docs.rs/wiremock/latest/wiremock/) | Black-box tests of code that calls an external HTTP service. | Mock only the network boundary your test needs; keep at least some contract checks against the real service or its published schema where appropriate. |

## Data and machine-learning specialists

These candidates belong in a project only when its workload calls for them. They should not be added to a baseline shared dependency set.

| Candidate | Fit to investigate | Confirm before choosing |
|---|---|---|
| [Burn](https://burn.dev/book/) | Rust deep-learning workflows covering tensors, automatic differentiation, models, training, and backends. | Backend feature selection, target hardware, model interoperability, compile time, and deployment footprint. |
| [Candle](https://huggingface.github.io/candle/) | Tensor and model work, including inference-oriented workflows and supported CPU, GPU, and WebAssembly targets. | Required operators, model formats, supported hardware, performance on the intended workload, and integration constraints. |
| [Linfa](https://docs.rs/linfa/latest/linfa/) | Classical machine learning and common preprocessing tasks. | Whether the needed algorithm exists and its documented status, dataset scale, and numerical behavior. |
| [ndarray](https://docs.rs/ndarray/latest/ndarray/) | General n-dimensional arrays and numerical operations. | Array layout, linear-algebra needs, interoperability, and whether a more specialized tensor or matrix type fits better. |
| [Polars](https://docs.rs/polars/latest/polars/) | DataFrame transformation and analytical query workloads. | Data size, eager/lazy execution needs, enabled I/O and expression features, and memory/latency behavior on representative data. |

## Project adoption checklist

Before adding a candidate to a project:

1. Name the concrete use case and compare it with the project’s current stack.
2. Check the exact crate release, declared Rust version/MSRV, supported targets, feature flags, and build prerequisites.
3. Review the exact release’s license and notices, plus licenses and security advisories across the resolved dependency tree.
4. Check recent releases, issue/maintenance signals, compatibility constraints, and whether the project has a stable API for its needs.
5. Build a small representative spike with the project’s toolchain and target platforms; measure compile time, binary or image size, and runtime cost when those affect the product.
6. Record the chosen version and rationale in that project’s own manifest and decision record. This catalog deliberately does not prescribe shared versions.

## Sources and review boundary

Primary sources linked in the tables are each project’s documentation or crate documentation. The supplied indexes are:

- https://github.com/e-tornike/best-of-ml-rust
- https://github.com/venuswhispers/Rust-awesome-frameworks

Review the sources again before selecting a dependency; the index contents, crate versions, support, and release status can change.