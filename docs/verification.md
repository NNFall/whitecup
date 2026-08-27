# White Cup — проверка continuity polish

Эта запись фиксирует текущий source-level и browser-level gate для continuity
polish: стабильную шапку, мягкие CSS-мосты, восьмипозиционный loop меню,
независимые сетки Events/Locations и отдельную mobile-композицию.

## Что проверено по текущему коду

- [x] Bridge — pure CSS paper layer и небольшой CSS marker; route/ticket/raster
  artwork и bridge `<img>` отсутствуют, корень inert (`aria-hidden` и
  `pointer-events: none`).
- [x] Menu — 8 логических позиций, три физические копии
  `leading/middle/trailing`; только middle copy доступна assistive technology,
  стрелки, keyboard и native scrolling замыкаются по modulo.
- [x] Mobile hero — backdrop сдвинут ниже copy/actions, copy и CTA получают
  собственный stacking order, quiet CTA непрозрачна.
- [x] Navigation — bounded paper rail остаётся на одном origin; reference и
  compact desktop-профили полностью непрозрачны, mobile rail не просвечивает.

## Автоматический gate (27 августа 2026)

- [x] `npm.cmd test -- --run` — **30 файлов / 194 теста**, все прошли.
- [x] `npm.cmd run build -- --base=/site/whitecup/` — **PASS**; проверены 3
  локальных шрифта, Vite 8.2.2, 43 модуля.
- [x] `git diff --check` — **PASS**; остаются только стандартные предупреждения
  нормализации LF→CRLF от Git на Windows.
- [x] В runtime нет публичных `poc`/`legacy` медиа; все 48 уникальных путей
  из manifest разрешаются, новые responsive WebP меню включены в release-list.

## Встроенный браузер Codex (post-fix IAB pass)

Проверка выполнена только во встроенном браузере Codex, без внешнего Chrome.
На каждом размере проверялись скриншот, якоря, горизонтальный overflow и
пересечения слоёв.

| Viewport | Результат |
| --- | --- |
| 1920×1080 | Hero reference-faithful; rail 1248×64, opacity 1; один h1, CTA и photo-layer не пересекаются. |
| 1648×912 | Compact rail полностью opaque (`rgb(251,247,240)`), без ghosting; About/Visit/Events/Locations приземляются под rail. |
| 1920×800 / 1920×720 | Menu/Events/Locations получают intrinsic runway; title→intro→cards идут последовательно, нижний текст не обрезается. |
| 1536×720 / 1440×568 | Low-height guards сохраняют сетку, карточки и actions внутри сцены; clipping не обнаружен. |
| 390×844 / 320×568 | Одноколоночный flow, CTA hero выше backdrop, полные описания меню, горизонтального overflow нет. |

Дополнительные live-метрики:

- [x] `document.documentElement.scrollWidth === viewport width` на всех восьми
  размерах; console errors/warnings — `[]`.
- [x] Hash-переходы `#menu`, `#about`, `#visit`, `#events`, `#locations`,
  `#contact` оставляют заголовок примерно на 80–94px ниже rail.
- [x] Events и Locations собраны из независимых paper/photo/map/cards layers;
  desktop и mobile bounding-box pass не показал overlap.
- [x] Menu loop: 10 последовательных next-переходов дают
  `02→03→04→05→06→07→08→01→02→03`; previous с первой позиции возвращает
  `08/08`. Карточки используют sharp responsive `srcset` (480/768), описания
  не зажаты line-clamp.
- [x] Reduced-motion правила отключают transitions/animations для nav, bridges,
  reveals и carousel.

Supporting frames в `docs/evidence/layered-reconstruction/` остаются локальными
доказательствами визуального прохода и не включаются в production commit.

## Поведение и provenance

- [x] Former title extracts остаются authoring/provenance evidence; живые DOM
  headings и локальные font assets остаются runtime-источником.
- [x] Bridge marker и paper имеют `local-css`/decorative provenance и не
  подменяют documentary venue photos.
- [x] Generated menu additions остаются decorative reference-art; цена без
  подтверждения использует «Актуальная цена — в меню».
- [x] Hero, Events и Locations разделены на независимые слои; documentary
  interior фото монтируются отдельно от generated/reference artwork.

## Независимые проверки

- [x] Локальные subagent reviews завершены: navigation, bridge, menu loop,
  low-height, scene grid и mobile hero проверены отдельными агентами.
- [x] Antigravity Worker — выполнен read-only release report; source-файлы не
  менял. Его результат учитывался как дополнительный обзор, но не заменяет
  локальный gate и IAB evidence.

## Ограничения достоверности

- VK-группа остаётся внешним CTA: VK-only факты и цены не используются без
  визуальной проверки доступных публикаций.
- Декоративные reference edits/extracts и ImageGen assets не являются
  документальными фотографиями заведения или меню. Документальные Yandex фото
  описаны отдельно в `src/data/media.ts`.

## Публикация

- [ ] Commit/push, remote SHA, deployment и public URL — выполняются после
  staging явного release-list и финального production smoke.
