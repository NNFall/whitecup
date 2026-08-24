# White Cup hero — measured reference grid

Canonical source: supplied local reference PNG, `1672 × 941` px. The live hero keeps semantic text and controls in the DOM; the photographic right panel, extracted doodles, logo, and skyline are decorative reference-art layers with explicit provenance.

The ratios below are the coordinate contract used by the desktop CSS. Values are measured from the visible source artwork and rounded to four decimals; `x`/`y` are top-left coordinates and `w`/`h` are dimensions.

| Element | Source rectangle (px) | Normalized ratio (`x / 1672`, `y / 941`, `w / 1672`, `h / 941`) |
| --- | ---: | ---: |
| Logo badge | `56, 45, 139, 139` | `0.0335, 0.0478, 0.0831, 0.1477` |
| Navigation row | `263, 88, 640, 34` | `0.1573, 0.0935, 0.3828, 0.0361` |
| H1 block | `87, 216, 722, 278` | `0.0520, 0.2295, 0.4320, 0.2954` |
| H1 underline | `438, 467, 364, 26` | `0.2620, 0.4963, 0.2177, 0.0276` |
| Lead paragraph | `93, 512, 405, 83` | `0.0556, 0.5441, 0.2422, 0.0882` |
| Primary CTA | `92, 630, 274, 71` | `0.0550, 0.6695, 0.1639, 0.0755` |
| Quiet CTA | `396, 630, 256, 71` | `0.2368, 0.6695, 0.1531, 0.0755` |
| Café seam, top anchor | `1240, 0` | `0.7416, 0` |
| Café seam, lower anchor | `760, 941` | `0.4545, 1` |
| Doodle route/cup | `820, 0, 280, 265` | `0.4904, 0, 0.1675, 0.2816` |
| Heart accent | `735, 315, 90, 116` | `0.4396, 0.3347, 0.0538, 0.1233` |
| Skyline illustration | `75, 710, 658, 210` | `0.0449, 0.7545, 0.3935, 0.2232` |

## Implementation notes

- The paper field is `#f9f1e7`; reference ink is near-black and the action orange is sampled as `#df3a06`.
- The right café scene is a mechanical crop of the supplied reference with baked navigation/text fragments painted back to paper before use. It is classified `decorative-reference`, never documentary venue evidence.
- Clouds, bird, route/cup marks, heart, and the skyline are independently alpha-extracted from the same supplied reference. This preserves the exact line weight without duplicating the source's semantic text.
- At mobile widths the composition intentionally reflows to paper-first copy, full-width CTAs, and a scene below the content. Non-essential full-frame doodles are hidden to avoid a distorted overlay and preserve reading order.
- Small coordinate drift from browser scrollbar gutters and local font rasterization is expected; DOM bounds and the four screenshots in `docs/evidence/reference-reconstruction/` are the release evidence.
