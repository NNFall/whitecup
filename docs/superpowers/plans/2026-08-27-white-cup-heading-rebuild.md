# White Cup Heading Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the live White Cup headings so their font roles, scale, line breaks, and phrase-level accents visibly track the supplied references on desktop and mobile.

**Architecture:** Preserve semantic headings and the existing scene composition. Use a measured local-font choice, explicit title-line/word spans, and a final scene-specific typography layer. Keep meaningful text editable and accessible, with no raster title images in runtime.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, local WOFF2 fonts, Codex In-app Browser.

---

### Task 1: Produce the font A/B decision

**Files:**
- Create: `docs/evidence/font-ab/README.md`
- Create: `docs/evidence/font-ab/pangolin-1920x1080.png`
- Create: `docs/evidence/font-ab/neucha-1920x1080.png`
- Modify: `docs/font-licenses.md`

- [x] **Step 1: Capture two temporary font variants in the In-app Browser**

Keep the repository unchanged while injecting temporary `@font-face` overrides
for Pangolin and the current White Cup Display. Capture the same Hero, Menu and
About anchors at 1920×1080. Record computed family, font size, line height,
heading bounding boxes, and any overflow.

- [x] **Step 2: Write the failing provenance test**

Add a test that requires the selected family to be declared in `tokens.css`,
the selected local WOFF2 to exist, and `docs/font-licenses.md` to name the A/B
winner and rejected candidate. Run the focused test and confirm it fails before
the decision is documented.

- [x] **Step 3: Document the winner and license source**

Record the measured winner, why it matches the reference, the rejected variant,
and the fact that all large headings remain live DOM text. Do not add a new
network font dependency or rasterize copy.

- [x] **Step 4: Run the focused provenance test**

Run `npm.cmd test -- --run src/styles/Typography.test.ts` and verify the new
contract passes.

### Task 2: Add phrase-level heading contracts before implementation

**Files:**
- Modify: `src/sections/LiveTitleRuntime.test.tsx`
- Modify: `src/sections/EarlyScenesVisualContract.test.tsx`
- Modify: `src/styles/LiveTypography.test.ts`
- Modify: `src/sections/MenuVisualContract.test.tsx`
- Modify: `src/sections/AboutSceneVisualContract.test.tsx`

- [x] **Step 1: Write the desired semantic and geometry assertions**

Assert one accessible heading per scene, explicit spans for the Hero lines,
Menu initial/word accent, About script and return word, plus Visit/Events/
Locations accents. Assert desktop heading size ranges and mobile reset rules,
and reject runtime `title-reference` nodes.

- [x] **Step 2: Run the focused contracts and verify RED**

Run:

```powershell
npm.cmd test -- --run src/sections/LiveTitleRuntime.test.tsx src/sections/EarlyScenesVisualContract.test.tsx src/styles/LiveTypography.test.ts src/sections/MenuVisualContract.test.tsx src/sections/AboutSceneVisualContract.test.tsx
```

The new assertions failed before the production rebuild because the current
markup still used the old role mapping and line hooks.

### Task 3: Rebuild live heading markup and responsive CSS

**Files:**
- Modify: `src/sections/HeroSection.tsx`
- Modify: `src/sections/MenuSection.tsx`
- Modify: `src/sections/AboutSection.tsx`
- Modify: `src/sections/VisitSection.tsx`
- Modify: `src/sections/EventsSection.tsx`
- Modify: `src/sections/LocationsSection.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/live-typography.css`
- Modify: `src/main.tsx`

- [x] **Step 1: Add semantic line and phrase spans**

Keep each heading as one `h1`/`h2`. Make the Hero three lines on desktop and
mobile-specific lines, with `White Cup` as a separate script span. Give Menu
the enlarged initial `З` and separate `заглянуть`; give About separate script,
orange, and return spans. Add equivalent accent spans to Visit, Events and
Locations without duplicating accessible text.

- [x] **Step 2: Implement the measured font roles**

Use the Task 1 A/B winner (Neucha, exposed as `White Cup Display`) for Russian display text, `var(--font-script)` only for
short script phrases, and Golos for body/UI. Keep `font-display: swap` and local
asset paths. Do not use PNG text.

- [x] **Step 3: Implement reference-fit desktop geometry**

At desktop, increase heading sizes and max widths to match the reference
proportion, lock explicit line breaks, and position the copy within the scene
grid rather than with large absolute offsets. Use separate underline pseudo-
elements or flow hooks on the phrase that owns the accent. Keep rotations under
1.5 degrees and never animate layout properties.

- [x] **Step 4: Implement mobile-specific geometry**

At `max-width: 1023px`, reset rotations, define intentional line breaks for
390/320 widths, reserve space below script words, and keep headings/CTA/copy
inside their scene frame with no horizontal overflow.

