# White Cup — проверка continuity polish

Эта запись фиксирует текущий source-level и browser-level gate для continuity
polish: стабильную шапку, мягкие CSS-мосты, восьмипозиционный loop меню,
независимые сетки Events/Locations и отдельную mobile-композицию.

## Что проверено по текущему коду

- [x] Bridge — pure CSS paper layer и небольшой CSS marker; route/ticket/raster
  artwork и bridge `<img>` отсутствуют, корень inert (`aria-hidden` и
  `pointer-events: none`). Переход — прозрачный neutral paper crossfade без
  border, radius и box-shadow, а не отдельная rounded pill-плашка.
- [x] Menu — 8 логических позиций, три физические копии
  `leading/middle/trailing`; только middle copy доступна assistive technology,
  стрелки, keyboard и native scrolling замыкаются по modulo. На 320px dots
  занимают сетку 4×2, note и ссылка на полное меню остаются внутри сцены.
- [x] Mobile hero — backdrop сдвинут ниже copy/actions, copy и CTA получают
  собственный stacking order, quiet CTA непрозрачна.
- [x] Navigation — bounded paper rail остаётся на одном origin; reference и
  compact desktop-профили полностью непрозрачны, mobile rail не просвечивает;
  dialog получает видимый close control 44×44 с корректным focus return.
- [x] Interaction — delayed hash alignment отменяется при wheel/touch/pointer и
  клавишах ручной навигации; новый hash начинает свежий цикл. В меню только
  Left/Right меняют карточку, ArrowUp/ArrowDown проходят в обычную вертикальную
  прокрутку страницы.
- [x] Progressive enhancement — `.reveal` остаётся видимым без JavaScript,
  а script только добавляет enhanced reveal; reduced-motion отключает motion.

## Автоматический gate (30 августа 2026, final flagship polish)

- [x] `npm.cmd test -- --run` — **34 файла / 254 теста**, все прошли (включая
  interaction, bridge, mobile-close, contrast и no-JS contracts).
- [x] Обычный `npm.cmd run build` — **PASS**; Vite 8.2.2, 44 модуля,
  `index` 4.94 kB (gzip 1.84 kB), `index-eX-9paHg.css` 140.65 kB
  (gzip 24.68 kB), `index-C4XKDxmQ.js` 266.23 kB (gzip 77.41 kB).
  Production base по умолчанию `/site/whitecup/`, локальная разработка
  остаётся на `/`.
- [x] `git diff --check` — **PASS**; остаются только стандартные предупреждения
  нормализации LF→CRLF от Git на Windows.
- [x] В runtime нет публичных `poc`/`legacy` медиа; все 48 уникальных путей
  из manifest разрешаются, новые responsive WebP меню включены в release-list.

## Встроенный браузер Codex (fresh local flagship pass)

Проверка выполнена только во встроенном браузере Codex, без внешнего Chrome.
На каждом размере проверялись скриншот, якоря, горизонтальный overflow и
пересечения слоёв.

| Viewport | Результат |
| --- | --- |
| 1920×1080 | Hero reference-faithful; full-bleed rail x=0/y=0, h≈64, opacity 1; один h1, CTA и photo-layer не пересекаются; document overflow `0`; bridge computed `border-style: none / border-radius: 0 / box-shadow: none`. |
| 1648×912 | Compact rail полностью opaque (`rgb(251,247,240)`), без ghosting; About/Visit/Events/Locations приземляются под rail. |
| 1920×800 / 1920×720 | Menu/About/Visit/Events/Locations получают low-height runway; title→intro→cards идут последовательно, нижний текст не обрезается. |
| 1920×640 / 1920×568 | Ultra-short wide guard поднимает About heading и опускает Visit intro; title→intro зазоры остаются положительными, карточки не пересекают копирайт. Свежий target pass на 1920×568: document overflow `0`, neutral bridge computed `none / 0 / none`, console `[]`. |
| 1920×864 / 1680×900 / 1536×864 | Enlarged live headings keep positive title→intro gaps; Visit guard проверен на wide и medium desktop bands. |
| 1536×720 / 1440×568 | Low-height guards сохраняют сетку, карточки и actions внутри сцены; clipping не обнаружен. |
| 390×844 | Одноколоночный flow, CTA hero выше backdrop, полные описания меню, горизонтального overflow нет; открытие mobile dialog переводит focus на видимый close 44×44 и возвращает его trigger после закрытия. |
| 320×568 | Одноколоночный flow без document overflow; menu pagination укладывается в 4×2, note/link не выходят из сцены, CTA и close control достижимы. |
| 1024×720 | Узкие desktop guards переводят Events/Locations на fluid tracks; photo/map/cards не выходят за сцену, document overflow `0`. |

