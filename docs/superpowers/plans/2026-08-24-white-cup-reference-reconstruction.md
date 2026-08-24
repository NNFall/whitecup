# White Cup Reference Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct the supplied White Cup first screen as a measured 16:9 composition with separately controllable reference-art/documentary layers, then align the remaining scenes to the same paper/ink/orange system.

**Architecture:** Keep the React/Vite scene structure and use an explicit hero layer stack: paper frame, mechanical reference crop for the café panel, exact alpha-extracted doodles/logo/skyline, and semantic DOM copy. Generated food/interior assets remain provenance-labelled optional artwork but are not loaded in the normal hero path. Use CSS custom properties for measured reference coordinates and a dedicated mobile art direction. Keep documentary provenance in `src/data/media.ts` and expose all art layers as decorative-only.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS custom properties, Codex in-app Browser, Image Generation Skill, Remove Background Local.

---

### Task 1: Capture and lock the measured reference contract

**Files:**
- Create: `docs/superpowers/specs/2026-08-24-white-cup-reference-reconstruction-design.md`
- Create: `docs/reference/white-cup-hero-grid.md`
- Test: `src/sections/SceneSections.test.tsx`

- [x] **Step 1: Record canonical dimensions and coordinates**

Create `docs/reference/white-cup-hero-grid.md` with the 1672×941 source dimensions and measured rectangles for logo, nav row, h1, lede, CTA group, café seam, burger, latte, doodle route, heart, and skyline baseline. Store ratios as `x / 1672`, `y / 941`, `width / 1672`, `height / 941` so the CSS can scale them.

- [x] **Step 2: Add failing contract assertions**

Extend the hero test to require a `.hero-reference-frame`, `.hero-cafe-backdrop`, `.hero-doodle-layer`, and `.hero-skyline-layer`, all decorative layers marked `aria-hidden="true"`; require DOM copy and CTA names to remain exact and ensure the documentary fallback stays separate.

- [x] **Step 3: Run the focused test and confirm the expected failure**

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

- [x] **Step 1: Generate the café backdrop**

The first generated backdrop and cutouts were inspected, then replaced in the normal runtime path by a mechanically cropped, visually exact right-side panel from the supplied reference. The selected asset is `public/media/hero-reference-cafe-crop.png`; it contains no semantic DOM text and is provenance-labelled `decorative-reference`.

- [x] **Step 2: Generate and remove backgrounds from food cutouts**

Generated burger/bagel and latte cutouts were produced and background-removed for the asset pack (`public/media/hero-food-burger.png`, `hero-food-latte.png`). Visual comparison showed that the supplied reference crop was more faithful, so those generated layers are retained as provenance-labelled optional assets and are not requested by the default hero.

- [x] **Step 3: Generate the doodle and skyline layers**

The generated doodle/skyline experiments were compared with the supplied artwork. Exact alpha extraction from the reference was selected for runtime: `hero-doodles-exact.png` and `hero-skyline-exact.png`. The extracted layers contain no semantic text or logo.

- [x] **Step 4: Register provenance**

Add explicit `MediaProvenance` entries for every generated asset. Mark them `kind: 'decorative'`, `sourceLabel: 'Image Generation Skill'` (and `Remove Background Local` for cutouts), and state that they are synthetic art direction, not documentary venue evidence. Update `docs/visual-deviations.md` with the decision and source files.

### Task 3: Rebuild the hero layer stack with TDD

**Files:**
- Modify: `src/sections/HeroSection.tsx`
- Modify: `src/components/BrandMark.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/styles/tokens.css`
- Modify: `src/sections/SceneSections.test.tsx`
- Modify: `src/components/BrandMark.test.tsx`

- [x] **Step 1: Add the failing frame/layer markup contract**

Render the reference frame and exact reference-art layers in `HeroSection`, keep all decorative layers `alt="" aria-hidden="true"`, and make the documentary fallback request only after a reference-art load error. Keep the exact Russian copy in DOM.

- [x] **Step 2: Implement the canonical desktop grid**

Use the measured ratios from `docs/reference/white-cup-hero-grid.md` to position the logo, nav, copy, lede, CTA, doodle layer, café seam, reference crop, and skyline. Replace the darker paper token with the sampled near-white reference token and add a visible, low-contrast paper grain. Keep the CSS text as the source of truth; never duplicate baked text from an image.

- [x] **Step 3: Match seam, crop, and depth**

The source-derived panel already carries the photographed seam and food overlap, so the live layout uses it as one clipped decorative layer. The left paper field remains clean under copy/CTA, while documentary interior photography stays in a separate fallback node.

- [x] **Step 4: Implement mobile art direction**

At 390px/320px stack copy first and the café scene below, preserve 16/20px gutters, keep buttons full width, hide only non-essential doodles, and confirm the skyline/food layers do not clip text or introduce overflow.

- [x] **Step 5: Run focused tests**

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

- [x] **Step 1: Unify paper/background and scene transitions**

Apply the sampled near-white paper, grain, petrol/navy ink, orange accent, and soft scene boundaries consistently. Remove any remaining darker-beige or generic rounded-card treatment that conflicts with the supplied reference system.

- [x] **Step 2: Recheck content rhythm and anchors**

Keep menu, formats, events, community/reviews, contacts, and booking usable; preserve existing verified links and avoid inventing prices or venue facts. Adjust section spacing only where it restores the reference rhythm.

- [x] **Step 3: Preserve accessibility and reduced motion**

Retain heading hierarchy, named regions, focus rings, keyboard menu/carousel behavior, meaningful documentary alt text, and reduced-motion immediate visibility.

### Task 5: Browser comparison and quality gates

**Files:**
- Create/refresh: `docs/evidence/reference-reconstruction/hero-iab-1920-final.png`
- Create/refresh: `docs/evidence/reference-reconstruction/hero-iab-1536-final.png`
- Create/refresh: `docs/evidence/reference-reconstruction/hero-iab-390-final.png`
- Create/refresh: `docs/evidence/reference-reconstruction/hero-iab-320-final.png`
- Modify: `docs/verification.md`
- Modify: `docs/visual-deviations.md`

- [x] **Step 1: Run visual browser checks**

Use the Codex in-app Browser at fixed `127.0.0.1:4175`, capture the four viewports, compare current/reference side-by-side, and record DOM bounds plus `scrollWidth === clientWidth`.

- [x] **Step 2: Check reduced motion and console**

Emulate `prefers-reduced-motion: reduce`, assert visible copy and `transform: none`, and confirm zero page errors/warnings in a fresh browser session.

- [x] **Step 3: Run automated gates**

Run `npm test -- --run`, `npm run build`, and `git diff --check` after the final visual edits.

- [x] **Step 4: Request independent review**

Dispatch visual and provenance audits. The non-hero subagent review passed after the mobile anchor/word-wrap fixes; an Antigravity audit was attempted but its worker terminated before producing a result. Resolve every actionable P1/P2 before staging; do not claim “one-to-one” while a measured comparison still shows drift.

- [ ] **Step 5: Commit and publish**

Stage only intended source/assets/evidence/docs, commit `feat: reconstruct White Cup reference hero`, push `master` to `https://github.com/NNFall/whitecup.git`, verify remote SHA, and leave the fixed local server available.
