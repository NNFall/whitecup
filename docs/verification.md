# White Cup — проверка релизной сборки

Это запись фактических проверок текущей live-typography polish для послойной
реконструкции White Cup. Browser-доказательства сняты во встроенном браузере
Codex с локального сервера `http://127.0.0.1:4175/`. Отдельная папка
`docs/evidence/live-typography-polish/` не создавалась; ниже перечислены только
существующие supporting frames, а свежие проверки без сохранённого PNG помечены
как текущий IAB proof.

## Автоматические проверки

Последний полный прогон — 27 августа 2026 после live typography, Menu/Events
runway и mobile-carousel правок:

- [x] `npm.cmd test -- --run --pool=threads --maxWorkers=1` — 25 файлов, 170 тестов прошли.
- [x] `npm.cmd run build` — prebuild подтвердил 3 обязательных font assets; TypeScript и Vite production build прошли.
- [x] `git diff --check` — код возврата 0; только ожидаемые предупреждения LF→CRLF, whitespace-ошибок нет.

## Встроенный браузер Codex

### Standard IAB Hero

| Viewport | Существующий supporting frame | Фактически проверено | Статус |
| --- | --- | --- | --- |
| 1920×1080 | `docs/evidence/layered-reconstruction/continuity-polish-hero-1920x1080.png` | Hero IAB pass: живой H1, слои и header без title/copy overlap | [x] |
| 1536×864 | `docs/evidence/layered-reconstruction/continuity-final-hero-1536x864.png` | Hero IAB pass на desktop zoom-equivalent viewport, без clipping | [x] |
| 390×844 | `docs/evidence/layered-reconstruction/continuity-polish-hero-390x844.png` | Отдельная mobile-композиция, живой H1, safe gutters и без horizontal overflow | [x] |
| 320×568 | `docs/evidence/layered-reconstruction/continuity-polish-hero-320x568.png` | Compact mobile hero, CTA доступны, заголовок не обрезается | [x] |

### Carousel и low-height runways

- [x] Mobile carousel next pass подтверждён во встроенном браузере на 320×568 и
  390×844; на 320×568 обе 44px стрелки полностью попадают в первый viewport;
  существующие supporting frames:
  `docs/evidence/layered-reconstruction/recheck-menu-320x568.png` и
  `docs/evidence/layered-reconstruction/recheck-menu-390x844.png`.
- [x] Low-height IAB metric sweep после Menu/Events runway правок:
  `1920×800`, `1920×720`, `1920×640`, `1920×568`, `1536×720`, `1536×640`
  и `1440×568`. На каждом viewport
  title→intro, intro→cards и card-copy gaps положительные; title/intro/card
  overlap и clipping не обнаружены.
- [x] Для `1920×720` сохранены существующие after-fix кадры:
  `docs/evidence/layered-reconstruction/final-check-about-1920x720-after.png`,
  `docs/evidence/layered-reconstruction/final-check-events-1920x720-after.png`,
  `docs/evidence/layered-reconstruction/final-check-locations-1920x720-after.png`
  и `docs/evidence/layered-reconstruction/final-check-visit-1920x720-after.png`.
  Для `1920×800`, `1536×720` и `1440×568` текущий proof — IAB metric output
  без отдельного сохранённого PNG.

## Поведение и доступность

- [x] Все шесть сцен используют живые DOM `h1`/`h2`; бывшие
  `title-reference`/title-extract слои не монтируются runtime. Extract/crop
  файлы остаются только authoring/provenance evidence.
- [x] Display headings загружают локальный `White Cup Display` (Neucha,
  Cyrillic WOFF2); body/nav и короткие script-акценты сохраняют свои локальные
  family tokens. Provenance и OFL-лицензия записаны в `docs/font-licenses.md`.
- [x] Hero underline рисуется DOM/CSS-декорацией под живым текстом; прежний
  underline image больше не является runtime-источником.
- [x] Menu carousel использует реальный offset следующей карточки, сохраняет
  keyboard/arrow controls и проходит mobile next-card IAB check.
- [x] Scene bridges остаются inert, header/anchor continuity и reduced-motion
  contracts покрыты текущим тестовым прогоном.
- [x] На standard IAB Hero и low-height runways не обнаружены title/intro/card
  overlap, clipping или authored horizontal overflow.

## Независимые проверки

- [x] Локальный полный тестовый прогон и IAB проверки выполнены; отдельные
  review notes учитывались в текущем worktree.
- Antigravity Worker — только attempted/terminated: запуски не дали пригодного
  результата (ошибка/отклонение/завершение без output). Это не Antigravity PASS и
  не заменяет локальные тесты или IAB proof.

## Ограничения достоверности

- VK-группа остаётся внешним CTA: VK-only факты и цены не используются без
  визуальной проверки доступных публикаций.
- Декоративные reference edits/extracts и ImageGen assets не являются
  документальными фотографиями заведения или меню. Документальные Yandex фото
  описаны отдельно в `src/data/media.ts`.
- Наличие, цены и второй график должны уточняться перед коммерческой
  публикацией.

## Публикация

- [x] Локальные test, build и diff-check gates пройдены; перечисленные
  supporting evidence paths существуют в `docs/evidence/layered-reconstruction/`.
- [ ] Commit/push и проверка remote SHA/public URL — pending. Текущий polish
  остаётся в рабочем tree; публикация из этого состояния не заявляется.
