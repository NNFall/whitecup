# White Cup desktop flow polish implementation plan

> Execute this plan in the existing repository. Do not stage unrelated evidence PNGs or authoring prototypes.

## Goal

Make the desktop landing read as one continuous paper guide: full-width top navigation with hero blending, and rounded gradient bridge intervals with small atmospheric labels. Preserve the current mobile composition and accessibility.

## Tasks

- [x] **1. Freeze the visual contract**
  - Files: `docs/superpowers/specs/2026-08-27-white-cup-desktop-flow-design.md`, this plan.
  - Verify the contract is explicit about desktop/mobile breakpoints, provenance, reduced motion and no hard seams.

- [x] **2. Redesign the desktop navigation rail (TDD)**
  - Owner: `src/styles/navigation-polish.css`, `src/styles/NavigationPolish.test.ts`, and `StickyNav.tsx` only if a data hook is needed.
  - Make the shell full width from `top: 0`; use a hero translucent profile and a denser opaque compact profile that never lets scene copy ghost through the rail; keep logo/link targets and the mobile rail unchanged.
  - First update focused tests, then implement and run the focused file plus build.

- [x] **3. Replace hard scene seams with authored bridges (TDD)**
  - Owner: `src/components/SceneBridge.tsx`, `src/styles/scene-bridge-polish.css`, `src/styles/SceneBridgePolish.test.ts`.
  - Add short derived labels, visible rounded paper panel, gradient feathering, restrained shadow and enough vertical space. Keep the bridge decorative, image-free and reduced-motion safe.
  - First update focused tests, then implement and run the focused file plus build.

- [x] **4. Add subtle desktop scene-edge continuity**
  - If visual inspection shows a remaining hard seam, add a small isolated CSS layer with desktop-only radius/shadow hand-offs. Do not alter measured mobile scene geometry or introduce polygon/ribbon borders.

- [x] **5. Independent review and browser evidence**
  - Ask independent agents to review CSS/semantics and inspect the in-app Browser at all required viewports. Fix P1/P2 overlap, header ghosting, overflow and bridge legibility findings.

- [ ] **6. Full verification and release**
  - Run `npm.cmd test -- --run`, `npm.cmd run build -- --base=/site/whitecup/`, `git diff --check` and staged diff checks.
  - Update `docs/verification.md`, `docs/visual-deviations.md` and this plan with truthful counts/evidence.
  - Stage only intended source/docs files, commit with current local dates, push `origin/master`, deploy `/root/whitecup`, smoke-test the public URL in the Codex in-app Browser, and verify the remote SHA.
