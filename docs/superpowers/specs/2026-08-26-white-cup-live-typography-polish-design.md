# White Cup: живая типографика и финальная полировка

## Статус решения

Пользователь явно подтвердил направление: заголовки должны быть реальным текстом, а не raster title-extract изображениями; Hero, Menu и About требуется пересобрать как цельный премиальный лендинг. Это документирует согласованное решение перед реализацией.

## Цель

Заменить все видимые изображения с текстом на доступную, локально загружаемую web-типографику. Сохранить независимые фото, еду, логотип и декоративные рисунки, но убрать из runtime все title-reference слои. Одновременно исправить фактическую desktop-проблему меню: при 1920px его track шире viewport всего на 66px, поэтому действие стрелки почти незаметно.

## Типографическая система

- `White Cup Body` (локальный Golos Text) остаётся для интерфейса, copy, карточек и навигации.
- Новый локальный `White Cup Display` строится из OFL-шрифта Neucha с кириллицей. Он используется только для русских крупных заголовков.
- `White Cup Hand` (Marck Script) используется только для словесного знака `White Cup` и коротких рукописных акцентов.
- Заголовки остаются в DOM, не получают `opacity: 0`, не заменяются `picture`, и не масштабируются неограниченными CSS transforms. Размер, line-height и tracking задаются clamp-значениями по сцене.

## Архитектура

1. `SectionFrame` больше не принимает `referenceTitles`, а `ReferenceTitleLayer` не участвует в runtime-дереве. Сами reference-extract files остаются только как provenance/evidence, не как видимые ресурсы.
2. `HeroSection` удаляет title-reference `picture` и raster underline. Подчёркивание становится CSS-декором у живого акцентного слова.
3. Каждая секция сохраняет свои существующие семантические line spans, но получает чистые scene-specific styles в отдельном `live-typography.css`, импортируемом после legacy `global.css`. Это изолирует новую систему от исторических override-блоков.
4. Menu carousel сохраняет native horizontal scroll и scroll-snap, но desktop track показывает около трёх с половиной карточек, чтобы стрелки проходили визуально заметную дистанцию. `moveTo` скроллит к реальной позиции конкретной карточки, а active dot синхронизируется с центром viewport.
5. `interaction-polish.css` содержит только bridge/header/carousel overrides и небольшой набор mobile rules. Он импортируется последним, поэтому переходы и responsive behavior не зависят от порядка огромного legacy stylesheet.

## Критерии приёмки

- В Hero/Menu/About/Visit/Events/Locations нет runtime title-reference `picture`, title WebP/PNG запроса или desktop-opacity, скрывающей живой `h1`/`h2`.
- На 1920×1080 headline, header, CTA, Menu title/copy/carousel и About title/copy не пересекаются.
- На 1536×864 сайт сохраняет читаемый масштаб при пользовательском zoom 125%.
- На 390×844 и 320×568 все заголовки рендерятся DOM-шрифтом, CTA и карточки не выходят по горизонтали, карусель показывает следующий карточный срез и листается touch/keyboard/buttons.
- Desktop нажатие «Следующая позиция» меняет `scrollLeft` минимум на 20% ширины viewport, если есть следующая карточка.
- Мосты между сценами остаются мягкими, инертными для pointer/focus и отключают motion при `prefers-reduced-motion`.
- Generated/reference-derived изображения не описываются как документальные фотографии заведения.