Отдельный heading-sweep текущего локального `4175` подтверждён в IAB на
1920×1080, 1920×864, 1920×720, 1920×640, 1920×568, 1680×900, 1536×864,
1536×720, 1440×864, 1440×568, 1024×720, 1100×720, 390×844 и 320×568: все шесть сцен отрисованы
живым текстом, `document.documentElement.scrollWidth` совпадает с clientWidth,
а title→intro зазоры остаются положительными (примерно 3–122px desktop и
20–28px mobile; About intro→cards и Visit card band проверены визуально без
painted overlap).

Дополнительные live-метрики:

- [x] Свежий target sweep на `1920×1080`, `1920×568`, `1024×720`, `390×844`
  и `320×568`: `document.documentElement.scrollWidth === viewport width`;
  console errors/warnings — `[]`.
- [x] Menu skyline на desktop сохраняет natural ratio 1200:242 (`object-fit:
  contain`), получает только мягкое grayscale/brightness-приглушение для
  читаемости и отделён от footer-note явным gap (IAB: 11.8px на 1920×1080,
  22.6px на 1648×912, 93.8px на 1024×720); mobile-слой остаётся в normal flow.
- [x] Bridge paper проверен как transparent neutral ivory/paper crossfade без
  border/radius/shadow; computed-сигнатура — `none / 0 / none`. Прежний
  красный/orange wash и boxed pill удалены из базового слоя.
- [x] Hash-переходы `#menu`, `#about`, `#visit`, `#events`, `#locations`,
  `#contact` оставляют заголовок примерно на 80–94px ниже rail.
- [x] Events и Locations собраны из независимых paper/photo/map/cards layers;
  desktop и mobile bounding-box pass не показал overlap.
- [x] Menu loop: 10 последовательных next-переходов дают
  `02→03→04→05→06→07→08→01→02→03`; previous с первой позиции возвращает
  `08/08`. Карточки используют sharp responsive `srcset` (480/768), описания
  не зажаты line-clamp.
- [x] На 320px dots проверены как 4×2, footer note и external full-menu link
  остаются в границах сцены; vertical carousel arrows не перехватывают page
  scroll.
- [x] Reduced-motion правила отключают transitions/animations для nav, bridges,
  reveals и carousel.
- [x] `--orange-action: #c93608` проверен для обычного текста и filled controls:
  контраст на paper — **4.90:1**; декоративный крупный orange token сохранён.
- [x] Production base проверен по обычной команде: `/site/whitecup/` для
  production assets, root `/` для local dev.
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
- [x] Итоговые локальные IAB evidence сохранены в
  `docs/evidence/final-flagship-polish/`: `desktop-hero-1920x1080.png`,
  `desktop-menu-about-1920x1080.png`, `mobile-menu-footer-320x568.png`,
  `mobile-nav-open-390x844.png`, `mobile-contact-320x568.png`; это намеренные
  release evidence, их можно включить в commit.

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
- [ ] Antigravity Worker — предприняты две попытки, обе завершились внешней
  eligibility/network ошибкой; release report недоступен и не является
  release gate. Доказательством остаются независимые Codex subagent reviews,
  локальный full gate и IAB evidence.

## Ограничения достоверности

- VK-группа остаётся внешним CTA: VK-only факты и цены не используются без
  визуальной проверки доступных публикаций.
- Декоративные reference edits/extracts и ImageGen assets не являются
  документальными фотографиями заведения или меню. Документальные Yandex фото
  описаны отдельно в `src/data/media.ts`.

## Публикация

- [ ] Commit and push to GitHub are pending final staging; remote SHA is not
  release evidence yet.
- [ ] Production deploy to `/root/whitecup`, nginx verification and compression
  headers are pending.
- [ ] Public smoke and public IAB verification are pending; current evidence is
  local-only and must not be presented as the deployed site.
- [ ] Remote SHA check with `git ls-remote origin refs/heads/master` is pending.

Локальный сервер для повторной проверки: `http://127.0.0.1:4175/`.
