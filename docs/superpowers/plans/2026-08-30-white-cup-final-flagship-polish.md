# White Cup Final Flagship Polish — Implementation Plan

> Execute with subagent-driven development. Preserve unrelated untracked evidence and stage only listed task files.

**Goal:** Remove the last stitched transition chrome, fix active mobile/navigation accessibility issues, and harden the production path without redesigning accepted reference scenes.

**Tech:** React 19, TypeScript, CSS, Vite, Vitest/Testing Library, Codex In-app Browser, nginx.

## Task 1 — Interaction contracts

**Files:** `src/App.test.tsx`, `src/App.tsx`, `src/components/MenuCarousel.test.tsx`, `src/components/MenuCarousel.tsx`

- [x] Add failing tests that delayed hash alignment stops after user scroll intent while a quiet load still realigns.
- [x] Add a failing test that Up/Down are not prevented or mapped to horizontal carousel movement; keep Left/Right looping.
- [x] Implement the smallest event/listener changes and clarify the external full-menu link copy.
- [x] Run focused tests green.

## Task 2 — Mobile navigation closure

**Files:** `src/components/StickyNav.test.tsx`, `src/components/StickyNav.tsx`, `src/styles/navigation-polish.css`

- [x] Add a failing test for an in-dialog close control, initial focus, focus trapping and trigger focus restoration.
- [x] Add the 44×44 visible close control inside the panel and implement styles at 390/320 widths.
- [x] Run focused tests and inspect the open dialog in the In-app Browser.

## Task 3 — Transition and contrast polish

**Files:** `src/styles/SceneBridgePolish.test.ts`, `src/styles/scene-bridge-polish.css`, `src/styles/tokens.css`, `src/styles/global.css`, relevant style tests

- [x] Replace the rounded/shadowed bridge-paper assertion with a failing transparent-crossfade contract.
- [x] Add failing contrast contracts for action orange and inactive carousel dots.
- [x] Remove the bridge pill surface, set `--orange-action: #c93608`, and strengthen inactive dot contrast.
- [x] Run focused style tests and compare each scene join at desktop/mobile viewports.

## Task 4 — Build and deployment hardening

**Files:** `vite.config.ts`, `package.json`, a focused config test if needed

- [x] Add a failing contract for correct production base and root local development.
- [x] Configure Vite by command/mode so ordinary production builds target `/site/whitecup/`.
- [x] Run an ordinary `npm.cmd run build` and inspect emitted URLs.
- [x] During deployment, inspect nginx, enable scoped JS/CSS compression if safe, run `nginx -t`, and verify headers.

## Task 5 — Independent review and release

- [x] Run fresh full tests, production build and `git diff --check`.
- [x] Request independent code and visual review; fix confirmed blockers.
- [x] Capture final In-app Browser evidence at 1920×1080, 1920×568, 390×844 and 320×568; reset viewport override.
- [x] Stage only intended files, refresh outgoing local commit dates, commit, push `HEAD:master`, verify remote SHA (`543356228d6921779d50fc91c742d34c102c4346`).
- [x] Atomically deploy `/root/whitecup`, verify public URL, assets, console, layout and compression; retain the previous release for recovery.
