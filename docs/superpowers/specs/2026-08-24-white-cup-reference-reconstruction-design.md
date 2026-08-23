# White Cup Reference Reconstruction Design

## Goal

Rebuild the White Cup landing so the supplied 1672×941 first-screen reference is reproduced as a measured composition rather than a loose visual interpretation. The first viewport is the acceptance criterion: color, grid, typography, logo, photo layers, doodles, skyline, CTA geometry, and responsive behavior must be compared against the source image at 1920×1080, 1536×864 (the user's 125% desktop equivalent), 390×844, and 320×568.

## Non-negotiable reference contract

- The reference image is the canonical artboard. Its visible left paper field, right café field, organic seam, headline line breaks, nav positions, CTA rectangles, doodle positions, and skyline baseline are measured from the source, not approximated by generic flex spacing.
- The left background is a light neutral paper (`#fbf8f2`-family) with visible grain; the current darker beige is not acceptable.
- The hero copy stays in deterministic DOM text for accessibility. The visible content is `Завтраки, кофе и свой вайб в White Cup`, the supplied lede, `Посмотреть меню`, and `Выбрать локацию`.
- Generated raster assets are allowed for decorative/background layers. They must be provenance-labelled and `aria-hidden`; documentary Yandex photos remain clearly separate and are never used as generated food evidence.
- The source screenshot itself is never rendered as a live layer because it contains baked navigation, text, and CTA. Only extracted/recreated individual layers may ship.

## Layer architecture

1. `HeroReferenceFrame`: canonical 16:9 coordinate system with a paper background, grain, and a fixed reference grid. It exposes CSS custom properties for measured x/y/width/height values and scales them proportionally below 1920px.
2. `HeroCafeBackdrop`: a generated 16:9 café background with red ceiling, hanging bulbs, bar, and tables. It contains no text, logo, burger, latte, or UI.
3. `HeroFoodCutouts`: separate generated burger and latte assets with locally removed backgrounds. Each asset has an explicit position/scale token so it can be adjusted without changing the backdrop.
4. `HeroDoodleLayer`: transparent black/orange line-art asset(s) for the dotted route, cup, clouds, birds, small marks, and heart. It is decorative only and can be hidden at narrow mobile widths.
5. `HeroSkylineLayer`: a transparent thin black/white skyline matching the reference baseline, cathedral silhouette, low buildings, birds, and orange sun.
6. `HeroCopyLayer`: DOM heading, lede, underline, and CTAs positioned against the measured grid. The logo uses the extracted verified crop from the supplied reference when possible; otherwise its generated replacement is explicitly documented.

## Responsive behavior

- Desktop uses the measured 56/44-ish split from the source, with the paper copy field and right café image touching at an organic edge.
- The desktop hero remains a single 16:9 scene at 1920×1080 and 1536×864; no element may become disproportionately large at the 125% equivalent.
- Mobile uses the same visual hierarchy but stacks paper copy before the café scene, keeps 16/20px gutters, uses full-width CTAs, and preserves the reference line breaks as closely as readable. No horizontal overflow is allowed.
- `prefers-reduced-motion` makes the copy and generated layers immediately visible with no transform/scroll animation.

## Verification contract

- TDD assertions cover exact copy, five nav anchors, generated/documentary provenance markers, asset fallback behavior, and no `src` request for the conditional food fallback during normal load.
- Browser evidence includes side-by-side reference/current screenshots at 1920×1080 and 1536×864 plus 390×844 and 320×568. DOM metrics record hero bounds, text/CTA rectangles, seam bounds, skyline baseline, and `scrollWidth === clientWidth`.
- Automated gates are `npm test -- --run`, `npm run build`, and `git diff --check`.
- The final report must list every intentional deviation from the reference; “one-to-one” is not claimed until the visual comparison passes.

