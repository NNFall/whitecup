# White Cup Continuity Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the White Cup landing feel like one composed site by stabilizing the header, softening scene transitions, composing Events/Locations on a reliable grid, and making the menu carousel loop forever.

**Architecture:** Keep the existing React section and provenance model. Add isolated stylesheet layers for navigation, bridges and scene layout so parallel work does not fight the legacy global cascade. The bridge is a pure-CSS paper layer plus marker, the navigation is an opaque bounded rail, and the carousel owns a three-copy native-scroll track while exposing only the middle copy to assistive technology.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS media/container queries, native scroll-snap.

**Current status (27 August 2026):** The navigation, pure-CSS bridge,
eight-item triple-loop carousel, scene-layout and mobile-hero implementation
changes are present in the shared worktree. Implementation, full gate, IAB and
review steps are complete: 30 test files/194 tests PASS, the build with
`--base=/site/whitecup/` PASS, and `git diff --check` PASS. Deployment, commit
and push remain pending; the local/untracked browser screenshots are evidence
only and are not claimed as committed.

---

### Task 1: Stable desktop/mobile navigation

**Owner:** navigation worker

**Files:**
- Modify: `src/components/StickyNav.tsx`
- Create: `src/styles/navigation-polish.css`
- Create: `src/styles/NavigationPolish.test.ts`
- Modify: `src/main.tsx` to import the new stylesheet last among navigation layers

- [x] **Step 1: Write the failing test**

Assert that the single desktop shell remains mounted for both `reference` and `compact` profiles, no desktop navigation link receives a transform style contract, and the mobile dialog still traps focus/returns focus on Escape.

- [x] **Step 2: Run the focused test and verify it fails**

Run `npm.cmd test -- --run src/styles/NavigationPolish.test.ts`. Expected: FAIL because the stable-origin and no-slide contract is not present.

- [x] **Step 3: Implement the minimal navigation layer**

Remove profile-specific horizontal transforms from the active shell. Add a bounded opaque paper rail with `max-width: 78rem`, `min-height: 4rem`, `top: 1rem`, `margin-inline: auto`, `background-color: var(--paper-light)`, and transitions limited to `opacity`, `background-color`, `box-shadow`, and `transform: translateY`. Cap the desktop logo at `3.25rem`; keep mobile at `3rem`. Keep active-link underline and all existing ARIA behavior.

- [x] **Step 4: Run the focused test and build**

Run `npm.cmd test -- --run src/styles/NavigationPolish.test.ts` and `npm.cmd run build`. Expected: PASS and a successful Vite build.

- [ ] **Step 5: Commit**

Commit only the owned files with `git commit -m "fix: stabilize white cup navigation rail"`.

### Task 2: Seamless scene bridges

**Owner:** bridge worker

**Files:**
- Modify: `src/components/SceneBridge.tsx`
- Create: `src/styles/scene-bridge-polish.css`
- Create: `src/styles/SceneBridgePolish.test.ts`
- Modify: `src/main.tsx` to import the bridge stylesheet after existing bridge rules

- [x] **Step 1: Write the failing test**

Render `<SceneBridge from="hero" to="menu" />` and assert there is no `img`, the root is `aria-hidden="true"`, it has `data-bridge-layer="transition"`, and the only child layers are paper plus a CSS marker.

- [x] **Step 2: Run the focused test and verify it fails**

Run `npm.cmd test -- --run src/styles/SceneBridgePolish.test.ts`. Expected: FAIL because the current bridge renders the route-ribbon `<img>`.

- [x] **Step 3: Implement the minimal bridge**

Replace the route image with `<span className="scene-bridge__marker" aria-hidden="true" />`. In the new stylesheet set a 2.5–5rem normal-flow height, feathered `linear-gradient` background, no border/clip-path polygon, and a 9rem orange-to-transparent marker. Keep `overflow: clip`, `pointer-events: none`, and a reduced-motion rule with no transitions. The final bridge must contain only the CSS paper and marker layers.

- [x] **Step 4: Run the focused test and build**

Run `npm.cmd test -- --run src/styles/SceneBridgePolish.test.ts` and `npm.cmd run build`. Expected: PASS.

- [ ] **Step 5: Commit**

Commit only the owned files with `git commit -m "fix: soften scene transitions"`.

### Task 3: Infinite menu carousel

**Owner:** carousel worker

**Files:**
- Modify: `src/components/MenuCarousel.tsx`
- Modify: `src/styles/menu-carousel-polish.css`
- Create: `src/components/MenuCarouselLoop.test.tsx`
- Modify: `src/sections/MenuSection.tsx` only if a new menu item list is required
- Add distinct generated menu assets under `public/media/` only after visual inspection

- [x] **Step 1: Write the failing test**

Render eight items and assert both arrow buttons are enabled at the initial state, ArrowLeft from the first logical item wraps to the last logical item, ArrowRight from the last wraps to the first, and cloned cards have `aria-hidden="true"` plus `tabIndex=-1`.

- [x] **Step 2: Run the focused test and verify it fails**

Run `npm.cmd test -- --run src/components/MenuCarouselLoop.test.tsx`. Expected: FAIL because the current carousel disables controls at both boundaries and renders one copy.

- [x] **Step 3: Implement the loop**

