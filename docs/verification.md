# White Cup — чеклист проверки

Этот файл — рабочая запись доказательств, а не декларация результата. Галочки напротив браузерных пунктов ставятся только после фактического запуска `127.0.0.1:4175`, проверки во встроенном браузере и сохранения соответствующего скриншота в `docs/evidence/`.

## Автоматические проверки

Последний локальный прогон после reference-reconstruction и release-документации (24 августа 2026):

- [x] `npm test -- --run` — 7 файлов, 21 тест прошёл.
- [x] `npm run build` — TypeScript + Vite production build.
- [x] `git diff --check` — без whitespace-ошибок.
- [x] Повторный прогон выполнен после финальных visual polish правок и ограничения ширины мобильных заголовков.

## Браузерные доказательства

Запустить фиксированный сервер:

```powershell
npm run dev
```

| Viewport | Скриншот | Проверить | Статус |
| --- | --- | --- | --- |
| 1920×1080 | `docs/evidence/reference-reconstruction/hero-iab-1920-final.png` | первый экран, пять пунктов навигации, source-derived café crop, точные doodles/heart/pin и skyline | [x] verified in Codex in-app Browser |
| 390×844 | `docs/evidence/reference-reconstruction/hero-iab-390-final.png` | отдельная мобильная композиция, paper-first copy, scene below CTA, full-width actions | [x] verified in Codex in-app Browser |
| 320×568 | `docs/evidence/reference-reconstruction/hero-iab-320-final.png` | нет горизонтального overflow, читаемые заголовки, safe 16px gutters | [x] verified in Codex in-app Browser |
| 1536×864 (125% equivalent) | `docs/evidence/reference-reconstruction/hero-iab-1536-final.png` | hero не становится чрезмерным, copy/CTA остаются в viewport при уменьшенной CSS-высоте | [x] verified in Codex in-app Browser |

Для каждого viewport зафиксировать:

- [x] `scrollWidth <= innerWidth` на всех проверенных viewport; in-app Browser DOM показал 1920/1536/390/320 без горизонтального overflow (body `scrollWidth === clientWidth`: 1920, 1536, 390, 320).
- [x] H1, CTA и телефонная ссылка не выходят за viewport; hero bounds проверены через DOM.
- [x] На 390px About/Locations grids и адресные заголовки сжимаются в 303px column; на 320px — в 256px column, без обрезания телефона или адреса.
- [x] Заголовок About также не выходит за границы сцены: 390px `right=339 <= sceneRight=359`, 320px `right=288 <= sceneRight=304`.
- [x] Якоря `#menu`, `#locations`, `#about`, `#events`, `#contact` присутствуют и ведут к одноимённым сценам/футеру.
- [x] Mobile menu открывается с клавиатуры, `Escape` закрывает его, фокус возвращается на кнопку; при открытии фокус на ссылке «Меню».
- [x] В carousel работают `ArrowLeft`/`ArrowRight`, dots и финальная карточка: active `02` после ArrowRight, затем `05`, next disabled.
- [x] Телефон (`tel:+79372355715`), VK и Yandex Maps имеют обычные anchors с проверенными href.
- [x] Нормальный hero-запрос загружает source-derived reference layers и не запрашивает старый `hero-food-cutout.png`; documentary интерьер остаётся отдельным fallback, активируемым только при ошибке reference crop.
- [x] Видимые café crop, logo, doodles и skyline маркированы в DOM как `data-media-kind="decorative-reference"` и `aria-hidden`; documentary интерьер остаётся отдельным fallback.
- [x] Reduced-motion CSS contract сохранён: Reveal immediately visible and global `scroll-behavior: auto` override остаётся в `@media (prefers-reduced-motion: reduce)`; поведение покрыто тестами и статической проверкой CSS.
- [x] Сняты доказательные скриншоты, пути записаны в таблице выше.

## Ограничения доказательств

Фото из VK не считаются проверенными, пока публичная группа не открыта и кадры не просмотрены. Reference-art crop/extracts не считаются документальной фотографией. Реальные цены/наличие и второй график требуют повторной проверки в живом источнике перед коммерческим использованием.
