# White Cup Live Typography Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a reference-led White Cup landing whose visible headings are local web fonts, whose menu carousel visibly scrolls on desktop and mobile, and whose scene transitions/header remain coherent on every acceptance viewport.

**Architecture:** Remove title-image rendering from `HeroSection` and `SectionFrame`, leaving semantic headings as the only rendered title source. Add last-loaded CSS modules for live typography, carousel, mobile hero, and scene continuity. Keep photo and decoration provenance unchanged. Rebuild carousel scrolling around real card offsets rather than the almost-full-width desktop viewport.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, local WOFF2 fonts, CSS scroll-snap, Codex in-app Browser.

**Current status (27 August 2026):** Tasks 1–5 and Task 6 Steps 1–4 are
complete. The full gate is 25 test files/170 tests PASS, build PASS, and
`git diff --check` PASS; IAB proof covers the standard Hero viewports,
mobile-carousel next pass, and the low-height Menu/Events runways. Task 6 Step
5 remains pending until the current worktree is committed and pushed.

---

### Task 1: Establish runtime typography contracts

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/main.tsx`
- Create: `src/styles/live-typography.css`
- Create: `src/styles/LiveTypography.test.ts`
- Modify: `docs/font-licenses.md`

- [x] **Step 1: Write failing tests for the registered local display face and final import order**

```ts
expect(tokensCss).toMatch(/font-family:\s*'White Cup Display'/)
expect(mainSource).toMatch(/import '\.\/styles\/live-typography\.css'/)
expect(liveTypographyCss).toMatch(/\.hero-scene h1[\s\S]*font-family:\s*var\(--font-display\)/)
```

- [x] **Step 2: Run the focused test and verify it fails because the display face/module do not exist**

Run: `npm.cmd test -- --run src/styles/LiveTypography.test.ts`

Expected: FAIL mentioning the missing module or display-face declaration.

- [x] **Step 3: Add the local OFL display font and last-loaded typography module**

```css
@font-face {
  font-family: 'White Cup Display';
  src: url('/fonts/white-cup-display-cyrillic.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

:root {
  --font-display: 'White Cup Display', 'White Cup Hand', cursive;
}
```

Use a source-controlled OFL Cyrillic font file plus licence provenance; import `live-typography.css` after `global.css`.

- [x] **Step 4: Run the focused test and verify it passes**

Run: `npm.cmd test -- --run src/styles/LiveTypography.test.ts`

Expected: PASS.

### Task 2: Remove visible title-image runtime paths

**Files:**
- Modify: `src/components/SectionFrame.tsx`
- Delete: `src/components/ReferenceTitleLayer.tsx`
- Delete: `src/components/ReferenceTitleLayer.test.tsx`
- Modify: `src/sections/HeroSection.tsx`
- Modify: `src/sections/MenuSection.tsx`
- Modify: `src/sections/AboutSection.tsx`
- Modify: `src/sections/VisitSection.tsx`
- Modify: `src/sections/EventsSection.tsx`
- Modify: `src/sections/LocationsSection.tsx`
- Modify: `src/sections/EarlyScenesVisualContract.test.tsx`
- Modify: `src/sections/ReferenceTitleVisualContract.test.tsx`
- Create: `src/sections/LiveTitleRuntime.test.tsx`

- [x] **Step 1: Write failing DOM tests forbidding title-reference runtime rendering**

```tsx
render(<App />)
expect(document.querySelector('[data-conditional-layer*="title-reference"]')).toBeNull()
expect(document.querySelectorAll('.section-frame__title-reference')).toHaveLength(0)
expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(5)
```

- [x] **Step 2: Run the focused title-runtime tests and verify they fail**

Run: `npm.cmd test -- --run src/sections/LiveTitleRuntime.test.tsx src/sections/EarlyScenesVisualContract.test.tsx src/sections/ReferenceTitleVisualContract.test.tsx`

Expected: FAIL because the reference title pictures are mounted and the desktop CSS hides the semantic headings.

- [x] **Step 3: Remove title-reference props/imports and convert the Hero underline to DOM/CSS decoration**

```tsx
<h1 id="hero-title">
  <span className="hero-scene__title-line hero-scene__title-line--first">Завтраки,</span>
  <span className="hero-scene__title-line hero-scene__title-line--second"><span className="hero-scene__accent">кофе</span> и свой</span>
  <span className="hero-scene__title-line hero-scene__title-line--third">вайб в <em>White Cup</em></span>
</h1>
```

Delete only the title-image component/test and live JSX imports. Do not delete provenance data or photo/food/logo/doodle assets.

- [x] **Step 4: Run the focused title-runtime tests and verify they pass**

Run: `npm.cmd test -- --run src/sections/LiveTitleRuntime.test.tsx src/sections/EarlyScenesVisualContract.test.tsx src/sections/ReferenceTitleVisualContract.test.tsx`

Expected: PASS.

### Task 3: Build responsive live-title layout

**Files:**
- Modify: `src/styles/live-typography.css`
- Modify: `src/styles/LiveTypography.test.ts`
- Modify: `src/sections/MenuVisualContract.test.tsx`

- [x] **Step 1: Write failing CSS-contract tests for visible heading flow**

```ts
expect(liveTypographyCss).toMatch(/@media \(min-width: 1024px\)[\s\S]*\.menu-scene .section-frame__heading h2[\s\S]*opacity:\s*1/)
expect(liveTypographyCss).toMatch(/\.about-scene__title-line--brand[\s\S]*font-family:\s*var\(--font-script\)/)
expect(liveTypographyCss).not.toMatch(/title-reference/)
```

- [x] **Step 2: Run focused style tests and verify they fail**

Run: `npm.cmd test -- --run src/styles/LiveTypography.test.ts src/sections/MenuVisualContract.test.tsx`

Expected: FAIL until the live typography rules exist.

- [x] **Step 3: Implement scene-specific type scales and normal-flow safeguards**

```css
.hero-scene h1 { font-family: var(--font-display); font-size: clamp(3.6rem, 5.65vw, 7rem); line-height: .86; }
.menu-scene .section-frame__heading h2 { opacity: 1; font-size: clamp(3.2rem, 4.35vw, 5.25rem); }
.about-scene .section-frame__heading h2 { opacity: 1; font-size: clamp(3.05rem, 4.1vw, 5rem); }
@media (max-width: 1023px) { .scene .section-frame__heading h2 { text-wrap: balance; transform: none; } }
```

Keep title line ownership in each scene; use CSS variables and explicit grid/absolute bounds only where measured Browser geometry proves them safe.

- [x] **Step 4: Run focused style tests and verify they pass**

Run: `npm.cmd test -- --run src/styles/LiveTypography.test.ts src/sections/MenuVisualContract.test.tsx`

Expected: PASS.

### Task 4: Make menu movement visibly useful

**Files:**
- Modify: `src/components/MenuCarousel.tsx`
- Modify: `src/components/MenuCarousel.test.tsx`
- Create: `src/styles/menu-carousel-polish.css`
- Modify: `src/main.tsx`

- [x] **Step 1: Write failing carousel tests for real next-card offset**

```tsx
Object.defineProperty(viewport, 'clientWidth', { value: 960 })
Object.defineProperty(card, 'offsetLeft', { value: 640 })
fireEvent.click(screen.getByRole('button', { name: 'Следующая позиция' }))
expect(viewport.scrollTo).toHaveBeenCalledWith(expect.objectContaining({ left: 640 }))
```

- [x] **Step 2: Run focused carousel tests and verify they fail**

Run: `npm.cmd test -- --run src/components/MenuCarousel.test.tsx`

Expected: FAIL because `scrollIntoView()` only consumes the 66px desktop overflow range.

- [x] **Step 3: Implement card-offset scrolling and desktop track geometry**

```ts
const targetLeft = Math.max(0, card.offsetLeft - viewport.offsetLeft)
viewport.scrollTo({ left: targetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
```

```css
@media (min-width: 1024px) {
  .menu-scene .menu-carousel__viewport { width: min(100% - 8vw, 104rem); margin-inline: auto; }
  .menu-scene .menu-carousel__track { grid-auto-columns: clamp(18rem, 28vw, 32rem); }
}
```

Keep native overflow, keyboard arrows, dots, reduced-motion behavior and 44px touch targets. The visual track must have enough content to scroll at least one full card on 1920px.

- [x] **Step 4: Run focused carousel tests and verify they pass**

Run: `npm.cmd test -- --run src/components/MenuCarousel.test.tsx`

Expected: PASS.

### Task 5: Polish header and inter-scene continuity

**Files:**
- Modify: `src/components/StickyNav.tsx` only if semantics/state needs correction
- Modify: `src/styles/scene-continuity-polish.css`
- Modify: `src/components/SceneBridge.test.tsx`
- Create: `src/styles/SceneContinuityPolish.test.ts`
- Modify: `src/styles/StyleLayerImports.test.ts`

- [x] **Step 1: Write failing tests for a single persistent header profile and inert bridges**

```ts
expect(continuityCss).toMatch(/\.site-nav__desktop-shell:is\(\[data-nav-profile='reference'\], \[data-nav-profile='compact'\]\)/)
expect(continuityCss).toMatch(/\.scene-bridge[\s\S]*pointer-events:\s*none/)
```

- [x] **Step 2: Run focused continuity tests and verify they fail**

Run: `npm.cmd test -- --run src/components/SceneBridge.test.tsx src/styles/SceneContinuityPolish.test.ts`

Expected: FAIL until the new final CSS contract exists.

- [x] **Step 3: Implement restrained header and bridge polish**

```css
.site-nav__desktop-shell:is([data-nav-profile='reference'], [data-nav-profile='compact']) { width: min(calc(100% - 2.5rem), 78rem); }
.scene-bridge { pointer-events: none; overflow: clip; }
@media (prefers-reduced-motion: reduce) { .site-nav, .scene-bridge, .scene-bridge * { transition: none !important; } }
```

Do not add content sections. Keep active-link state, mobile dialog/focus trap and external links unchanged.

- [x] **Step 4: Run focused continuity tests and verify they pass**

Run: `npm.cmd test -- --run src/components/SceneBridge.test.tsx src/styles/SceneContinuityPolish.test.ts`

Expected: PASS.

### Task 6: Acceptance matrix, documentation and release

**Files:**
- Modify: `docs/visual-deviations.md`
- Modify: `docs/verification.md`
- Use only existing supporting frames under `docs/evidence/layered-reconstruction/`; no separate live-typography evidence folder was added.

- [x] **Step 1: Run the complete automated gate**

Run: `npm.cmd test -- --run --pool=threads --maxWorkers=1`

Expected: every test passes.

- [x] **Step 2: Build production assets**

Run: `npm.cmd run build`

Expected: TypeScript and Vite pass.

- [x] **Step 3: Verify only in the Codex in-app Browser**

Current IAB proof covers Hero at `1920x1080`, `1536x864`, `390x844`, and `320x568`, the mobile carousel next-card action, and low-height runways at `1920x800`, `1920x720`, `1536x720`, and `1440x568`; no title/intro/card overlap or clipping was observed after the Menu/Events runway updates.

- [x] **Step 4: Update provenance/deviation documentation**

Record that former text extracts are retained as authoring evidence only; record the installed OFL display font source/licence and intentional visual deviations in the current documentation updates.

- [x] **Step 5: Review, stage exact paths, commit and push** — commit
  `1f87141bacd002300ff8a0576c168f0c56dd62f7` is pushed to `origin/master` and
  matches the remote SHA. The local server remains at
  `http://127.0.0.1:4175/` (no separate hosting provider is configured).

Run: `git diff --check`, inspect `git diff --cached --name-status`, create a commit with current local author/committer timestamps, `git push origin master`, and verify `git ls-remote origin refs/heads/master` equals `git rev-parse HEAD`.
