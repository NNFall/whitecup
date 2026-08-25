# White Cup First Screen Implementation Plan

> Historical planning record. Any early generated public experiment named below was removed before publication; see `docs/reference/white-cup-asset-provenance.md` for active runtime media.

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox syntax.

**Goal:** Recompose the White Cup hero so the supplied `3679ac8b-1f0d-40be-b73d-d5246178ba35.png` first screen is recognisable to pixel-level visual review while keeping semantic text, accessible CTAs, and a robust mobile layout.

**Architecture:** Keep the existing React scene and data layer. Make the first viewport a dedicated reference composition: a transparent overlay navigation with a generated badge-style logo, left-aligned editorial copy and CTAs, a generated decorative clean panel (explicitly marked synthetic) with a documentary fallback, and a generated skyline layer. Use CSS art direction at desktop and a single-column mobile composition without horizontal overflow.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, native CSS/SVG, local PNG/WebP assets.

---

### Task 1: Lock the hero contract with TDD

**Files:**
- Modify: `src/sections/SceneSections.test.tsx`
- Modify: `src/components/BrandMark.test.tsx`

- [x] **Step 1: Add failing assertions**

Assert that the hero exposes the reference copy and structure: `Завтраки`, orange `кофе`, `White Cup`, `Посмотреть меню`, `Выбрать локацию`, the badge logo image role, and a decorative hero-art layer marked `aria-hidden`.

- [x] **Step 2: Run the focused test and observe the expected failure**

Run `npm test -- --run src/sections/SceneSections.test.tsx src/components/BrandMark.test.tsx`. The new assertions must fail because the current hero still renders the old kicker/copy and no reference-art layer.

### Task 2: Implement the reference hero and navigation treatment

**Files:**
- Modify: `src/sections/HeroSection.tsx`
- Modify: `src/components/BrandMark.tsx`
- Modify: `src/components/StickyNav.tsx`
- Modify: `src/data/media.ts`
- Modify: `src/styles/global.css`
- Create: `public/media/hero-clean-panel.png`, `public/media/hero-logo-badge.png`, `public/media/hero-skyline-line.png`, `public/media/hero-food-cutout.png`

- [x] **Step 1: Add provenance-labelled decorative assets without shipping the baked-text reference PNG**

Use the supplied PNG only as local art direction. Generate a clean panel without baked text/UI, a badge logo, a skyline and a conditional food cutout fallback. Keep documentary Yandex photos separate and provide the existing interior photo as the normal fallback if the clean panel cannot load.

- [x] **Step 2: Add the minimal semantic hero markup**

Use three headline lines, a body paragraph, two real anchors, a generated badge PNG, the clean decorative panel, and the generated skyline. Keep all visual-only artwork `aria-hidden`, mark the panel `data-media-kind="decorative-generated"`, and retain meaningful text in DOM.

- [x] **Step 3: Match the reference at 1920×1080**

Overlay the desktop nav on the paper hero, size the badge/logo to the reference scale, set the hand-lettered type hierarchy, orange accent word and underline, 275/255px CTA proportions, irregular right art cut, paper grain, dotted path/doodles, and bottom Samara line-art skyline. Make the nav transition to a paper surface after scrolling without changing anchors.

- [x] **Step 4: Preserve mobile usability**

At `390px` and `320px`, keep the menu toggle and nav readable, stack copy and CTAs, turn the art into a bounded wide card, reduce decorative layers, and assert no horizontal overflow.

### Task 3: Verify and release the hero refinement

**Files:**
- Modify: `docs/visual-deviations.md`
- Modify: `docs/verification.md`
- Create/refresh: `docs/evidence/refinement/hero-1920-skyline.png`, `docs/evidence/refinement/hero-1536-skyline.png`, `docs/evidence/refinement/hero-390-skyline.png`, `docs/evidence/refinement/hero-320-skyline.png`

- [x] **Step 1: Run focused and full tests**

Run the focused hero tests, then `npm test -- --run`; expected: all tests pass.

- [x] **Step 2: Run production checks**

Run `npm run build` and `git diff --check`.

- [x] **Step 3: Browser-check the target viewports**

Use the fixed server at `127.0.0.1:4175`, inspect 1920×1080, 390×844 and 320×568, save evidence screenshots, and verify hero bounds, CTA targets, focus rings, reduced motion, and `scrollWidth <= clientWidth`.

- [x] **Step 4: Document the visual departure**

Record that the supplied first-screen reference crop is decorative art direction, while documentary Yandex interiors remain provenance-labelled and the semantic copy remains real DOM content.

- [x] **Step 5: Commit the verified refinement**

Commit with `feat: match White Cup first screen reference` after the browser and automated gates pass.

**Verification note:** The final pass also checks 1536×864 as the 125% desktop-equivalent requested by the brief, plus reduced motion and zero console errors. Generated hero assets remain explicitly decorative; documentary Yandex interiors remain provenance-labelled fallbacks/scene photos.
