# White Cup Design Context

## Theme

Warm paper sketchbook with documentary cafe photography pasted into ink-and-orange compositions. The physical scene is a visitor opening a hand-drawn local cafe guide on a sunny table, with coffee warmth and a few imperfect pencil marks.

## Color

- Paper: `#F7F2E9`
- Paper light: `#FBF7F0`
- Ink: `#12110F`
- Ink soft: `#34312D`
- Orange display: `#E9460D`
- Orange action: `#C93608`
- Pencil line: `#B6AEA3`
- Map water: `#D8E2E5`

Use OKLCH equivalents only when a derived tint is needed; do not use pure black or pure white. Orange display is for large type, marks and doodles. Orange action is for small labels and buttons where contrast matters.

## Typography

- Handwritten display: `Pangolin`, fallback `Neucha`, with Cyrillic coverage verified in the browser.
- Script accent: `Marck Script`, fallback `Caveat`.
- Body and controls: `Golos Text`, fallback `Manrope`, then a system sans.
- Desktop display range: 76–96px, line-height 0.94–0.98.
- Mobile display range: 38–56px, line-height about 0.98.
- Body range: 16–23px, line-height 1.42–1.55, measure 48–65ch.

## Layout

Desktop uses an asymmetric 56/44 or 58/42 split with 64–98px gutters and one sticky nav. Photo regions use prepared organic SVG masks with a thin orange pencil echo. Mobile is one column with 16–20px gutters, full-width photo cuts, and only the menu as a horizontal scroll-snap area. Use `min-height: 100dvh`, not `100vh`.

## Components

`PaperSurface`, `StickyNav`, `SketchUnderline`, `Doodle`, `SamaraSkyline`, `RouteLine`, `OrganicPhoto`, `PaperCard`, `MenuCarousel`, `LocationCard`, `StaticMapCard`, and `Reveal` are the shared vocabulary. Cards stay thin and paper-like; no nested bento or repeated rounded SaaS tiles.

## Motion

Use short opacity/transform reveal (250–450ms) and tactile button scale on active. No scroll hijacking, magnetic cursor, perpetual grain, or autoplay carousel. Under `prefers-reduced-motion: reduce`, content is immediately visible and all movement/smooth scroll is disabled.

## Imagery

Documentary photos come from public Yandex observations after visual review. Reference PNGs guide framing, not factual content. Decorative skyline, map, cup and route marks can be SVG/CSS or generated raster assets; they must be marked decorative and never imply a real map position.
