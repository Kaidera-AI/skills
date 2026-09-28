# Jev toolkit attribution

This toolkit is licensed under Apache License 2.0 (see `LICENSE`). Its Gavel lead question maps and request construction derive from Kaidera's `.agents/skills/gavel/tools/gavel.py` at `9ccc6cc27e4448a551d533a938bfef962cf34a4f`; the parity golden fixture in the source repository's test suite (not shipped with the installed skill) pins that source's SHA-256.

The following MIT-licensed sources inform or supply the W1 implementations and design. Their copyright notices are retained here:

- [TypeSafe AI skills](https://github.com/typesafe-ai/skills/tree/65a39f393687675ce170e6094757de20370365b9), Copyright (c) 2026 TypeSafe AI — typed judgment and tool-choice design reference, pinned to the upstream revision resolved on 2026-09-28; no TypeSafe skills code is copied.
- [jkudish/jev-mcp](https://github.com/jkudish/jev-mcp/tree/108d61ec0442aef3d212dcc6a18a5f3cf3ce4fda), Copyright (c) 2026 Joey Kudish — `jev_verify`, `jev_screen`, `jev_decide`, model and retry/redaction design, and starting annotation points.
- [jkudish/jev-agent-tools](https://github.com/jkudish/jev-agent-tools/tree/97b8212eddba9459a9e885f0960f06cd7f21394a), Copyright (c) 2026 Joey Kudish — fail-closed answer validation and option-count-scaled rounding tolerance.
- [awlevin/typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use), Copyright (c) 2026 Aaron Levin — design reference for a separately gated future UI adapter; no code shipped in W1.
- [anishfn/shapeshift](https://github.com/anishfn/shapeshift), Copyright (c) 2026 Shapeshift contributors — design reference for explicitly low-trust local-heuristic annotation; no TypeScript code copied.

MIT permission and warranty notice for the MIT materials named above:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

When projected into the `Kaidera-AI/skills` marketplace, retain its separate repository-level CC-BY-4.0 notice, Copyright (c) 2026 EnGenAI (engenai.app), alongside this skill-level Apache-2.0 and the upstream MIT notices. No public projection is part of Wave 1.