Render `[...items, ...items, ...items]`, start the viewport at the first card of the middle copy in a layout effect, map physical indices to logical indices with modulo arithmetic, and silently shift by one item-set when scroll reaches either outer copy. Keep native touch/wheel scrolling, `scroll-snap-type`, keyboard controls and reduced-motion behavior. Mark outer copies aria-hidden and remove their focusability; keep dots and position text on the logical index.

- [x] **Step 4: Add menu content without provenance drift**

Keep the eight menu items in separate decorative assets/data entries with `actual menu` fallback pricing. Do not label generated food as documentary photography.

- [x] **Step 5: Run focused tests, full tests and build**

Run `npm.cmd test -- --run src/components/MenuCarouselLoop.test.tsx src/components/MenuCarousel.test.tsx`, then `npm.cmd test -- --run` and `npm.cmd run build`. Expected: all pass.

- [ ] **Step 6: Commit**

Commit only the carousel files/assets with `git commit -m "feat: make menu carousel loop continuously"`.

### Task 4: Events and Locations grid composition

**Owner:** scene-layout worker

**Files:**
- Modify: `src/sections/EventsSection.tsx`
- Modify: `src/sections/LocationsSection.tsx`
- Create: `src/styles/scene-layout-polish.css`
- Create: `src/sections/SceneLayoutPolish.test.tsx`
- Modify: `src/main.tsx` to import the layout stylesheet last

- [x] **Step 1: Write the failing test**

Assert that Events and Locations expose independent paper/stage/photo layers, that Locations has two distinct location cards with route/contact actions, and that no section uses a full-scene image as the only child of its art wrapper.

- [x] **Step 2: Run the focused test and verify it fails**

Run `npm.cmd test -- --run src/sections/SceneLayoutPolish.test.tsx`. Expected: FAIL against the current full-backdrop-only structure.

- [x] **Step 3: Implement independent layers**

Use a CSS paper base for each scene, render documentary venue photos through `OrganicPhoto` in a bounded stage, keep map/doodles/cake/coffee as separate decorative layers, and preserve all provenance data attributes. Place desktop copy and cards on a 12-column grid with fixed gutters; on mobile use a single-column flow with stage after actions. Keep every action at least 44px high and let cards grow intrinsically instead of clipping overflow.

- [x] **Step 4: Add responsive guardrails**

In `scene-layout-polish.css`, set `min-height: 100dvh` for desktop scenes, `min-height: auto` for mobile, `overflow: visible` for content wrappers, and use `clamp()`/grid gaps. Add low-height rules for `max-height: 760px` that move intro/cards down or reduce art height without overlapping title, copy or controls.

- [x] **Step 5: Run focused tests and build**

Run `npm.cmd test -- --run src/sections/SceneLayoutPolish.test.tsx`, `npm.cmd test -- --run`, and `npm.cmd run build`. Expected: all pass.

- [ ] **Step 6: Commit**

Commit only the scene layout files with `git commit -m "fix: compose events and locations on a responsive grid"`.

### Task 5: Integration, visual QA and publication

**Files:**
- Modify: `docs/verification.md`
- Modify: `docs/visual-deviations.md` if a visual departure is intentional
- Use existing supporting frames under `docs/evidence/layered-reconstruction/`; do not claim a new evidence folder until post-fix screenshots are actually saved.

- [x] **Step 1: Review all worker diffs and resolve conflicts**

Run `git diff --check`, inspect every changed path, and keep browser evidence files out of production commits unless they are explicitly documented.

- [x] **Step 2: Run the full gate**

Run `npm.cmd test -- --run` and `npm.cmd run build`. Record exact test/build counts.

- [x] **Step 3: Verify in the Codex in-app browser**

Use the browser viewport capability at `1920x1080`, `1536x864`, `390x844`,
`320x568`, `1920x800`, `1920x720`, `1536x720`, and `1440x568`. Result: the
standard Hero pass has no title/copy overlap or clipping, with
`scrollWidth = clientWidth` measured as `1905`, `1521`, `375`, and `305`
respectively; the mobile carousel next-card action passes at `320x568` and
`390x844`. The low-height Menu/Events runway pass has positive title→intro,
intro→cards and card-copy gaps at all four low-height viewports, with no
title/intro/card overlap or clipping. Existing PNG paths are local/untracked;
the remaining low-height proof is the IAB metric output, not a committed
evidence folder. Check screenshots, console logs, heading/card/action bounding
boxes, menu loop controls, anchor landing, mobile-hero ordering, and
reduced-motion state.

- [x] **Step 4: Request code review**

Dispatch a read-only reviewer against the final diff and fix all P0/P1 findings before staging.

- [ ] **Step 5: Build with `/site/whitecup/` base and deploy** — build PASS;
  deployment remains pending.

Run `npm.cmd run build -- --base=/site/whitecup/`, upload `dist` to `/root/whitecup`, keep the existing nginx backup, run `nginx -t`, reload nginx, and smoke-test `https://kaigo.space/site/whitecup/` plus representative assets.

- [ ] **Step 6: Commit and push** — pending.

Refresh the outgoing commit timestamps, verify with `git show -s --format=fuller`, push `master`, and verify local/remote SHAs match.
