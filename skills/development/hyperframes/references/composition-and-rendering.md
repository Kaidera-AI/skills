# Composition and rendering

Reviewed source: [HyperFrames](https://github.com/heygen-com/hyperframes/tree/6f3f86a9c9824c8ad5b7bf760375e243466e5ee0), Apache-2.0. CLI source version: 0.8.144, Node >=22. The local rendering loop needs FFmpeg and the CLI's browser runtime. This is original adaptation text; no upstream code, skill body or media is redistributed.

Before creating composition HTML, read the pinned [minimal composition](https://github.com/heygen-com/hyperframes/blob/6f3f86a9c9824c8ad5b7bf760375e243466e5ee0/skills/hyperframes-core/references/minimal-composition.md) and [data attributes](https://github.com/heygen-com/hyperframes/blob/6f3f86a9c9824c8ad5b7bf760375e243466e5ee0/skills/hyperframes-core/references/data-attributes.md). Use their actual runtime contract; vendor permitted runtime assets locally for offline rendering rather than depend on the example CDN.

## Render invariants

- A standalone root is in the document body; a sub-composition uses a template whose styles/scripts belong inside it. Give root, host and timeline registry matching composition IDs; prefix child IDs to keep the assembled document unique.
- Set `data-composition-id`, `data-width` and `data-height` on the composition root. Timed clips use `data-start` and `data-duration`; sub-composition hosts use `data-composition-src`. Read the pinned media attribute table for video/audio IDs and the timed-video `muted` / `data-has-audio` declaration. Size the composition with its canvas attributes and make the root fill it. Declare finite duration explicitly when reproducibility matters. A tween extending past that duration will be cropped; an early-ending timeline holds its final state.
- For the GSAP adapter, build one paused timeline per composition and register it as `window.__timelines[compositionId]` after construction, including after fonts resolve. Read the matching adapter for other runtimes.
- Seeked frames must depend on timeline time and fixed inputs. Use deterministic randomness when needed; avoid render-time clocks, live network dependencies and interaction state.
- The framework owns clip visibility and media seeking. Animate a child of a clip, and place video timing on either the video or its plain timed wrapper. Audio elements need IDs. Preserve source offsets when trimming.
- Resolve layout position separately from animated transforms to prevent CSS/GSAP conflicts. Ship local font files with matching declarations.

## Local loop

Check project scripts and the installed CLI's help before selecting flags. Using the already approved project-local binary from the composition directory:

```sh
./node_modules/.bin/hyperframes lint
./node_modules/.bin/hyperframes check
./node_modules/.bin/hyperframes snapshot --at 0,1
./node_modules/.bin/hyperframes preview --background
./node_modules/.bin/hyperframes render --quality looks --output out.mp4
ffprobe -v error -show_format -show_streams out.mp4
```

The snapshot times above are examples, not sufficient coverage. Inspect scene boundaries, scene midpoints, nested compositions, text holds and the final visible frame for the actual duration. `check` includes lint; lint errors can prevent runtime/layout checks, so zero sampled frames is a validation limit. Rendering follows the task's required review gate; an existing request to render supplies render authorization, not publication or paid-service authorization.

Compare export duration, dimensions, frame rate, audio and text legibility to the brief. Record the command, exit/result, CLI pin and output path. Only claim a completed render after the non-empty artifact exists; visual quality claims need inspected frames or preview evidence.

Evidence files at the pinned source: `packages/cli/package.json`, `skills/hyperframes-core/SKILL.md`, `skills/hyperframes-cli/SKILL.md`, `skills/hyperframes-animation/SKILL.md`, and relevant domain references. Upstream default-framework, automatic upgrade and plugin instructions are not imported into this adapter.
