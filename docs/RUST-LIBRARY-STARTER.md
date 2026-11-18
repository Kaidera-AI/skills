# Rust library starter list

**Status:** project-level candidates for evaluation; not an approved or mandatory dependency set.

**Reviewed:** 2026-11-18 UTC

**Ordering:** alphabetical by crate name; not a ranking.

This curation began with the two discovery pointers supplied for the task: [the ML catalogue](https://github.com/e-tornike/best-of-ml-rust) and [the framework catalogue](https://github.com/venuswhispers/Rust-awesome-frameworks). The entries below were then checked against each project's upstream repository and its crates.io package record. No source-catalogue ranking, grouping, or descriptive text is reproduced. Selection reasons are Quill's own.

The release shown is the newest non-yanked registry version observed on the review date. Preview versions are marked; where one exists, its latest stable version is also shown. The licence is the package licence declared in the registry. Check the linked source again before adoption.

| Crate | Why a project might evaluate it | Upstream repository | Registry record: version, published date, package licence |
|---|---|---|---|
| `anyhow` | Keeps contextual error propagation concise at an application boundary. | [dtolnay/anyhow](https://github.com/dtolnay/anyhow) | [1.0.104](https://crates.io/crates/anyhow/1.0.104) — 2026-07-18 — MIT OR Apache-2.0 |
| `axum` | Gives a service a composable HTTP routing layer when the project uses Rust and Tower. | [tokio-rs/axum](https://github.com/tokio-rs/axum) | [0.8.9](https://crates.io/crates/axum/0.8.9) — 2026-04-14 — MIT |
| `burn` | A candidate for tensor or training work where backend choice matters. | [tracel-ai/burn](https://github.com/tracel-ai/burn) | [0.23.0-pre.2](https://crates.io/crates/burn/0.23.0-pre.2) — 2026-11-09 — MIT OR Apache-2.0; latest stable [0.22.1](https://crates.io/crates/burn/0.22.1) — 2026-10-20 |
| `candle-core` | A Rust-native tensor foundation to evaluate for inference workloads. | [huggingface/candle](https://github.com/huggingface/candle) | [0.11.1](https://crates.io/crates/candle-core/0.11.1) — 2026-10-31 — MIT OR Apache-2.0 |
| `clap` | Helps a CLI expose typed flags, subcommands, and consistent help output. | [clap-rs/clap](https://github.com/clap-rs/clap) | [4.6.8](https://crates.io/crates/clap/4.6.8) — 2026-11-16 — MIT OR Apache-2.0 |
| `ort` | A candidate for running an existing ONNX model through ONNX Runtime. | [pykeio/ort](https://github.com/pykeio/ort) | [2.0.0-rc.15](https://crates.io/crates/ort/2.0.0-rc.15) — 2026-10-19 — MIT OR Apache-2.0; no stable release listed |
| `proptest` | Generates varied inputs to probe invariants beyond a hand-picked example set. | [proptest-rs/proptest](https://github.com/proptest-rs/proptest) | [1.12.0](https://crates.io/crates/proptest/1.12.0) — 2026-10-10 — MIT OR Apache-2.0 |
| `reqwest` | Covers outbound HTTP calls when a project needs a Rust client. | [seanmonstar/reqwest](https://github.com/seanmonstar/reqwest) | [0.13.5](https://crates.io/crates/reqwest/0.13.5) — 2026-09-08 — MIT OR Apache-2.0 |
| `serde` | Lets shared Rust types cross JSON, configuration, and other serialization boundaries. | [serde-rs/serde](https://github.com/serde-rs/serde) | [1.0.229](https://crates.io/crates/serde/1.0.229) — 2026-07-18 — MIT OR Apache-2.0 |
| `sqlx` | Provides typed asynchronous SQL access when a project can own its query and migration setup. | [transact-rs/sqlx](https://github.com/transact-rs/sqlx) | [0.9.1](https://crates.io/crates/sqlx/0.9.1) — 2026-11-18 — MIT OR Apache-2.0 |
| `thiserror` | Reduces boilerplate for explicit error types in reusable libraries. | [dtolnay/thiserror](https://github.com/dtolnay/thiserror) | [2.0.21](https://crates.io/crates/thiserror/2.0.21) — 2026-09-23 — MIT OR Apache-2.0 |
| `tokenizers` | A candidate for model-compatible text tokenization in NLP workflows. | [huggingface/tokenizers](https://github.com/huggingface/tokenizers) | [1.0.0-rc.4](https://crates.io/crates/tokenizers/1.0.0-rc.4) — 2026-11-09 — Apache-2.0; latest stable [0.23.2](https://crates.io/crates/tokenizers/0.23.2) — 2026-09-03 |
| `tokio` | Supplies an async runtime for services and tools that perform concurrent I/O. | [tokio-rs/tokio](https://github.com/tokio-rs/tokio) | [1.54.1](https://crates.io/crates/tokio/1.54.1) — 2026-10-21 — MIT |
| `tracing` | Adds structured spans and events to help follow work across service boundaries. | [tokio-rs/tracing](https://github.com/tokio-rs/tracing) | [0.1.44](https://crates.io/crates/tracing/0.1.44) — 2025-12-18 — MIT |

## Applying the list

Treat each row as a starting point for a project-level decision. Before adoption, check the exact crate version and feature set against the project's MSRV, supported targets, security advisories, distribution model, native dependencies, runtime needs, and operational footprint. Review transitive licences for the selected features. No dependency or shared version is adopted by this note.
