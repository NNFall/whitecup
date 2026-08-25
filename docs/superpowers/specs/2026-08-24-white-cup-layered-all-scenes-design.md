# White Cup Layered All-Scenes Reconstruction Design

## Objective

Rebuild all six supplied 1672×941 White Cup references as one responsive React landing without treating any complete reference screen as a single stretched runtime image. Each scene must preserve the reference composition at 1920×1080, remain coherent at the requested 1536×864 desktop-equivalent viewport, and use a separately art-directed 390×844/320×568 mobile composition.

## Validated image-editing premise

The source hero was loaded as an ImageGen edit target and produced three useful independent proof-of-concept layers. Their retained authoring files are documentation-only; public runtime uses the optimized WebP derivatives:

- `docs/reference/assets/hero-clean-base-v2-authoring.png`: text, navigation, logo, doodles, food and cup removed while the warm paper field, café interior and organic seam remain.
- `docs/reference/assets/hero-bagel-plate-magenta-authoring.png`: isolated bagel/plate foreground prepared for alpha extraction.
- `docs/reference/assets/hero-coffee-cutout-authoring.png`: isolated latte/saucer/spoon foreground with a verified alpha channel.

Built-in ImageGen returned the foreground drafts with a baked checkerboard (`Format24bppRgb`), so `remove-background-local` was required to create actual alpha. The generated logo was visually close, but automatic background removal damaged its fine black lines. Runtime branding therefore keeps the exact supplied-reference crop `hero-logo-reference.png`; generated logo files remain POC evidence only.

## Architecture

Every scene uses the same five-layer contract:

1. `ScenePaper`: code-native paper color and grain.
2. `SceneBackdrop`: a clean reference edit or verified documentary photograph, independently cropped with `object-fit: cover` or `<picture>` art direction.
3. `SceneForeground`: individually positioned transparent food, cup, plate or furniture assets.
4. `SceneDecorations`: reference-extracted or generated doodles, skyline, map and line illustrations, always decorative and `aria-hidden`.
5. `SceneContent`: semantic DOM headings, body copy, navigation, controls, cards and links.

No scene may use the complete supplied reference as a runtime `<img>` or CSS background. Rasterized text is restricted to the verified logo/wordmark mark; headings, descriptions, buttons, prices and addresses remain DOM text.

## Coordinate model

- Desktop reference coordinates are stored as normalized percentages relative to the local scene rather than the browser viewport.
- Each scene owns its variables under a dedicated class, for example `--hero-bagel-x`, `--hero-bagel-y`, `--hero-bagel-w`.
- Backgrounds use crop-preserving `object-fit: cover`; foreground assets use intrinsic aspect ratios and `clamp()` sizes. `object-fit: fill` is forbidden for photographic layers.
- `>= 1440px`: measured reference composition.
- `721px–1439px`: independent mid-desktop/tablet arrangement; text and foreground assets reflow without globally scaling the scene.
- `<= 720px`: mobile art direction with vertical content order, full-width CTA controls and separately cropped images.
- `<= 380px`: 16px safe gutters and reduced decorative density; no semantic content is removed.

## Scene contracts

### 1. Hero

Clean café background, independent bagel and latte foregrounds, exact logo crop, independent doodle pack and skyline. Headline, lede, navigation and CTA remain live DOM. Bagel and latte anchor to the photo/table region rather than the viewport.

### 2. Menu

Match the reference headline block, upper-right café-window line illustration, five photo-led cards, arrows, active dot, menu note and bottom skyline. Carousel remains keyboard operable and the final card remains reachable. Food images are clearly reference/decorative art unless verified documentary menu photography exists.

### 3. About

Match the large left headline and two paragraphs, four bordered benefits, right-side interior background, independent cinnamon-roll/latte foreground and organic seam. Benefits use exact or regenerated illustration assets while their labels remain DOM text.

### 4. Visit formats

Match the upper-left headline/copy, upper-right line illustration, three evenly weighted bordered photo cards and bottom skyline. Each card has an independent photo crop, icon, heading and body.

### 5. Events

Match the left headline/copy, three event cards, right-side social café background, independent cake/latte foreground and reference doodles. Cards remain semantic articles; VK remains an external CTA rather than a source of unverified facts.

### 6. Locations

Match the left headline/copy and two address cards, the upper-right illustrated Samara map, lower-right interior photo, organic seams, route markers and bottom skyline. Address cards and route/contact actions remain real accessible controls. The decorative map is not presented as an interactive or geographically exact map; route links open Yandex Maps.

## Typography

- Obtain project-local, redistributable webfont files for the closest reference handwritten and script families, then load them with `@font-face`; do not depend on fonts merely installed on the development computer.
- Tune weight, optical size, line height, tracking and selective `scaleX()` per role instead of rasterizing headings.
- Italic/bold button treatment must match the reference but preserve readable contrast and focus indicators.
- Keep the exact reference logo as a transparent raster mark because ImageGen cannot guarantee letter-perfect branding.

## Provenance

The media registry distinguishes:

- `decorative-reference-edit`: ImageGen edit derived from a supplied design reference.
- `decorative-reference-extract`: mechanical crop/alpha extraction from a supplied reference.
- `decorative-generated`: new synthetic supporting art.
- `documentary`: visually verified public venue photography.

Reference edits and generated assets must never be described as documentary photos of White Cup. Generated food is visual menu art, not proof of actual presentation or availability.

## Testing and verification

- TDD locks the five-layer scene contract, semantic copy, media provenance, responsive `<picture>` sources, absence of full-reference runtime images, carousel keyboard behavior and fallback loading.
- Browser verification is performed only in the Codex in-app Browser at 1920×1080, 1536×864, 390×844 and 320×568.
- Each scene gets a reference/current comparison image plus DOM measurements for overflow, anchors and critical bounds.
- `prefers-reduced-motion`, keyboard navigation, visible focus, one `h1`, heading order, useful alt text and decorative `aria-hidden` markers remain mandatory.

## Acceptance

The task is complete only when all six reference scenes—not only the hero—have saved in-app Browser evidence and no P0/P1 visual discrepancy in composition, typography, imagery, spacing or controls. Any deliberate difference is recorded with its reference behavior, implementation and reason.
