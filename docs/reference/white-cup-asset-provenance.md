# White Cup — provenance послойных сцен

Проверено 25 августа 2026. Визуальный источник hero — supplied screenshot `C:\Users\User\Downloads\3679ac8b-1f0d-40be-b73d-d5246178ba35.png`. Live hero не растягивает этот screenshot: он складывается из независимого background, foreground, logo, doodles, route, skyline, underline и DOM-типографики.

| Production asset | Роль | Источник и обработка | Проверка / классификация |
| --- | --- | --- | --- |
| `public/media/hero-clean-base-v2-{960,1672}.webp` | clean café/backdrop | Image Generation Skill edit supplied reference: из prompt удалены навигация, текст, logo, doodles, bagel и cup; raw authoring PNG сохранён в `docs/reference/assets/hero-clean-base-v2-authoring.png` | responsive WebP, `decorative-reference-edit`; не documentary photo |
| `public/media/hero-bagel-plate-reference-edit-{720,1200}.webp` | bagel + printed paper + full plate | Image Generation Skill edit: предмет помещён на chroma field; exact chroma alpha extraction; raw input в `docs/reference/assets/hero-bagel-plate-magenta-authoring.png` | alpha и dark/paper composites проверены; `decorative-reference-edit`; не menu documentary |
| `public/media/hero-coffee-cutout-{720,1200}.webp` | latte, saucer, spoon | ранее созданный ImageGen reference edit + Remove Background Local; raw authoring PNG перенесён в `docs/reference/assets/hero-coffee-cutout-authoring.png` | отдельный transparent foreground, `decorative-reference-edit`; не documentary |
| `public/media/hero-logo-reference.png` | header badge | supplied-reference crop + local alpha extraction | exact 140×142 reference badge; `decorative-reference-extract` |
| `public/media/hero-doodles-exact.png` | clouds, bird, heart, small marks | supplied reference crop + local alpha extraction | transparent 1672×941 decorative canvas; no baked nav/copy |
| `public/media/hero-route-cup-1672.webp` | route and small cup | reference-directed edit + background removal; raw authoring PNG в `docs/reference/assets/hero-route-cup-authoring.png` | `decorative-reference-edit`, not venue evidence |
| `public/media/hero-skyline-exact.png` | skyline and orange sun | supplied reference crop + local alpha extraction | transparent decorative extract; not a map |
| `public/media/hero-underline-reference-extract-tight.webp` | orange underline under `White Cup` | direct crop of supplied reference; only orange pixels retained with local alpha mask; tight WebP derived from `docs/reference/assets/hero-underline-reference-crop-authoring.png` | 364×28 `yuva420p`; exact stroke, no script-copy, no SVG |
| `public/media/about-pastry-plate-reference-edit-v2-{720,1200}.webp` | About: pastry + full patterned plate | Built-in Image Generation Skill edit of the supplied About reference; selected raw authoring PNG is preserved in `docs/reference/assets/about-pastry-plate-v2-authoring.png` | alpha-preserving lossless responsive WebP; `decorative-reference-edit`; not a documentary dish photo |

## Remove Background Local decision

`Remove Background Local` was run against the new chroma bagel/plate variant. It removed part of the white plate, so its output was rejected after visual inspection. The production asset instead uses deterministic chroma alpha extraction, preserving the whole plate and printed paper. This is an intentional quality decision, not an unreported skipped tool.

## Non-runtime experiments

Ранние POC и generated hero-эксперименты перед публикацией удалены из `public/media` и из production registry: они не будут публично раздаваться Vite и не участвуют в runtime. Нужные authoring-оригиналы активных foreground-слоёв сохранены в `docs/reference/assets/`. Для About также отклонены два промежуточных результата: у одного была мягкая полупрозрачная вуаль, а у второго шахматный фон оказался baked; Remove Background Local удалил у него белую тарелку. Они не попали в рабочую директорию и не участвуют в runtime. Documentary Yandex images stay separately typed in `src/data/media.ts` and mount only where their venue role is factual.

All reference edits/extracts above are visual art direction. They must never be described as documentary photos of White Cup, menu availability, prices, or a live map.
