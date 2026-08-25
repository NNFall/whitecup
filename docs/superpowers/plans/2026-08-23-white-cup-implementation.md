# White Cup Landing Page Implementation Plan

> Historical planning record. Any early generated public experiment named below was removed before publication; see `docs/reference/white-cup-asset-provenance.md` for active runtime media.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) to implement this plan task-by-task. Each task includes TDD and review checkpoints.

**Goal:** Build and ship the verified, responsive White Cup landing page described in `docs/superpowers/specs/2026-08-23-white-cup-design.md`.

**Architecture:** A Vite React TypeScript single page with data-driven sections and small presentational components. Global CSS owns paper material, type, masks, responsive art direction and reduced-motion; React owns nav, reveal, carousel and mobile-menu behaviour. Documentary Yandex photos are local WebP assets, while skyline/map/doodle elements are local SVG/CSS.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, native CSS/SVG, no animation or icon dependency. Fixed dev/preview port: `4175`.

---

### Task 1: Scaffold the app and provenance-safe data layer

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/data/site.ts`, `src/data/media.ts`
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Create: `src/test/setup.ts`, `src/data/site.test.ts`
- Create: `public/media/interior-01.webp` through `public/media/interior-05.webp`

- [ ] **Step 1: Install only declared dependencies**

Run:

```powershell
npm install react react-dom
npm install -D @types/react @types/react-dom @vitejs/plugin-react-swc typescript vite vitest jsdom @testing-library/react @testing-library/jest-dom
```

Expected: `package.json` contains exactly the runtime and test/build packages used by the app; no icon, motion or CSS framework is assumed.

- [ ] **Step 2: Write the first failing data test**

`src/data/site.test.ts` must assert that the exported site data contains two locations, the verified main phone, and a route URL containing the supplied Yandex organization id. Run `npm test -- --run src/data/site.test.ts` and observe a module-not-found failure before writing the data module.

- [ ] **Step 3: Add minimal typed data and Vite config**

Define `MenuItem`, `Location`, `EventCard`, and `SiteData` in `src/data/site.ts`. Keep `secondaryHoursNote: 'Уточняйте актуальный график перед визитом'` next to the tentative second schedule. Put Yandex, VK and photo provenance in `src/data/media.ts`. Configure Vite port/preview port 4175 and Vitest jsdom setup.

- [ ] **Step 4: Copy only visually reviewed public photos**

Copy the five bundled Yandex WebP files from `C:\Users\User\AppData\Local\Temp\browser-use\assets\1a59acdf-cdbd-4436-96dc-c2c7910e2c6d\` into `public/media/` with stable names. Use `interior-01.webp` for the hero, `interior-05.webp` for the about scene, and the remaining three for events/locations. Record their observed Yandex URLs in `src/data/media.ts` comments or provenance metadata; do not include private or generated imagery.

- [ ] **Step 5: Run the first test and commit**

Run `npm test -- --run src/data/site.test.ts`; expected: PASS. Run `npm run build`; expected: Vite build succeeds with an empty shell. Commit `chore: scaffold White Cup app and verified media`.

### Task 2: Build the paper shell, navigation, reveal and accessible mobile menu

**Files:**
- Create: `src/components/StickyNav.tsx`, `src/components/Reveal.tsx`, `src/components/BrandMark.tsx`
- Create: `src/components/StickyNav.test.tsx`, `src/components/Reveal.test.tsx`
- Modify: `src/App.tsx`, `src/styles/global.css`

- [ ] **Step 1: Write failing behaviour tests**

Test that nav renders links to `#menu`, `#about`, `#events`, and `#locations`; mobile button exposes `aria-expanded=false`, opens the overlay, closes on Escape, and returns focus to the trigger. Test that `Reveal` renders children immediately when `prefers-reduced-motion` is true. Run the two test files and confirm the expected missing-component failures.

- [ ] **Step 2: Implement minimal shell behaviour**

Use `useState` for menu state, `useEffect` for Escape/focus restoration and body scroll lock, and an `IntersectionObserver` in `Reveal` with an SSR-safe immediate fallback. Use a single inline SVG brand mark derived from the verified logo shape, with a text alternative and no emoji.

