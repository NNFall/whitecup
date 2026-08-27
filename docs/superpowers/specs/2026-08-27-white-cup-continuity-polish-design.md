# White Cup Continuity Polish Design

## Goal

Turn the current reference-faithful scenes into one assembled landing page. The next release must keep the supplied paper, ink, orange and documentary-photo language while removing the visible screenshot seams, header drift, layout collisions and finite menu carousel behavior.

## Design decisions

### Navigation

Keep one semantic desktop navigation tree and the existing mobile dialog. On desktop the navigation is a single centered paper rail with a stable horizontal origin. At the top of the hero it is translucent enough to preserve the photograph, but it has a bounded surface and a quiet shadow; after scrolling it becomes slightly more opaque and compact without changing its x-position. The logo is capped at 52px on desktop and 48px on mobile. No hidden duplicate links, horizontal slide-in transform or full-width opaque strip is allowed.

### Scene transitions

Scene bridges remain in normal document flow and keep `aria-hidden="true"`, but no longer render the repeated route-ribbon raster. Each bridge is a short paper crossfade with feathered edges, a low-contrast ink/orange route tick and scene-specific optical alignment. It must not create a white rectangle, hard border or horizontal overflow. Reduced motion removes the bridge transition while preserving the paper continuity.

### Editable scene composition

Events and Locations use a code-owned paper base plus independent DOM layers. Documentary venue photography is rendered through `OrganicPhoto`; generated/reference art remains decorative and is marked with its provenance data. Text, map labels, cards, route buttons and doodles remain separate elements. Desktop uses an asymmetric two-column grid; mobile collapses to one column with the photo/map stage after the actionable content. No text or action may overlap an image edge or another control.

### Menu carousel

The menu is a manual, native-scroll carousel with a repeated visual track. The middle copy of the item list is the accessible set; leading/trailing copies are `aria-hidden` and not focusable. Arrow, dot and keyboard navigation wrap modulo the item count. Native touch/wheel scrolling remains available, and when the scroll reaches an outer copy the component silently re-centres by one item-set with no visible jump. There is no autoplay. Cards use distinct, clearly decorative food assets and keep the current price-provenance wording.

### Responsive and motion rules

The acceptance matrix is 1920x1080, 1648x912, 390x844 and 320x568, plus low-height desktop smoke at 1920x720 and 1536x720. Scene content may grow beyond one viewport when needed, but must never clip text, controls or card borders. Animations use transform/opacity only, 180–420ms ease-out curves, and are disabled under `prefers-reduced-motion`.

## Testing and evidence

- Add failing tests for stable nav geometry/profile behavior, bridge DOM contract, looped carousel semantics and scene action bounds.
- Verify the full Vitest suite and production Vite build.
- Capture IAB screenshots at the acceptance matrix and inspect console logs, font readiness, image load failures, anchor positions and document overflow.
- Record any intentional visual deviation in `docs/visual-deviations.md` and update verification evidence before deployment.

## Non-goals

This pass does not replace verified documentary venue photos with synthetic scenes, add a third-party carousel library, or change the public information architecture and hash URLs.
