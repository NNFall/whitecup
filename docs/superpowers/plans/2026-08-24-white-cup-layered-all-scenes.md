# White Cup Layered All-Scenes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct all six supplied White Cup screens as independently layered, reference-faithful, responsive React scenes and publish the verified result.

**Architecture:** Each scene combines code-native paper/content with independently cropped backdrops, transparent foreground objects and decorative overlays. Normalized scene-local coordinates and breakpoint-specific art direction replace stretched complete-screen rasters while media provenance keeps supplied-reference art, generated art and documentary photography distinct.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS custom properties, built-in ImageGen editing, Remove Background Local, Codex in-app Browser.

---

### Task 1: Lock the layered media contract with TDD

**Files:**
- Modify: `src/data/media.ts`
- Modify: `src/data/site.test.ts`
- Modify: `src/sections/SceneSections.test.tsx`
- Create: `src/components/SceneLayer.tsx`
- Create: `src/components/SceneLayer.test.tsx`

- [ ] **Step 1: Write failing provenance and layer tests**

```tsx
expect(hero.querySelector('[data-layer="backdrop"]')).toHaveAttribute('data-media-kind', 'decorative-reference-edit')
expect(hero.querySelectorAll('[data-layer="foreground"]')).toHaveLength(2)
expect(document.querySelector('[src*="3679ac8b"]')).not.toBeInTheDocument()
expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Завтраки')
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run: `npm.cmd test -- --run src/components/SceneLayer.test.tsx src/sections/SceneSections.test.tsx src/data/site.test.ts`

Expected: failures for the missing `SceneLayer` component and new media kinds.

- [ ] **Step 3: Add the typed layer component and media kinds**

```tsx
type SceneLayerProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  layer: 'backdrop' | 'foreground' | 'decoration'
  mediaKind: 'decorative-reference-edit' | 'decorative-reference-extract' | 'decorative-generated'
}

