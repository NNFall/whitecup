# White Cup — проверка релизной сборки

Это запись фактических проверок финальной послойной реконструкции шести supplied-reference экранов. Browser-доказательства сняты только во встроенном браузере Codex с локального сервера `http://127.0.0.1:4175/`.

## Автоматические проверки

Последний полный прогон 26 августа 2026 после mobile-rhythm и desktop-continuity правок, low-height guards для всех сцен и финальной проверки переходов:

- [x] `npm.cmd test -- --run --pool=threads --maxWorkers=1` — 18 файлов, 111 тестов прошли.
- [x] Focused desktop continuity follow-up — 7 файлов, 56 тестов прошли.
- [x] `npm.cmd run build` — TypeScript + Vite production build прошли в release gate.
- [x] `git diff --check` — прошёл; показал только ожидаемые предупреждения LF→CRLF, whitespace-ошибок нет.
- [x] Проверка manifest-ассетов — runtime-ссылки и responsive/dynamic templates из `src/data/media.ts` разрешаются без пропусков; retired POC/old pastry-файлы отсутствуют в `public/media`.

## Встроенный браузер Codex

Для каждого viewport каждая сцена открывалась отдельным hash URL, дожидалась завершения отрисовки и фиксировалась в `docs/evidence/layered-reconstruction/`.

| Viewport | Evidence | Фактически проверено | Статус |
| --- | --- | --- | --- |
| 1920×1080 | `release-{hero,menu,about,visit,events,locations}-1920x1080.png`, `final-check-hero-1920x1080.png`, `final-check-contact-1920x1080.png` | Шесть desktop-сцен, title-extract слои, foreground-слои и footer bridge загрузились; `clientWidth = scrollWidth = 1905`, один H1 | [x] |
| 1536×864 (эквивалент 1920×1080 при 125% zoom) | `release-hero-1536x864.png`, `release-menu-1536x864.png`, `release-visit-1536x864.png`, `recheck-locations-1536x864.png` | Проверены art-directed desktop crops без чрезмерного масштаба, карта/interior слои видимы, `1521 = 1521` | [x] |
| 390×844 | `final-check-clean-hero-390x844.png`, `final-check-clean-menu-390x844.png`, `final-check-clean-about-390x844.png`, `final-check-clean-visit-390x844.png`, `final-check-clean-events-390x844.png`, `final-check-clean-locations-390x844.png`, `final-check-clean-contact-390x844.png` | Отдельная mobile-композиция, читаемые карточки и CTA, `375 = 375`, без горизонтального overflow | [x] |
| 320×568 | `final-check-hero-320x568.png`, `recheck-menu-320x568.png` | Safe mobile gutters, обе hero CTA доступны, `scrollWidth = clientWidth = 305`; `#menu` начинается под header offset | [x] |
| 721×900 и 1024×900 | `final-check-hero-721x900.png`, `final-check-hero-1024x900.png` | Tablet/compact-desktop breakpoint переходят в цельную композицию без CTA collision и page overflow | [x] |
| 1440/1536/1920 × 568/640/720/800 | IAB metric sweep, low-height guard pass | Для About, Events, Locations и Visit title→intro, intro→cards и card-copy gaps положительные; Visit descriptions остаются внутри карточек, authored overflow отсутствует | [x] |

Дополнительные визуальные сводки:

- историческая `release-*.png` серия сохранена как базовая сводка, а current final frames для этого прохода перечислены выше;
- отдельные low-height after-fix кадры: `final-check-about-1920x720-after.png`, `final-check-events-1920x720-after.png`, `final-check-locations-1920x720-after.png`, `final-check-visit-1920x720-after.png`;
- финальная доступность карусели подтверждена во встроенном браузере на 320px: `scrollLeft = maxScroll = 1061`, фокус остаётся на viewport.

### Поведение и доступность

- [x] Hero собран независимыми слоями: reference-directed clean backdrop, bagel/plate, latte, logo, doodles, route, skyline и отдельный прозрачный underline. Full supplied screenshot не используется как runtime-scene.
- [x] Финальное подчёркивание — alpha-extract оранжевого штриха из supplied hero-reference: `hero-underline-reference-extract-tight.webp`; в hero не осталось SVG.
- [x] Нормальный hero-путь не монтирует documentary fallback и не загружает старый optional food fallback.
- [x] Обычные HTTP изображения каждой видимой сцены имеют `complete=true` и ненулевые natural dimensions. Невидимые lazy duplicate/sliver-карточки меню могут оставаться незагруженными до прокрутки — это не влияет на видимые позиции.
- [x] На 320px `ArrowRight` в keyboard-focusable carousel сдвигает viewport; после последовательных действий достигнута последняя карточка (`scrollLeft = max = 1061`).
- [x] Контекстная desktop/mobile навигация, Escape в mobile menu, anchor-ссылки, phone, VK и Yandex links покрыты тестами и проверялись в браузерном проходе. В release-проходе IAB были считаны `tel:+79372355715`, `https://vk.ru/white_cup` и `https://yandex.ru/maps/org/white_cup/19381755919/menu/`.
- [x] `prefers-reduced-motion` и no-JS Reveal contract покрыты CSS/тестами; Reveal остаётся видимым без JavaScript.
- [x] Для Menu/About/Visit/Events/Locations подключены независимые desktop title-extract слои с measured anchors; живые `h2` остаются для accessibility и mobile.
- [x] Между каждой парой экранов присутствует inert `SceneBridge` с responsive route-art и мягким fade вместо жёсткого divider; compact rail навигации плавно переходит из hero-профиля, а deep-link получает единый header offset и отложенное выравнивание после загрузки media.
- [x] На 320/390/721/1024px проверены authored overflow, CTA collision и вертикальный порядок hero; на 320px страница сохраняет safe gutters и не создаёт горизонтального scroll.
- [x] На desktop low-height 1440/1536/1920px проверены границы About, Events, Locations и Visit; все текстовые блоки и карточки остаются достижимыми, без clipping.

## Независимые проверки

- [x] Независимые subagent-ревью провели отдельную проверку Hero, Menu, Events и Locations; принятые P1 по hero-тексту, underline, foreground geometry, mobile overflow и map/card icons устранены до финального IAB-прохода.
- [x] Antigravity Worker запускался трижды в read-only режиме. Первые и третий job завершились внутренней ошибкой без output, второй был отклонён менеджером из-за несовместимой пары model/effort; `doctor` подтвердил установленный runner. Это **не** считается Antigravity PASS и не подменяет независимые subagent/IAB проверки.

## Ограничения достоверности

- VK-группа остаётся внешним CTA: VK-only факты и цены не используются без визуальной проверки доступных публикаций.
- Декоративные reference edits/extracts и ImageGen assets не являются документальными фотографиями заведения или меню. Документальные Yandex фото описаны отдельно в `src/data/media.ts`.
- Наличие, цены и второй график должны уточняться перед коммерческой публикацией.

## Публикация

- [x] Intended runtime, source, test and selected evidence paths were staged explicitly; unrelated baseline/authoring PNGs remain outside the release commit.
- [x] `origin/master` was pushed and then verified with `git ls-remote`; the returned SHA matched the local `HEAD`.
- [x] Fixed local verification server remains available at `http://127.0.0.1:4175/` and returned HTTP 200 after publication.
