---
description: Next.js 15, TypeScript type resolution, and Zustand architecture rules for complex practice management apps
---

# Next.js 15 & Zustand Architecture Rules

1. **Type Resolution Single Source of Truth**:
   - In Next.js projects with `@/types` path mapping, ensure root `types.ts` cleanly re-exports `./types/index` without conflicting duplicate interface definitions.
   - Define union types (such as `TabType` or `EntityStatus`) in a single shared file to prevent narrow-vs-wide type mismatch errors across components.

2. **Safe Property Access on Nested Domain Models**:
   - When mapping or joining arrays on deeply nested domain objects (e.g. `client.proactiveStrategies`, `assessment.domainScores`), always use optional chaining and defensive array fallbacks (`(doc.strategies || []).map(...)` or `doc.strategies?.join(...)`).
   - Always provide explicit date fallbacks when parsing timestamps (`new Date(item.date || Date.now())`) to prevent runtime NaN dates or TypeScript `undefined` overload errors.

3. **Build Target Scoping**:
   - Keep CLI test scripts and test fixtures (e.g., `scripts/`, `tests/`) excluded from the Next.js application `tsconfig.json` (`"exclude": ["node_modules", "scripts", "tests"]`) so CLI-specific execution syntax (like `.ts` extension imports) does not break `next build`.

4. **Zero-Hydration Visualizations**:
   - For complex analytics and longitudinal timelines in Next.js App Router, prefer native responsive SVG and CSS flex/grid visualizers over heavy third-party canvas or DOM charting libraries to eliminate SSR hydration mismatches and client layout shift.