export function SceneLayer({ layer, mediaKind, alt = '', ...props }: SceneLayerProps) {
  return <img {...props} alt={alt} aria-hidden="true" data-layer={layer} data-media-kind={mediaKind} />
}
```

- [ ] **Step 4: Run the focused tests and confirm GREEN**

Run: `npm.cmd test -- --run src/components/SceneLayer.test.tsx src/sections/SceneSections.test.tsx src/data/site.test.ts`

Expected: all selected tests pass.

- [ ] **Step 5: Commit the contract**

Run: `git add src/components/SceneLayer.tsx src/components/SceneLayer.test.tsx src/data/media.ts src/data/site.test.ts src/sections/SceneSections.test.tsx && git commit -m "test: define layered scene media contract"`

### Task 2: Replace the hero crop with independent layers

**Files:**
- Modify: `src/sections/HeroSection.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/data/media.ts`
- Modify: `src/sections/SceneSections.test.tsx`
- Use: `public/media/hero-clean-base-edit-poc.png`
- Use: `public/media/hero-bagel-cutout-poc.png`
- Use: `public/media/hero-coffee-cutout-poc.png`

- [ ] **Step 1: Extend the hero test to require clean backdrop, two foreground layers, exact logo, doodles and skyline**

```tsx
expect(hero.querySelector('.hero-backdrop')).toHaveAttribute('src', '/media/hero-clean-base-edit-poc.png')
expect(hero.querySelector('.hero-bagel')).toHaveAttribute('src', '/media/hero-bagel-cutout-poc.png')
expect(hero.querySelector('.hero-coffee')).toHaveAttribute('src', '/media/hero-coffee-cutout-poc.png')
expect(hero.querySelector('.hero-logo')).toHaveAttribute('src', '/media/hero-logo-reference.png')
```

- [ ] **Step 2: Run the hero test and confirm RED**

Run: `npm.cmd test -- --run src/sections/SceneSections.test.tsx`

Expected: missing clean backdrop and foreground layers.

- [ ] **Step 3: Render independent `SceneLayer` nodes and remove `object-fit: fill` from hero photography**

```tsx
<SceneLayer className="hero-backdrop" layer="backdrop" mediaKind="decorative-reference-edit" src={heroCleanBase.src} />
<SceneLayer className="hero-bagel" layer="foreground" mediaKind="decorative-reference-edit" src={heroBagel.src} />
<SceneLayer className="hero-coffee" layer="foreground" mediaKind="decorative-reference-edit" src={heroCoffee.src} />
```

Use `object-fit: cover` for `.hero-backdrop`; use scene-local percentage coordinates and intrinsic aspect ratios for `.hero-bagel` and `.hero-coffee`.

- [ ] **Step 4: Add independent 1920, 1536, 390 and 320 coordinate sets**

Desktop coordinates reproduce the supplied 1672×941 reference. Mid-desktop changes crop/foreground offsets without scaling `.hero-reference-frame`. Mobile stacks content and visual media and hides only nonessential doodles.

- [ ] **Step 5: Run hero tests and build**

Run: `npm.cmd test -- --run src/sections/SceneSections.test.tsx && npm.cmd run build`

Expected: tests and production build pass.

- [ ] **Step 6: Commit the hero reconstruction**

Run: `git add src/sections/HeroSection.tsx src/styles/global.css src/data/media.ts src/sections/SceneSections.test.tsx public/media/hero-clean-base-edit-poc.png public/media/hero-bagel-cutout-poc.png public/media/hero-coffee-cutout-poc.png && git commit -m "feat: decompose hero into responsive visual layers"`

### Task 3: Reconstruct the menu scene

**Files:**
- Modify: `src/sections/MenuSection.tsx`
- Modify: `src/components/MenuCarousel.tsx`
- Modify: `src/components/MenuCarousel.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/data/media.ts`
- Create: `public/media/menu-window-sketch.png`
- Create: `public/media/menu-item-01.png` through `public/media/menu-item-05.png`

- [ ] **Step 1: Generate/edit the reference-backed window illustration and five distinct food-card images**

Use one built-in ImageGen call per asset. Save every selected output in `public/media`; label food images `decorative-reference-edit`, not documentary.

- [ ] **Step 2: Write a failing carousel test for five photo cards, arrows, dots and final-card reachability**

```tsx
expect(screen.getAllByRole('img', { name: '' })).toHaveLength(5)
expect(screen.getByRole('button', { name: 'Следующая позиция' })).toBeEnabled()
await user.click(screen.getByRole('button', { name: 'Позиция 5' }))
expect(screen.getByRole('button', { name: 'Позиция 5' })).toHaveAttribute('aria-current', 'true')
```

- [ ] **Step 3: Run the test and confirm RED**

Run: `npm.cmd test -- --run src/components/MenuCarousel.test.tsx`

- [ ] **Step 4: Implement the reference composition and preserve keyboard scrolling**

Match the supplied headline, intro, upper-right sketch, photo card proportions, arrows, dots, note and bottom skyline. Keep native horizontal scroll-snap and arrow-key behavior.

- [ ] **Step 5: Run tests/build and commit**

Run: `npm.cmd test -- --run src/components/MenuCarousel.test.tsx src/sections/SceneSections.test.tsx && npm.cmd run build`

Run: `git add src/sections/MenuSection.tsx src/components/MenuCarousel.tsx src/components/MenuCarousel.test.tsx src/styles/global.css src/data/media.ts public/media/menu-*.png && git commit -m "feat: reconstruct reference menu scene"`

### Task 4: Reconstruct the About scene

**Files:**
- Modify: `src/sections/AboutSection.tsx`
- Modify: `src/sections/SceneSections.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/data/media.ts`
- Create: `public/media/about-clean-base.png`
- Create: `public/media/about-pastry-cutout.png`
- Create: `public/media/about-coffee-cutout.png`
- Create: `public/media/about-benefits-art.png`

- [ ] **Step 1: Edit the About reference into a clean interior base, pastry/cup foregrounds and benefit illustration pack**

Preserve the reference seam and interior composition; remove all semantic text before saving the base.

- [ ] **Step 2: Add failing tests for two paragraphs, four benefits and independent visual layers**

```tsx
expect(within(about).getAllByRole('listitem')).toHaveLength(4)
expect(about.querySelector('[data-layer="backdrop"]')).toBeInTheDocument()
expect(about.querySelectorAll('[data-layer="foreground"]')).toHaveLength(2)
```

- [ ] **Step 3: Run RED, implement the measured desktop/mobile grids, and run GREEN**

Run: `npm.cmd test -- --run src/sections/SceneSections.test.tsx`

Expected before implementation: new assertions fail. Expected afterward: pass.

- [ ] **Step 4: Commit the About scene**

Run: `git add src/sections/AboutSection.tsx src/sections/SceneSections.test.tsx src/styles/global.css src/data/media.ts public/media/about-*.png && git commit -m "feat: reconstruct reference about scene"`

### Task 5: Reconstruct Visit formats

**Files:**
- Modify: `src/sections/VisitSection.tsx`
- Modify: `src/sections/SceneSections.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/data/media.ts`
- Create: `public/media/visit-window-sketch.png`
- Create: `public/media/visit-card-morning.png`
- Create: `public/media/visit-card-meeting.png`
- Create: `public/media/visit-card-pause.png`

- [ ] **Step 1: Produce the upper-right sketch and three card images from the supplied reference**

Each card image is a separate asset with its own crop. Do not bake headings or body copy into the image.

- [ ] **Step 2: Write a failing test for three semantic scenario articles and their images**

```tsx
expect(within(visit).getAllByRole('article')).toHaveLength(3)
expect(visit.querySelectorAll('[data-scene-card-image]')).toHaveLength(3)
```

- [ ] **Step 3: Run RED, implement the three-card composition and run GREEN**

Run: `npm.cmd test -- --run src/sections/SceneSections.test.tsx`

- [ ] **Step 4: Commit the Visit scene**

Run: `git add src/sections/VisitSection.tsx src/sections/SceneSections.test.tsx src/styles/global.css src/data/media.ts public/media/visit-*.png && git commit -m "feat: reconstruct reference visit scene"`

### Task 6: Reconstruct Events

**Files:**
- Modify: `src/sections/EventsSection.tsx`
- Modify: `src/sections/SceneSections.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/data/media.ts`
- Create: `public/media/events-clean-base.png`
- Create: `public/media/events-cake-cutout.png`
- Create: `public/media/events-coffee-cutout.png`
- Create: `public/media/events-card-01.png` through `public/media/events-card-03.png`

- [ ] **Step 1: Edit the Events reference into clean background, cake/cup foregrounds and three independent card images**

Keep people/background reference art decorative. Preserve event names and descriptions as DOM text.

- [ ] **Step 2: Write a failing test for three event articles and independent right-side layers**

```tsx
expect(within(events).getAllByRole('article')).toHaveLength(3)
expect(events.querySelector('[data-layer="backdrop"]')).toBeInTheDocument()
expect(events.querySelectorAll('[data-layer="foreground"]')).toHaveLength(2)
```

- [ ] **Step 3: Run RED, implement, run GREEN and commit**

Run: `npm.cmd test -- --run src/sections/SceneSections.test.tsx && npm.cmd run build`

Run: `git add src/sections/EventsSection.tsx src/sections/SceneSections.test.tsx src/styles/global.css src/data/media.ts public/media/events-*.png && git commit -m "feat: reconstruct reference events scene"`

### Task 7: Reconstruct Locations

**Files:**
- Modify: `src/sections/LocationsSection.tsx`
- Modify: `src/components/StaticMapCard.tsx`
- Modify: `src/sections/SceneSections.test.tsx`
- Modify: `src/styles/global.css`
- Modify: `src/data/media.ts`
- Create: `public/media/locations-map-reference.png`
- Create: `public/media/locations-interior-base.png`

- [ ] **Step 1: Extract the decorative reference map and edit the lower-right interior without baked semantic addresses**

Keep map labels decorative; the two actual addresses and route/contact actions must be DOM content.

- [ ] **Step 2: Write failing tests for two address cards, route/contact links and map provenance**

```tsx
expect(within(locations).getAllByRole('article')).toHaveLength(2)
expect(within(locations).getAllByRole('link', { name: /построить маршрут/i })).toHaveLength(2)
expect(locations.querySelector('[data-map-kind="decorative-reference-extract"]')).toBeInTheDocument()
```

- [ ] **Step 3: Run RED, implement the reference map/photo/card layout and run GREEN**

Run: `npm.cmd test -- --run src/sections/SceneSections.test.tsx`

- [ ] **Step 4: Commit the Locations scene**

Run: `git add src/sections/LocationsSection.tsx src/components/StaticMapCard.tsx src/sections/SceneSections.test.tsx src/styles/global.css src/data/media.ts public/media/locations-*.png && git commit -m "feat: reconstruct reference locations scene"`

### Task 8: Match typography, navigation and shared responsive rhythm

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`
- Modify: `src/components/StickyNav.tsx`
- Modify: `src/components/StickyNav.test.tsx`
- Create: `public/fonts/*`

