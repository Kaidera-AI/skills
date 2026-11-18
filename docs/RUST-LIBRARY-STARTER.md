# Rust library starter list

**Status:** project-level candidates for evaluation. This is not an approved, pinned, or mandatory dependency set.  
**Reviewed:** 2026-11-18

This note starts from two catalogues supplied for this curation: [best-of-ml-rust](https://github.com/e-tornike/best-of-ml-rust) and [Rust-awesome-frameworks](https://github.com/venuswhispers/Rust-awesome-frameworks). The first is useful for ML discovery and publishes a combined quality score based on GitHub and package-manager metrics; its repository was last pushed on 2026-11-01, although some visible package-update dates are from 2024. The second is a broad topic map across areas such as CLI, web, databases, and testing; its repository was last pushed on 2024-02-19. Treat both as discovery indexes, not as adoption, maintenance, security, or licence evidence.

## Cross-project candidates

| Need | Candidate | Why it is on the list | Check before adopting |
|---|---|---|---|
| Data types and serialization | [Serde](https://github.com/serde-rs/serde) | A widely used serialization framework; useful at JSON, configuration, and API boundaries. | Choose the format crate and wire-compatibility policy explicitly. |
| Command-line tools | [clap](https://github.com/clap-rs/clap) | Argument parsing, subcommands, and derived CLI definitions. | Check feature selection and generated help/completions against the target CLI. |
| Async applications | [Tokio](https://github.com/tokio-rs/tokio) | Runtime, I/O, scheduling, and timers for asynchronous apps. | Add only when async work is needed; avoid introducing a second runtime into a process. |
| Outbound HTTP | [reqwest](https://github.com/seanmonstar/reqwest) | Ergonomic async or blocking HTTP client with JSON, proxy, redirect, and TLS options. | Set timeouts, redirect behavior, proxy policy, and the TLS backend deliberately; review enabled features. |
| Structured diagnostics | [tracing](https://github.com/tokio-rs/tracing) | Application-level spans and events for contextual logs and instrumentation. | Select the subscriber/exporter and redact secrets before recording fields. |
| Typed library errors | [thiserror](https://github.com/dtolnay/thiserror) | Derives standard error implementations for public error enums and structs. | Keep stable error types intentional; expose source errors and context appropriately. |
| Application error context | [anyhow](https://github.com/dtolnay/anyhow) | Convenient error propagation and context in binaries and application boundaries. | Prefer typed errors in reusable public libraries; keep application context at the edge. |
| Property-based tests | [proptest](https://github.com/proptest-rs/proptest) | Generates varied inputs to check invariants in parsers, transforms, and state logic. | Use alongside example tests; keep cases reproducible and runtime bounded. |
| HTTP services | [axum](https://github.com/tokio-rs/axum) | Modular routing and request handling that fits the Tokio/Tower ecosystem. | Use when a Rust HTTP service is needed; verify compatibility with the project's middleware and runtime. |
| Relational databases | [SQLx](https://github.com/transact-rs/sqlx) | Async SQL access with compile-time checked queries; upstream lists PostgreSQL, MySQL, and SQLite. | Decide migration ownership, query-check/offline metadata, TLS, and database feature set. |

## ML and data candidates

These are workload-specific options, not baseline dependencies.

| Need | Candidate | Best fit to evaluate | Main compatibility question |
|---|---|---|---|
| Rust-native tensor and ML work | [Candle](https://github.com/huggingface/candle) | Model inference and tensor operations when its supported operators and backends fit the model. | Confirm model/operator coverage, target hardware, and CPU/CUDA/Metal build needs. |
| Training and portable tensor backends | [Burn](https://github.com/tracel-ai/burn) | A broader tensor and deep-learning framework when training, autodiff, or backend portability matters. | Select and test the backend against the exact target; measure compile and runtime costs. |
| NLP tokenization | [Hugging Face Tokenizers](https://github.com/huggingface/tokenizers) | Fast tokenization for text and transformer workflows. | Check vocabulary/model compatibility and language/runtime integration needs. |
| ONNX model execution | [ort](https://github.com/pykeio/ort) | Rust access to ONNX Runtime when serving an exported ONNX model is a fit. | Verify native runtime distribution, execution-provider availability, target architecture, and model operators. |

## A practical starting profile

For a small Rust CLI or service, evaluate Serde, clap (for a CLI), thiserror for library boundaries, anyhow for application-level context, tracing, and proptest. Add Tokio and reqwest when asynchronous networking is required; add axum for an HTTP server and SQLx for a supported relational database. For ML, choose one inference or training path only after validating the actual model and hardware requirements.

Do not add every item to a shared template. A project should select dependencies based on its runtime, supported targets, interface stability, and operational needs.

## Checks before a project adopts a candidate

For the exact crate and feature set being proposed:

1. Check the current crate release, MSRV, target support, maintenance activity, security advisories, and upstream support policy.
2. Review the crate licence and the licences of enabled and transitive dependencies against that project's distribution model.
3. Inspect default and optional features, native libraries, TLS behavior, GPU/runtime downloads, build time, and binary size.
4. Confirm that the library's data, error, async, and compatibility behavior fits the owning project's API and migration plan.
5. Pin the chosen version in that project's manifest or workspace only after those checks; do not infer a shared version from this note.

## Discovery sources

- [best-of-ml-rust](https://github.com/e-tornike/best-of-ml-rust) — ranked ML discovery catalogue.
- [Rust-awesome-frameworks](https://github.com/venuswhispers/Rust-awesome-frameworks) — broad Rust framework and library topic map.
- Each candidate above links to its upstream project repository for current documentation, manifest, releases, and support evidence.
