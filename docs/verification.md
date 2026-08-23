# White Cup — чеклист проверки

Этот файл — рабочая запись доказательств, а не декларация результата. Галочки напротив браузерных пунктов ставятся только после фактического запуска `127.0.0.1:4175`, проверки во встроенном браузере и сохранения соответствующего скриншота в `docs/evidence/`.

## Автоматические проверки

Последний локальный прогон после визуальной полировки и release-документации (23 августа 2026):

- [x] `npm test -- --run` — 7 файлов, 20 тестов прошли.
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
| 1920×1080 | `docs/evidence/refinement/hero-1920-skyline.png` | hero above the fold, exact five-item nav, generated clean panel, heart/pin accents and skyline | [x] verified |
| 390×844 | `docs/evidence/refinement/hero-390-skyline.png` | отдельная мобильная композиция, paper-first copy, image scene below CTA, full-width actions | [x] verified |
| 320×568 | `docs/evidence/refinement/hero-320-skyline.png` | нет горизонтального overflow, читаемые заголовки, safe 16px gutters | [x] verified |
| 1536×864 (125% equivalent) | `docs/evidence/refinement/hero-1536-skyline.png` | hero не становится чрезмерным, copy/CTA остаются в viewport при уменьшенной CSS-высоте | [x] verified |

Для каждого viewport зафиксировать:

- [x] `scrollWidth <= innerWidth` на всех проверенных viewport; browser DOM показал 1920/1536/390/320 без горизонтального overflow (`scrollWidth === clientWidth` в каждой сессии).
- [x] H1, CTA и телефонная ссылка не выходят за viewport; hero bounds проверены через DOM.
- [x] На 390px About/Locations grids и адресные заголовки сжимаются в 303px column; на 320px — в 256px column, без обрезания телефона или адреса.
- [x] Заголовок About также не выходит за границы сцены: 390px `right=339 <= sceneRight=359`, 320px `right=288 <= sceneRight=304`.
- [x] Якоря `#menu`, `#locations`, `#about`, `#events`, `#contact` присутствуют и ведут к одноимённым сценам/футеру.
- [x] Mobile menu открывается с клавиатуры, `Escape` закрывает его, фокус возвращается на кнопку; при открытии фокус на ссылке «Меню».
- [x] В carousel работают `ArrowLeft`/`ArrowRight`, dots и финальная карточка: active `02` после ArrowRight, затем `05`, next disabled.
- [x] Телефон (`tel:+79372355715`), VK и Yandex Maps имеют обычные anchors с проверенными href.
- [x] Нормальный hero-запрос не загружает `hero-food-cutout.png`; fallback получает `src` только при ошибке synthetic clean panel.
- [x] Synthetic clean panel маркирован в DOM как `data-media-kind="decorative-generated"` и `aria-hidden`; documentary интерьер остаётся отдельным fallback.
- [x] При `prefers-reduced-motion: reduce` browser emulation дала `opacity: 1`, `transform: none`, `scroll-behavior: auto`; hero остаётся сразу видимым.
- [x] Сняты доказательные скриншоты, пути записаны в таблице выше.

## Ограничения доказательств

Фото из VK не считаются проверенными, пока публичная группа не открыта и кадры не просмотрены. Синтетический skyline не считается документальной фотографией. Реальные цены/наличие и второй график требуют повторной проверки в живом источнике перед коммерческим использованием.