- [ ] **Step 1: Add project-local font files with their license/source record and `@font-face` declarations**

Load only fonts whose redistribution terms permit bundling. Preserve system fallbacks.

- [ ] **Step 2: Write failing assertions for reference nav labels and accessible mobile behavior**

```tsx
expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBeInTheDocument()
expect(screen.getByRole('button', { name: 'Открыть меню' })).toHaveAttribute('aria-expanded', 'false')
```

- [ ] **Step 3: Match reference display/script/body roles and button emphasis**

Use role-specific font weights, tracking and line heights. Preserve visible focus rings and minimum 44px targets.

- [ ] **Step 4: Run nav/full tests and commit**

Run: `npm.cmd test -- --run src/components/StickyNav.test.tsx src/sections/SceneSections.test.tsx && npm.cmd run build`

Run: `git add src/styles/tokens.css src/styles/global.css src/components/StickyNav.tsx src/components/StickyNav.test.tsx public/fonts && git commit -m "feat: align reference typography and navigation"`

### Task 9: In-app Browser visual convergence

**Files:**
- Modify: scene/component/CSS files identified by visual comparison
- Create: `docs/evidence/layered-reconstruction/*.png`
- Modify: `docs/verification.md`

- [ ] **Step 1: Run the fixed local server**

Run: `npm.cmd run dev -- --host 127.0.0.1 --port 4175`

