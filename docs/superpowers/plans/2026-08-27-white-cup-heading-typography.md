# White Cup Heading Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current uniform heading treatment with responsive, live Neucha/White Cup Hand phrase layers that echo the supplied White Cup typography without raster title images or overlap.

**Architecture:** Keep semantic `h1`/`h2` markup in each scene and make every meaningful phrase an explicit span. Keep the already licensed local Neucha subset as the display face (the closest verified match to the supplied Cyrillic crop), keep the Marck Script subset for brand/script words, and put the final scene-specific geometry in a last-loaded CSS module. Existing photos, bridges, navigation, carousel, and provenance rules stay unchanged.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, local WOFF2 fonts, Codex In-app Browser.

---

### Task 1: Confirm the selected font and provenance

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/live-typography.css`
- Modify: `src/styles/Typography.test.ts`
- Modify: `src/styles/LiveTypography.test.ts`
- Modify: `docs/font-licenses.md`

- [x] **Step 1: Write the failing font provenance contract**

Assert the display face remains `/fonts/white-cup-display-cyrillic.woff2`, keeps
`font-display: swap`, and is documented as the verified local Neucha match.
Keep the existing `White Cup Hand` and Golos assertions and add Pangolin as an
explicit non-runtime comparison candidate.

- [x] **Step 2: Run the focused test and verify RED**

Run:

```powershell
npm.cmd test -- --run src/styles/Typography.test.ts src/styles/LiveTypography.test.ts
```

Expected: the provenance assertion fails until the documentation/test records
the selected Neucha face and comparison decision.

- [x] **Step 3: Implement the minimal font decision**

Keep the existing registered asset and make the decision explicit:

```css
@font-face {
  font-family: 'White Cup Display';
  src: url('/fonts/white-cup-display-cyrillic.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

:root {
  --font-display: 'White Cup Display', 'White Cup Body', cursive;
}
```

Update attribution text to state that White Cup Display is the local Neucha
subset, with a short note that Pangolin was compared but rejected for the
reference because its Cyrillic is wider/playful. Do not add a second runtime
font request.

- [x] **Step 4: Run the focused test and verify GREEN**

Run the same command. Expected: all focused typography tests pass.

- [x] **Step 5: Fold into the final release commit**

The font decision is included in the final release commit together with the
scene spans and evidence; no intermediate task commit is claimed.

### Task 2: Split scene headings into explicit live text layers

**Files:**
- Modify: `src/sections/HeroSection.tsx`
- Modify: `src/sections/MenuSection.tsx`
- Modify: `src/sections/AboutSection.tsx`
- Modify: `src/sections/VisitSection.tsx`
- Modify: `src/sections/EventsSection.tsx`
- Modify: `src/sections/LocationsSection.tsx`
- Modify: `src/sections/LiveTitleRuntime.test.tsx`
- Modify: `src/sections/EarlyScenesVisualContract.test.tsx`

- [x] **Step 1: Write failing DOM contracts**

Add assertions for the phrase-level classes:

```tsx
expect(hero.querySelector('.hero-scene__word--coffee')).toHaveTextContent('кофе')
expect(hero.querySelector('.hero-scene__brand')).toHaveTextContent('White Cup')
expect(menu.querySelector('.menu-scene__word--look')).toHaveTextContent('заглянуть')
expect(about.querySelector('.about-scene__word--return')).toHaveTextContent('возвращаться')
```

Keep one accessible name per heading and ensure no `title-reference` nodes are
introduced.

- [x] **Step 2: Run the focused DOM tests and verify RED**

```powershell
npm.cmd test -- --run src/sections/LiveTitleRuntime.test.tsx src/sections/EarlyScenesVisualContract.test.tsx
```

Expected: failures identify the missing phrase-level classes.

- [x] **Step 3: Add only the explicit spans**

Use semantic spans, for example:

```tsx
<span className="hero-scene__title-line hero-scene__title-line--second">
  <span className="hero-scene__word hero-scene__word--coffee hero-scene__accent">кофе</span>{' '}
  <span className="hero-scene__word hero-scene__word--own">и свой</span>
</span>
<span className="hero-scene__title-line hero-scene__title-line--third">
  <span className="hero-scene__word hero-scene__word--vibe">вайб в</span>{' '}
  <em className="hero-scene__brand">White Cup</em>
</span>
```

Apply the equivalent explicit phrase classes to Menu, About, Visit, Events and
Locations. Do not add images, duplicate headings, or aria-hidden text.

- [x] **Step 4: Run the focused DOM tests and verify GREEN**

Expected: all heading span/name tests pass.

- [x] **Step 5: Fold into the final release commit**

The semantic phrase spans are included in the final release commit together
with the typography and evidence; no intermediate task commit is claimed.

### Task 3: Tune reference typography geometry responsively

**Files:**
- Modify: `src/styles/live-typography.css`
- Modify: `src/styles/LiveTypography.test.ts`
- Modify: `src/styles/DesktopContinuity.test.ts`
- Modify: `src/sections/AboutSceneVisualContract.test.tsx`
- Modify: `src/sections/MenuVisualContract.test.tsx`

- [x] **Step 1: Write failing geometry contracts**

Assert the final stylesheet includes White Cup Display for live headings,
White Cup Hand for brand/script spans, small bounded transforms on desktop, and an
explicit mobile reset:

```ts
expect(liveTypographyCss).toMatch(/\.hero-scene__brand[^{]*\{[^}]*font-family:\s*var\(--font-script\)/s)
expect(liveTypographyCss).toMatch(/\.hero-scene__word--coffee[^{]*\{[^}]*transform:\s*rotate\(-?0\.\d+deg\)/s)
expect(liveTypographyCss).toMatch(/@media \(max-width:\s*1023px\)[\s\S]*?\.hero-scene__word--coffee[^{]*\{[^}]*transform:\s*none;/s)
```

Add scene-specific assertions for Menu/About/Visit/Events/Locations accent
and brand spans, with no transform beyond `1.8deg`.

- [x] **Step 2: Run focused style tests and verify RED**

```powershell
npm.cmd test -- --run src/styles/LiveTypography.test.ts src/styles/DesktopContinuity.test.ts src/sections/AboutSceneVisualContract.test.tsx src/sections/MenuVisualContract.test.tsx
```

Expected: new selectors/geometry assertions fail before implementation.

- [x] **Step 3: Implement bounded, scene-specific CSS**

Use the final module after legacy CSS. The desktop rules should follow this
pattern:

```css
.hero-scene__brand,
.about-scene__title-line--brand {
  font-family: var(--font-script);
  font-style: normal;
  letter-spacing: -0.025em;
}

@media (min-width: 1024px) {
  .hero-scene__word--coffee { display: inline-block; transform: rotate(-0.7deg) translateY(-0.02em); }
  .hero-scene__brand { display: inline-block; transform: rotate(-1.4deg) translateY(0.03em); }
  .menu-scene__word--look,
  .about-scene__word--want,
  .events-scene__word--warm,
  .locations-scene__word--find { display: inline-block; transform: rotate(-0.8deg); }
}

@media (max-width: 1023px) {
  .hero-scene__word--coffee,
  .hero-scene__brand,
  .menu-scene__word--look,
  .about-scene__word--want,
  .events-scene__word--warm,
  .locations-scene__word--find { transform: none; }
}
```

Keep line widths and scene-specific `clamp()` sizes within current measured
runways; do not use absolute positioning for phrase spans. Underline belongs
visually to its phrase; the hero uses a flow-sized sibling hook to preserve the
reference stroke while menu/about accent selectors use their own pseudo-element.
Decorative underline hooks remain `aria-hidden`.

- [x] **Step 4: Run focused style tests and verify GREEN**

Expected: all style contracts pass.

- [x] **Step 5: Fold into the final release commit**

```powershell
The geometry changes are included in the final release commit together with
the scene spans and evidence; no intermediate task commit is claimed.
```

### Task 4: Browser comparison, docs and release

**Files:**
- Create: `docs/evidence/headings-after-hero-1920x1080.png`
- Create: `docs/evidence/headings-after-menu-1920x1080.png`
- Create: `docs/evidence/headings-after-about-1920x1080.png`
- Create: `docs/evidence/headings-after-hero-390x844.png`
- Modify: `docs/visual-deviations.md`
- Modify: `docs/verification.md`

- [x] **Step 1: Run full automated verification**

```powershell
npm.cmd test -- --run
npm.cmd run build -- --base=/site/whitecup/
git diff --check
```

Expected: all tests/build/diff checks pass.

- [x] **Step 2: Capture after screenshots only in Codex In-app Browser**

Capture hero/menu/about at 1920×1080 and hero at 390×844. Repeat quick
geometry checks at 1536×864 and 320×568: one heading name, no overlap, no
horizontal overflow, mobile transform reset.

- [x] **Step 3: Update release evidence**

Document the baseline/after frame names, the Neucha and Marck Script
source/licenses, the Pangolin comparison decision, and exact browser viewport
results. Do not describe any title image as runtime. The current evidence is
listed in `docs/verification.md` and the before/after frame directories.

- [x] **Step 4: Request independent code/visual review**

Dispatch a read-only spec reviewer and a read-only code-quality reviewer. Fix
only confirmed issues, rerun tests, and keep the existing baseline files.

- [x] **Step 5: Stage exact files, commit and push**

```powershell
git status --short
git diff --check
git add src docs/superpowers/specs/2026-08-27-white-cup-heading-typography-design.md docs/superpowers/plans/2026-08-27-white-cup-heading-typography.md docs/font-licenses.md docs/visual-deviations.md docs/verification.md
git commit -m "style: refine White Cup live heading typography"
git push origin master
git ls-remote origin refs/heads/master
```

Before push, refresh local `AuthorDate` and `CommitDate` for the outgoing task
commit and verify them with `git show -s --format=fuller HEAD`. Never stage the
older untracked evidence/reference collection with a wildcard.
