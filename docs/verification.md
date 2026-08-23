# White Cup — чеклист проверки

Этот файл — рабочая запись доказательств, а не декларация результата. Галочки напротив браузерных пунктов ставятся только после фактического запуска `127.0.0.1:4175`, проверки во встроенном браузере и сохранения соответствующего скриншота в `docs/evidence/`.

## Автоматические проверки

Последний локальный прогон после визуальной полировки и release-документации (23 августа 2026):

- [x] `npm test -- --run` — 7 файлов, 18 тестов.
- [x] `npm run build` — TypeScript + Vite production build.
- [x] `git diff --check` — без whitespace-ошибок.
- [x] Повторный прогон выполнен после финальных visual polish правок.

## Браузерные доказательства

Запустить фиксированный сервер:

```powershell
npm run dev
```

| Viewport | Скриншот | Проверить | Статус |
| --- | --- | --- | --- |
| 1920×1080 | `docs/evidence/desktop-1920-hero.png`, `desktop-1920-full-reduced-motion.png` | hero above the fold и full-page сцены с immediately-visible reduced-motion content | [x] verified |
| 390×844 | `docs/evidence/mobile-390-hero.png`, `mobile-390-menu.png`, `mobile-390-full-reduced-motion.png` | отдельная мобильная композиция, menu snap, адреса без clipping, full-width CTA | [x] verified |
| 320×568 | `docs/evidence/mobile-320-hero.png`, `mobile-320-menu.png`, `mobile-320-full-reduced-motion.png` | нет горизонтального overflow, читаемые заголовки, карточка 260px и обе локации | [x] verified |

Для каждого viewport зафиксировать:

- [x] `scrollWidth <= innerWidth` на всех трёх viewport; на 390px `scrollWidth === clientWidth === 375` из-за 15px классического scrollbar, горизонтального overflow нет. На 320px `scrollWidth === innerWidth === 320`.
- [x] H1, CTA и телефонная ссылка не выходят за viewport; hero bounds проверены через DOM.
- [x] На 390px About/Locations grids и адресные заголовки сжимаются в 303px column; на 320px — в 256px column, без обрезания телефона или адреса.
- [x] Якоря `#menu`, `#about`, `#events`, `#locations` присутствуют и ведут к одноимённым сценам.
- [x] Mobile menu открывается с клавиатуры, `Escape` закрывает его, фокус возвращается на кнопку; при открытии фокус на ссылке «Меню».
- [x] В carousel работают `ArrowLeft`/`ArrowRight`, dots и финальная карточка: active `02` после ArrowRight, затем `05`, next disabled.
- [x] Телефон (`tel:+79372355715`), VK и Yandex Maps имеют обычные anchors с проверенными href.
- [x] При `prefers-reduced-motion: reduce` browser emulation дала `opacity: 1`, `transform: none`, `scroll-behavior: auto`; full-page evidence снят в этом режиме.
- [x] Сняты доказательные скриншоты, пути записаны в таблице выше.

## Ограничения доказательств

Фото из VK не считаются проверенными, пока публичная группа не открыта и кадры не просмотрены. Синтетический skyline не считается документальной фотографией. Реальные цены/наличие и второй график требуют повторной проверки в живом источнике перед коммерческим использованием.
