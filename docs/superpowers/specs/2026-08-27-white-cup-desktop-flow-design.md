# White Cup desktop flow and scene-bridge design

## Intent

The landing already has the right paper, ink, orange and documentary-photo vocabulary, but its desktop composition still reads as stacked artboards. This pass makes the scroll feel like one continuous printed guide: the navigation begins at the top edge, the hero lets the paper/image breathe behind it, and each following scene is joined by a deliberate soft paper interval rather than a hard seam.

## Visual contract

- **Top rail:** the desktop navigation is a full-bleed fixed rail starting at `top: 0`. On the hero it is a translucent paper wash that merges into the image; after the first scene it becomes a denser, still translucent paper wash with a restrained shadow. The logo and links keep the existing readable scale. The mobile rail remains the current stable paper surface and composition.
- **Scene bridge:** every bridge gets real vertical breathing room (desktop roughly 84–128px, mobile 40–64px). A soft, rounded paper panel floats inside a multi-stop paper gradient with a small warm shadow. A short, optional phrase gives the transition a human rhythm. The bridge remains decorative/inert, has no raster ribbon, and never uses a hard border or polygon cut.
- **Scene edges:** the bridge owns the visual hand-off, so scene content keeps its measured artboards. Any edge rounding is subtle and desktop-only; mobile remains a clean single column without horizontal overflow.
- **Motion:** bridges settle with opacity/transform only. Reduced-motion visitors get the final state immediately. No autoplay or scroll hijacking is introduced.

## Composition and semantics

`SceneBridge` continues to expose decorative provenance markers. The new label is `aria-hidden` because it is atmospheric copy rather than navigation or operational information. `data-bridge-label` makes the authored phrase inspectable in visual tests. Navigation profile state remains driven by the existing viewport/hash logic.

## Verification gates

1. TDD tests assert full-bleed/top-zero desktop header geometry, distinct hero/compact translucency, unchanged mobile rail, bridge panel/label structure, rounded silhouette, gradient and reduced-motion rules.
2. Run the full Vitest suite and production build.
3. Use the Codex in-app Browser only at 1920×1080, 1648×912, 1536×864, 1920×720, 390×844 and 320×568. Check no horizontal overflow, no copy overlap, readable header over hero, and visibly soft bridges between all scenes.
4. Record any intentional visual deviation from the supplied screens in `docs/visual-deviations.md` and update deployment evidence after the public smoke test.

