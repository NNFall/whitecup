# White Cup Reference Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct the supplied White Cup first screen as a measured 16:9 composition with separately controllable generated/documentary layers, then align the remaining scenes to the same paper/ink/orange system.

**Architecture:** Keep the React/Vite scene structure, but replace the current single generated hero panel with an explicit layer stack: paper frame, generated café backdrop, burger and latte cutouts, generated doodle pack, skyline, and DOM copy. Use CSS custom properties for measured reference coordinates and a dedicated mobile art direction. Keep documentary provenance in `src/data/media.ts` and expose synthetic layers as decorative-only.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS custom properties, Playwright CLI, Image Generation Skill, Remove Background Local.

---

### Task 1: Capture and lock the measured reference contract

**Files:**
- Create: `docs/superpowers/specs/2026-08-24-white-cup-reference-reconstruction-design.md`
- Create: `docs/reference/white-cup-hero-grid.md`
- Test: `src/sections/SceneSections.test.tsx`

- [ ] **Step 1: Record canonical dimensions and coordinates**

Create `docs/reference/white-cup-hero-grid.md` with the 1672×941 source dimensions and measured rectangles for logo, nav row, h1, lede, CTA group, café seam, burger, latte, doodle route, heart, and skyline baseline. Store ratios as `x / 1672`, `y / 941`, `width / 1672`, `height / 941` so the CSS can scale them.

- [ ] **Step 2: Add failing contract assertions**

Extend the hero test to require a `.hero-reference-frame`, `.hero-cafe-backdrop`, `.hero-food-burger`, `.hero-food-latte`, `.hero-doodle-layer`, and `.hero-skyline-layer`, all decorative layers marked `aria-hidden="true"`; require DOM copy and CTA names to remain exact.

- [ ] **Step 3: Run the focused test and confirm the expected failure**

Run `npm test -- --run src/sections/SceneSections.test.tsx`; the new layer selectors must fail against the current single-panel implementation.

### Task 2: Produce separated, provenance-labelled image layers

**Files:**
- Create: `public/media/hero-cafe-backdrop.png`
- Create: `public/media/hero-food-burger.png`
- Create: `public/media/hero-food-latte.png`
- Create: `public/media/hero-doodles-reference.png`
- Create: `public/media/hero-skyline-reference.png`
- Modify: `src/data/media.ts`
- Modify: `docs/visual-deviations.md`

- [ ] **Step 1: Generate the café backdrop**

Use Image Generation Skill with the supplied reference as visual direction: produce a clean 16:9 café interior crop with red ceiling, hanging bulbs, bar and tables in the right-side composition; explicitly forbid text, logos, UI, burger, and cup. Inspect the output and copy only the selected asset into `public/media/hero-cafe-backdrop.png`.

- [ ] **Step 2: Generate and remove backgrounds from food cutouts**

Generate a single breakfast burger/bagel and a white latte cup/saucer matching the source angles. Run Remove Background Local on each output, inspect alpha edges, and copy the chosen transparent PNGs to `public/media/hero-food-burger.png` and `hero-food-latte.png`.

- [ ] **Step 3: Generate the doodle and skyline layers**

Generate transparent thin black/orange line art for the dotted route, cup, clouds, birds, small marks, and heart; separately generate a thin Samara skyline with the reference cathedral silhouette and orange sun. Inspect both and keep only assets with no text or logo.

- [ ] **Step 4: Register provenance**

Add explicit `MediaProvenance` entries for every generated asset. Mark them `kind: 'decorative'`, `sourceLabel: 'Image Generation Skill'` (and `Remove Background Local` for cutouts), and state that they are synthetic art direction, not documentary venue evidence. Update `docs/visual-deviations.md` with the decision and source files.

### Task 3: Rebuild the hero layer stack with TDD

**Files:**
- Modify: `src/sections/HeroSection.tsx`
- Modify: `src/components/BrandMark.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/styles/tokens.css`
- Modify: `src/sections/SceneSections.test.tsx`
- Modify: `src/components/BrandMark.test.tsx`

