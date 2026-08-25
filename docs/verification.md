# White Cup — проверка релизной сборки

Это запись фактических проверок финальной послойной реконструкции шести supplied-reference экранов. Browser-доказательства сняты только во встроенном браузере Codex с локального сервера `http://127.0.0.1:4175/`.

## Автоматические проверки

Последний полный прогон 25 августа 2026 после финальных послойных правок, точных title-extract слоёв для всех сцен, чистки ассетов, About plate v2 и mobile-проверок:

- [x] `npm.cmd test -- --run --pool=threads --maxWorkers=1` — 17 файлов, 96 тестов прошли.
- [x] `npm.cmd run build` — TypeScript + Vite production build прошли.
- [x] `git diff --check` — прошёл; показал только ожидаемые предупреждения LF→CRLF, whitespace-ошибок нет.
- [x] Проверка manifest-ассетов — 65 явных `/media/...` URL из `src/data/media.ts` и 7 шаблонов динамических путей разрешаются без пропусков; retired POC/old pastry-файлы отсутствуют в `public/media`.

## Встроенный браузер Codex

Для каждого viewport каждая сцена открывалась отдельным hash URL, дожидалась завершения отрисовки и фиксировалась в `docs/evidence/layered-reconstruction/`.

| Viewport | Evidence | Фактически проверено | Статус |
| --- | --- | --- | --- |
| 1920×1080 | `release-{hero,menu,about,visit,events,locations}-1920x1080.png`, `continuity-polish-hero-1920x1080.png` и `continuity-polish-bridge-menu-1920x1080.png` | Шесть desktop-сцен, title-extract слои и видимые foreground-слои загрузились; `clientWidth = scrollWidth = 1905`, один H1 | [x] |
| 1536×864 (эквивалент 1920×1080 при 125% zoom) | `release-{hero,menu,about,visit,events,locations}-1536x864.png`, `continuity-polish-locations-1536x864.png` и `continuity-polish-events-1536x864.png` | Проверены art-directed desktop crops без чрезмерного масштаба, карта/interior слои видимы, `1521 = 1521` | [x] |
| 390×844 | `release-{hero,menu,about,visit,events,locations}-390x844.png` | Отдельный mobile layout, читаемые карточки и CTA, `375 = 375`, без горизонтального overflow | [x] |
| 320×568 | `release-{hero,menu,about,visit,events,locations}-320x568.png` | Safe mobile gutters, CTA не обрезаны по горизонтали; на всех шести сценах `scrollWidth = clientWidth = 305` | [x] |

Дополнительные визуальные сводки:

- release-серия: 24 `release-*.png` кадра, по шесть сцен на каждом из четырёх viewport;
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
- [x] Между каждой парой экранов присутствует inert `SceneBridge` с responsive route-art; границы сцен больше не зависят от одной жёсткой линии. Compact rail навигации плавно переходит из hero-профиля, а deep-link получает отложенное выравнивание после загрузки media.

## Независимые проверки

- [x] Независимые subagent-ревью провели отдельную проверку Hero, Menu, Events и Locations; принятые P1 по hero-тексту, underline, foreground geometry, mobile overflow и map/card icons устранены до финального IAB-прохода.
- [x] Antigravity Worker запускался трижды в read-only режиме. Первые и третий job завершились внутренней ошибкой без output, второй был отклонён менеджером из-за несовместимой пары model/effort; `doctor` подтвердил установленный runner. Это **не** считается Antigravity PASS и не подменяет независимые subagent/IAB проверки.

## Ограничения достоверности

- VK-группа остаётся внешним CTA: VK-only факты и цены не используются без визуальной проверки доступных публикаций.
- Декоративные reference edits/extracts и ImageGen assets не являются документальными фотографиями заведения или меню. Документальные Yandex фото описаны отдельно в `src/data/media.ts`.
- Наличие, цены и второй график должны уточняться перед коммерческой публикацией.