- [x] **Step 5: Run the focused contracts and verify GREEN**

Run the command from Task 2 plus `npm.cmd test -- --run src/styles/Typography.test.ts`.
Fix production code if a contract fails; do not weaken an assertion to match the
old visual.

### Task 4: Browser visual iteration and evidence

**Files:**
- Create: `docs/evidence/headings-rebuild/hero-1920x1080.png`
- Create: `docs/evidence/headings-rebuild/menu-1920x1080.png`
- Create: `docs/evidence/headings-rebuild/about-1920x1080.png`
- Create: `docs/evidence/headings-rebuild/hero-390x844.png`
- Create: `docs/evidence/headings-rebuild/menu-390x844.png`
- Create: `docs/evidence/headings-rebuild/about-390x844.png`
- Create: `docs/evidence/headings-rebuild/menu-320x568.png`
- Create: `docs/evidence/headings-rebuild/visit-1920x1080.png`
- Create: `docs/evidence/headings-rebuild/about-low-height-1920x640.png`
- Create: `docs/evidence/headings-rebuild/about-low-height-1920x568.png`
- Create: `docs/evidence/headings-rebuild/visit-low-height-1920x640.png`
- Create: `docs/evidence/headings-rebuild/visit-low-height-1920x568.png`
- Modify: `docs/visual-deviations.md`
- Modify: `docs/verification.md`

- [x] **Step 1: Run the local server and capture the required viewports**

Use only Codex In-app Browser. Capture Hero, Menu and About at 1920×1080 and
their mobile equivalents at 390×844 and 320×568. Also probe 1536×864 and
1024×720 for overflow, heading/copy gaps, and CTA containment.

- [x] **Step 2: Compare against the saved baseline**

Use `view_image` on the baseline and after frames. Check heading scale,
line-wrap, left edge, script baseline, underline ownership, and whether any
heading intersects intro/cards. Iterate CSS until the change is visually obvious
and intentional, not merely a transform.

- [x] **Step 3: Record evidence and deviations**

Document the chosen font, measured viewport checks, and any unavoidable
reference deviations. State explicitly that all meaningful text is live DOM
text and that title raster assets remain authoring-only.

### Task 5: Independent review and release verification

**Files:**
- Modify: `docs/superpowers/plans/2026-08-27-white-cup-heading-rebuild.md`
- Modify: `docs/verification.md`

- [x] **Step 1: Request spec-compliance review**

Send the full requirements and diff to a read-only reviewer. Fix any missing
reference scene, font provenance, accessibility or responsive requirement,
then repeat the review until approved.

Fresh post-guard IAB/spec review completed: the six scenes remain live DOM
headings, local font provenance is documented, and the 1920×640/568 overlap
regression was fixed and rechecked in the In-app Browser.

- [x] **Step 2: Request code-quality review**

After spec approval, send the diff to a second read-only reviewer. Address
confirmed cascade, maintainability, performance and test-quality issues.

Fresh code review found no P0/P1 after the bounded tall/short Visit and About
guards. Remaining CSS overlap is bounded by disjoint media conditions and is
covered by the focused DesktopContinuity contracts.

- [x] **Step 3: Run fresh full verification**

Run:

```powershell
npm.cmd test -- --run
npm.cmd run build -- --base=/site/whitecup/
git diff --check
```

Record exact test count, build output, and clean diff check. Verify the local
fixed-port server and public bundle only after the code gate is green.

Completed 28 August 2026: `npm.cmd test -- --run` — 32 files / 241 tests
passed; `npm.cmd run build -- --base=/site/whitecup/` — PASS (44 modules,
three fonts verified); `git diff --check` — PASS. IAB checks covered
1920×1080/864/720/640/568, 1680×900, 1536×864/720, 1440×864/568,
1024×720, 1100×720, 390×844 and 320×568 with no document overflow and
positive title/copy gaps.

- [x] **Step 4: Stage only intended files and publish**

Inspect `git status --short`, stage source/docs/evidence for this pass only,
refresh local commit AuthorDate/CommitDate before push, commit, push `master`,
verify `git ls-remote origin refs/heads/master`, deploy `/root/whitecup`, and
run a final In-app Browser smoke on the public URL.

Completed 28 August 2026: intended source/docs/evidence were staged without
authoring-only assets; release commit `cbbc471eb53c37b8aab4f5714ebe37b52739fd7d`
was pushed to `origin/master`, and the unchanged static build was deployed to
`/root/whitecup`. Public HTTP and Codex In-app Browser smoke passed at
1920×1080, 1920×640, 1920×568, 390×844 and 320×568; fonts loaded, headings
were live DOM text, and document overflow remained zero.