- [ ] **Step 3: Add paper material and responsive nav styles**

Use `--paper`, `--ink`, `--orange` tokens, a fixed pointer-events-none grain layer, a max-width 1720px nav, visible focus rings, 44px mobile controls, and `@media (prefers-reduced-motion: reduce)` overrides.

- [ ] **Step 4: Run focused tests and commit**

Run `npm test -- --run src/components/StickyNav.test.tsx src/components/Reveal.test.tsx`; expected: PASS. Commit `feat: add accessible paper shell and navigation`.

### Task 3: Add data-driven scenes and organic illustration primitives

**Files:**
- Create: `src/components/SectionFrame.tsx`, `src/components/OrganicPhoto.tsx`, `src/components/SketchUnderline.tsx`, `src/components/Doodles.tsx`, `src/components/SamaraSkyline.tsx`, `src/components/StaticMapCard.tsx`
- Create: `src/sections/HeroSection.tsx`, `src/sections/AboutSection.tsx`, `src/sections/VisitSection.tsx`, `src/sections/EventsSection.tsx`, `src/sections/LocationsSection.tsx`
- Create: `src/sections/SceneSections.test.tsx`
- Modify: `src/App.tsx`, `src/styles/global.css`

- [ ] **Step 1: Write failing scene contract tests**

Assert that the rendered page has exactly one `h1`, six section ids, two factual location names, a phone `tel:` link, a Yandex route link, a VK link, meaningful image alt text, and decorative doodles marked `aria-hidden`. Run the test and observe failure before implementing scenes.

- [ ] **Step 2: Implement section primitives**

`SectionFrame` provides a labelled section and optional kicker; `OrganicPhoto` renders `picture` with explicit aspect ratio, `loading`/`fetchPriority`, SVG mask classes and documentary alt; `SketchUnderline`, `Doodles`, `SamaraSkyline` and `RouteLine` are small inline SVGs with a shared 1.5–2px stroke; `StaticMapCard` is a decorative local map with an explicit “Открыть маршрут в Яндекс Картах” anchor.

- [ ] **Step 3: Implement six scenes in the planned order**

Keep copy concrete and short. Hero has two CTAs; menu follows in Task 4; about has four benefit items; visit has three use cases; events links to the public feed without invented dates; locations show both points and the `15`/Yandex `17` entrance note. Keep content in `site.ts` and map images to `media.ts`.

- [ ] **Step 4: Run tests and commit**

Run `npm test -- --run src/sections/SceneSections.test.tsx`; expected: PASS. Commit `feat: compose White Cup story scenes and organic artwork`.

### Task 4: Implement the menu carousel and interaction coverage

**Files:**
- Create: `src/components/MenuCarousel.tsx`, `src/components/MenuCarousel.test.tsx`
- Create: `src/sections/MenuSection.tsx`
- Modify: `src/App.tsx`, `src/styles/global.css`

- [ ] **Step 1: Write failing carousel tests**

Test that the region is labelled, cards expose names/prices, next/previous buttons have 44px targets, the active dot has `aria-current`, ArrowRight changes the active index, and the final item can be reached. Run the test and confirm failure before code.

- [ ] **Step 2: Implement native snap carousel**

Use a scroll container with `scroll-snap-type: x mandatory`, a `ResizeObserver`/scroll listener to derive the active index, keyboard controls that call `scrollIntoView`, and no autoplay. Hide arrows on small screens only when swipe affordance remains visible; keep the visible next-card sliver.

- [ ] **Step 3: Match the menu reference composition**

Place the handwritten headline and line-art window above the carousel, use documentary food/interior frames where available, give cards thin paper borders, and keep the skyline/dots near the lower edge without clipping text.

- [ ] **Step 4: Run focused tests and commit**

Run `npm test -- --run src/components/MenuCarousel.test.tsx`; expected: PASS. Commit `feat: add accessible featured menu carousel`.

### Task 5: Visual system polish, responsive art direction and generated decoration

