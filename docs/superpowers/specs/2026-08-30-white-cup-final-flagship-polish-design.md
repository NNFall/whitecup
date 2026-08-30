# White Cup Final Flagship Polish — Design Spec

## Goal

Finish the current White Cup landing without redesigning the six accepted reference scenes. The pass removes the last visible piece of generic UI chrome between scenes, closes active mobile/navigation accessibility gaps, and makes the production build/deployment path harder to misuse.

## Approved direction

The Hero, Menu, About, Visit, Events and Locations compositions remain intact: live typography, documentary/reference-art layers, card counts, scene geometry and mobile ordering are not redesigned. Current browser evidence shows no document overflow or title/copy collision at 1920×1080, 1920×568, 390×844 and 320×568.

### 1. Seamless scene hand-off

- Keep the existing inert `SceneBridge` DOM, its quiet handwritten label and small marker.
- Remove the inset pill-card treatment from `.scene-bridge__paper`: no border, rounded rectangle or drop shadow.
- Replace the boxed surface with a transparent warm-paper crossfade that dissolves at the horizontal edges.
- Keep all bridge layers decorative, pointer-inert and reduced-motion safe.

This changes only the transition chrome; the reference scenes and their frames are unchanged.

### 2. Mobile menu closure

- Put a visible 44×44 close control inside the mobile dialog panel.
- Focus it when the dialog opens, keep it inside the existing focus trap, and return focus to the trigger after close.
- Escape, backdrop click and navigation-link activation keep working.

### 3. Respect user scroll intent

- Keep the immediate hash alignment and the single delayed media-settle alignment.
- Cancel the delayed alignment as soon as the visitor signals manual navigation with wheel, touch, pointer or a scroll-navigation key.
- A new hash change starts a fresh alignment cycle.
- In the menu carousel only Left/Right navigate cards; Up/Down remain available for normal page scrolling.
- The footer instruction distinguishes native carousel browsing from the external full-menu link.

### 4. Contrast and production safety

- Use the already specified accessible action orange `#c93608` for normal-size text and filled controls; decorative large display orange remains unchanged.
- Give inactive carousel dots at least 3:1 non-text-control contrast on paper.
- Make a normal production build emit `/site/whitecup/` asset URLs while preserving the root URL for local development.
- Enable server compression for CSS/JS during the release if the current nginx site configuration permits a scoped, syntax-checked change.

## Non-goals

- No new media generation, typography replacement, section reordering or scene-card redesign.
- No removal of reference-matching photo cuts or card layouts.
- No scroll hijacking, autoplay or new dependency.
- No staging of the existing untracked authoring/evidence folders.

## Acceptance evidence

- Focused RED→GREEN tests for hash interruption, carousel vertical keys, mobile close control, bridge surface, contrast tokens and Vite base.
- Full Vitest suite, production build and `git diff --check`.
- Codex In-app Browser at 1920×1080, 1920×568, 390×844 and 320×568; no document overflow, hidden close control, bridge pill or console errors.
- Public `/site/whitecup/` smoke test after atomic deployment; remote SHA and compression headers verified.