- [ ] **Step 1: Add the failing frame/layer markup contract**

Render the reference frame and five named layers in `HeroSection`, keep all generated layers `alt="" aria-hidden="true"`, and make the normal food cutouts load only as visible layers (no hidden `src` fallback request). Keep the exact Russian copy in DOM.

- [ ] **Step 2: Implement the canonical desktop grid**

Use the measured ratios from `docs/reference/white-cup-hero-grid.md` to position the logo, nav, copy, lede, CTA, doodle layer, café seam, food cutouts, and skyline. Replace the current darker paper token with the sampled near-white reference token and add a visible, low-contrast paper grain. Keep the CSS text as the source of truth; never duplicate baked text from an image.

- [ ] **Step 3: Match seam, crop, and depth**

Use an organic CSS mask or a generated transparent seam to match the reference edge. Put backdrop behind the cutouts, keep burger/latte aligned to the source overlap, and ensure the left paper field remains clean under copy/CTA.

- [ ] **Step 4: Implement mobile art direction**

At 390px/320px stack copy first and the café scene below, preserve 16/20px gutters, keep buttons full width, hide only non-essential doodles, and confirm the skyline/food layers do not clip text or introduce overflow.

- [ ] **Step 5: Run focused tests**

Run `npm test -- --run src/sections/SceneSections.test.tsx src/components/BrandMark.test.tsx`; expect all hero layer/provenance assertions to pass.

### Task 4: Align the rest of the landing to the rebuilt visual system

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/sections/MenuSection.tsx`
- Modify: `src/sections/AboutSection.tsx`
- Modify: `src/sections/VisitSection.tsx`
- Modify: `src/sections/EventsSection.tsx`
- Modify: `src/sections/LocationsSection.tsx`
- Modify: `src/components/SectionFrame.tsx`

- [ ] **Step 1: Unify paper/background and scene transitions**

Apply the sampled near-white paper, grain, petrol/navy ink, orange accent, and soft scene boundaries consistently. Remove any remaining darker-beige or generic rounded-card treatment that conflicts with the supplied reference system.

- [ ] **Step 2: Recheck content rhythm and anchors**

Keep menu, formats, events, community/reviews, contacts, and booking usable; preserve existing verified links and avoid inventing prices or venue facts. Adjust section spacing only where it restores the reference rhythm.

- [ ] **Step 3: Preserve accessibility and reduced motion**

Retain heading hierarchy, named regions, focus rings, keyboard menu/carousel behavior, meaningful documentary alt text, and reduced-motion immediate visibility.

### Task 5: Browser comparison and quality gates

**Files:**
- Create/refresh: `docs/evidence/reference-reconstruction/hero-1920.png`
- Create/refresh: `docs/evidence/reference-reconstruction/hero-1536.png`
- Create/refresh: `docs/evidence/reference-reconstruction/hero-390.png`
- Create/refresh: `docs/evidence/reference-reconstruction/hero-320.png`
- Modify: `docs/verification.md`
- Modify: `docs/visual-deviations.md`

- [ ] **Step 1: Run visual browser checks**

Use fixed `127.0.0.1:4175`, capture the four viewports, compare current/reference side-by-side, and record DOM bounds plus `scrollWidth === clientWidth`.

- [ ] **Step 2: Check reduced motion and console**

Emulate `prefers-reduced-motion: reduce`, assert visible copy and `transform: none`, and confirm zero page errors/warnings in a fresh browser session.

- [ ] **Step 3: Run automated gates**

Run `npm test -- --run`, `npm run build`, and `git diff --check` after the final visual edits.

- [ ] **Step 4: Request independent review**

Dispatch visual audit, asset provenance audit, and final code review agents. Resolve every P1/P2 before staging; do not claim “one-to-one” while a measured comparison still shows drift.

- [ ] **Step 5: Commit and publish**

Stage only intended source/assets/evidence/docs, commit `feat: reconstruct White Cup reference hero`, push `master` to `https://github.com/NNFall/whitecup.git`, verify remote SHA, and leave the fixed local server available.