**Files:**
- Modify: `src/styles/tokens.css`, `src/styles/global.css`, all `src/sections/*.tsx`
- Create: `public/media/samara-skyline-decorative.png` only if Image Generation produces a useful transparent decorative asset
- Create: `docs/visual-deviations.md`

- [ ] **Step 1: Use Image Generation Skill for one decorative asset**

Generate a transparent, ink-only Samara skyline/route doodle without text or logos. Inspect the result, copy the chosen final into `public/media/` if it materially improves the SVG version, and keep the SVG fallback. Do not generate or use synthetic documentary cafe photos.

- [ ] **Step 2: Apply desktop composition metrics**

Match the reference gutters, 56/44 or 58/42 splits, 88–96px display type, organic SVG cuts, 1.5px borders, 3–4px orange underline marks, and deliberate scene whitespace. Avoid pure black/white, gradients, generic pills and heavy shadows.

- [ ] **Step 3: Apply mobile art direction**

At 390px use 20px gutters, 50–56px display, full-width CTAs and horizontal photo cuts; at 320px use 16px gutters, 38–44px display and reduced doodle count. Keep menu as the only horizontal carousel, move location cards above the map, and use `min-height: 100dvh`.

- [ ] **Step 4: Document deliberate deviations**

Write `docs/visual-deviations.md` with a table containing reference detail, shipped detail, reason, and evidence for the unified logo, verified photos/facts, dark action orange, sticky nav, real route CTA, mobile composition, and unified SVG artwork.

- [ ] **Step 5: Commit visual polish**

Run `npm run build`; expected: PASS. Commit `feat: polish White Cup visual system and responsive art direction`.

### Task 6: End-to-end verification, independent review and evidence

**Files:**
- Create: `docs/verification.md`, `docs/evidence/` screenshots
- Modify: `README.md`

- [ ] **Step 1: Run complete automated verification**

Run `npm test -- --run`, `npm run build`, and `npm run lint` if a lint script exists. Record exact counts and failures in `docs/verification.md`; do not report a pass based on a focused test only.

- [ ] **Step 2: Run the fixed local server**

Run `npm run dev -- --host 127.0.0.1 --port 4175` (or `npm run preview -- --host 127.0.0.1 --port 4175` after build) and verify `http://127.0.0.1:4175/` in the in-app browser.

- [ ] **Step 3: Capture browser evidence**

Using browser control, inspect desktop `1920x1080`, mobile `390x844`, and `320x568`. Capture full-page and first-fold screenshots. Assert no horizontal overflow, no clipped headings, reachable last menu card, working nav anchors, route/phone/VK links, mobile menu Escape/focus behaviour, and reduced-motion content visibility.

- [ ] **Step 4: Dispatch two independent reviewers**

Dispatch a spec-compliance reviewer with the full spec and a code-quality reviewer with the diff and test output. Resolve all critical/important findings, rerun the relevant tests, and repeat review if either reviewer identifies an open issue.

- [ ] **Step 5: Record evidence and commit**

Update `README.md` with local run instructions, source/provenance notes, current factual caveats, and the fixed port. Write `docs/verification.md` with commands, viewport evidence paths, metrics and known limitations. Commit `test: verify White Cup landing page across viewports`.

### Task 7: Final GitHub publication gate

**Files:**
- Modify: `.gitignore`, `README.md` only if final links/commands need adjustment

- [ ] **Step 1: Inspect final state**

Run `git status --short`, `git diff --check`, `git log --oneline --decorate -8`, and `git ls-remote https://github.com/NNFall/whitecup.git`. Confirm no secrets, temp files, or generated private artifacts are tracked.

- [ ] **Step 2: Run final verification again**

Run the full test suite and production build fresh immediately before publication; record exit codes in `docs/verification.md`.

- [ ] **Step 3: Push the completed branch**

Configure `origin` as `https://github.com/NNFall/whitecup.git` if missing, push the current branch with `git push -u origin master`, and verify the remote HEAD with `git ls-remote --heads origin`.

- [ ] **Step 4: Handoff**

Provide the GitHub URL, local URL `http://127.0.0.1:4175/`, commit SHA, test/build evidence, viewport screenshots, factual caveats, and the visual-deviation report.