Expected: `http://127.0.0.1:4175/` returns HTTP 200.

- [ ] **Step 2: Capture every scene at 1920×1080 in the Codex in-app Browser**

Compare each current scene to its supplied 1672×941 reference. Record measured x/y/width/height differences for heading block, photo region, cards, CTA, decorative seam and skyline.

- [ ] **Step 3: Repeat at 1536×864, 390×844 and 320×568**

Confirm `scrollWidth <= clientWidth`, no clipped CTA, readable card content, reachable carousel end and correct art-directed crops.

- [ ] **Step 4: Iterate until no P0/P1 visual discrepancy remains**

After every CSS/asset adjustment, recapture the affected scene at desktop and mobile; save final evidence with stable names.

- [ ] **Step 5: Commit visual evidence and refinements**

Run: `git add src docs/evidence/layered-reconstruction docs/verification.md && git commit -m "fix: converge all scenes on supplied references"`

### Task 10: Independent review, release verification and publication

**Files:**
- Modify: `docs/visual-deviations.md`
- Modify: `docs/reference/white-cup-asset-provenance.md`
- Modify: `README.md`

- [ ] **Step 1: Dispatch independent visual, accessibility and code reviewers**

Reviewers must compare all six final screenshots, inspect media provenance and report P0/P1/P2 findings without editing shared files.

- [ ] **Step 2: Fix accepted P0/P1 findings and rerun their focused tests**

Do not waive a visual mismatch merely because tests pass. Document only intentional, justified differences.

- [ ] **Step 3: Run the complete release gate**

Run: `npm.cmd test -- --run`

Expected: every test file and test passes.

Run: `npm.cmd run build`

Expected: TypeScript and Vite production build pass.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 4: Verify fixed server, links, console and all four final viewports in the in-app Browser**

Record HTTP 200, zero unexpected console errors, working phone/VK/Yandex anchors, keyboard menu/carousel behavior and final screenshot paths.

- [ ] **Step 5: Update provenance/deviation/release documentation**

List every ImageGen prompt/asset, Remove Background run, generated/reference/documentary classification and justified visual difference.

- [ ] **Step 6: Commit and push**

Run: `git add -A && git status --short`

Inspect the exact staged file list before committing; exclude browser/tool artifacts.

Run: `git commit -m "feat: deliver layered White Cup reference reconstruction"`

Run: `git push origin master`

- [ ] **Step 7: Verify remote publication evidence**

Run: `git rev-parse HEAD && git rev-parse origin/master && git status --short`

Expected: local and remote SHAs match and the worktree is clean. Report the local URL, GitHub commit URL, test/build results and final screenshot paths.
