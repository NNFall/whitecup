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

## Автоматический gate (28 августа 2026, heading rebuild)

- [x] `npm.cmd test -- --run` — **32 файла / 241 тест**, все прошли (включая
  phrase-level heading contracts).
- [x] `npm.cmd run build -- --base=/site/whitecup/` — **PASS**; проверены 3
  локальных шрифта, Vite 8.2.2, 44 модуля.
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
| 1920×1080 | Hero reference-faithful; full-bleed rail x=0/y=0, h≈64, opacity 1; один h1, CTA и photo-layer не пересекаются. |
| 1648×912 | Compact rail полностью opaque (`rgb(251,247,240)`), без ghosting; About/Visit/Events/Locations приземляются под rail. |
| 1920×800 / 1920×720 | Menu/About/Visit/Events/Locations получают low-height runway; title→intro→cards идут последовательно, нижний текст не обрезается. |
| 1920×640 / 1920×568 | Ultra-short wide guard поднимает About heading и опускает Visit intro; title→intro зазоры остаются положительными, карточки не пересекают копирайт. |
| 1920×864 / 1680×900 / 1536×864 | Enlarged live headings keep positive title→intro gaps; Visit guard проверен на wide и medium desktop bands. |
| 1536×720 / 1440×568 | Low-height guards сохраняют сетку, карточки и actions внутри сцены; clipping не обнаружен. |
| 390×844 / 320×568 | Одноколоночный flow, CTA hero выше backdrop, полные описания меню, горизонтального overflow нет. |
| 1024×720 / 1100×720 | Узкие desktop guards переводят Events/Locations на fluid tracks; photo/map/cards не выходят за сцену. |

Отдельный heading-sweep текущего локального `4175` подтверждён в IAB на
1920×1080, 1920×864, 1920×720, 1920×640, 1920×568, 1680×900, 1536×864,
1536×720, 1440×864, 1440×568, 1024×720, 1100×720, 390×844 и 320×568: все шесть сцен отрисованы
живым текстом, `document.documentElement.scrollWidth` совпадает с clientWidth,
а title→intro зазоры остаются положительными (примерно 3–122px desktop и
20–28px mobile; About intro→cards и Visit card band проверены визуально без
painted overlap).

Дополнительные live-метрики:

- [x] `document.documentElement.scrollWidth === viewport width` на всех
  проверенных desktop/mobile размерах; console errors/warnings — `[]`.
- [x] Menu skyline на desktop сохраняет natural ratio 1200:242 (`object-fit:
  contain`), получает только мягкое grayscale/brightness-приглушение для
  читаемости и отделён от footer-note явным gap (IAB: 11.8px на 1920×1080,
  22.6px на 1648×912, 93.8px на 1024×720); mobile-слой остаётся в normal flow.
- [x] Bridge paper проверен как neutral ivory/paper gradient с petrol edge;
  прежний красный/orange wash удалён из базового слоя, orange оставлен только
  локальным маркером.
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
- [x] Heading typography pass: baseline кадры сохранены в
  `docs/evidence/headings-before/`, свежие after-кадры — в
  `docs/evidence/headings-rebuild/` (включая low-height About/Visit), а A/B-кадры Neucha/Pangolin — в
  `docs/evidence/font-ab/`. Phrase-level spans, Neucha display, Marck Script
  accents и mobile reset проверены focused/full тестами. Hero/menu/about
  after-кадры сняты только в Codex In-app Browser на 1920×1080; hero/menu/about
  mobile кадры — на 390×844, дополнительная menu-проверка — на 320×568;
  low-height About/Visit кадры — на 1920×864/720/640/568.
- [x] Намеренный overflow ограничен About coffee-cutout внутри frame и
  внутренним native-scroll Menu; горизонтального overflow страницы нет.

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

- [x] Continuity-polish source tree зафиксирован в локальной release-цепочке
  коммитов; старый production SHA не используется как evidence для текущего
  source tree.
- [x] Production build с base `/site/whitecup/` распакован в `/root/whitecup`;
  `nginx -t` успешен; для неизменяемого static alias reload не требовался.
  Nginx вывел только существующие duplicate-server-name warnings, без ошибок
  конфигурации.
- [x] Public smoke (heading-refinement release):
  `https://kaigo.space/site/whitecup/` отвечает HTTP 200 и отдаёт
  `/site/whitecup/assets/index-CXUElulJ.js` и
  `/site/whitecup/assets/index-DBiOSl7I.css`; обе ссылки отвечают HTTP 200.
- [x] Опубликованный URL повторно проверен только в Codex IAB: 1920×1080 —
  full-bleed rail x=0/y=0, h=64, display-фразы и script-акцент загружены;
  390×844 — live-heading, обе CTA и mobile reset. На обоих размерах overflow
  `0`, один `h1`, console errors/warnings — `[]`.
- [x] Публичные узкие desktop viewport 1024×720 и 1100×720 проверены в IAB:
  Events/Locations internal overflow `0`, document overflow `0`.
- [x] GitHub/remote SHA проверен после push и совпал с локальным release HEAD
  на момент проверки: `cbbc471eb53c37b8aab4f5714ebe37b52739fd7d`.
  Локальный сервер для повторной проверки — `http://127.0.0.1:4175/`.
