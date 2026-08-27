# White Cup heading rebuild: approved design

## Goal

Пересобрать типографику всех ключевых сцен White Cup так, чтобы масштаб,
переносы, рукописные акценты и координаты заметно совпадали с присланными
референсами на desktop, сохраняя живой доступный DOM-текст и отдельную
мобильную композицию.

## Visual direction

- Hero должен читаться как крупная трёхстрочная композиция: `Завтраки,` / 
  `кофе и свой` / `вайб в White Cup`. Brand-фраза остаётся отдельным
  рукописным слоем с underline.
- Menu должен иметь референсные две смысловые строки на desktop:
  `Завтраки, ради которых` и `хочется заглянуть`; начальная `З` получает
  отдельный масштаб, а orange accent не выглядит как случайная перекраска.
- About сохраняет script-вступление `О White Cup —`, display-строки и
  отдельные accent/script слова `хочется` и `возвращаться`, без чужеродного
  шрифта в длинной строке.
- Visit, Events и Locations получают ту же phrase-level систему, но с
  отдельными максимальными ширинами и line-height, чтобы не пересекаться с
  intro/cards на низких desktop viewport.
- Текст остаётся настоящим HTML. Растровые title-extract не возвращаются в
  runtime.

## Font decision and A/B gate

Сначала выполняется визуальный A/B-прогон в Codex In-app Browser для локальных
`Pangolin`, `White Cup Display` (Neucha subset) и `White Cup Hand` (Marck
Script subset). В runtime выбирается измеряемо наиболее близкая пара; решение
фиксируется в `docs/font-licenses.md` и тесте provenance. До A/B нельзя считать
Neucha окончательно утверждённым.

Результат A/B: `White Cup Display` (локальный Neucha subset) выбран для крупных
русских строк, `White Cup Hand` (Marck Script subset) — для коротких
brand/script-фраз, Golos Text — для body/navigation. Pangolin оставлен только
как локальный comparison asset: на 390px он добавлял лишнюю строку Menu и
выглядел заметно зернистее. Варианты не смешиваются внутри одной смысловой
строки.

## Responsive architecture

- Каждый heading остаётся одним семантическим `h1`/`h2` и получает явные
  `title-line`/`word` spans.
- Desktop geometry задаётся flow-layout, `clamp()` и scene-specific max-width;
  transforms применяются только коротким акцентам и не используются для
  компенсации неправильной сетки.
- Mobile получает собственные переносы и размеры, без desktop-rotation.
  На 390 и 320 px проверяются CTA, copy, heading и соседний контент на
  отсутствие overlap/overflow.
- Underline является частью соответствующего phrase-layer, а не независимым
  текстовым изображением.

## Evidence and acceptance

- До начала сохраняются baseline-кадры текущего HEAD.
- После каждого крупного изменения снимаются A/B и after-кадры через
  встроенный браузер на 1920×1080, 1536×864, 390×844 и 320×568.
- Автоматические контракты проверяют выбранные font-face, phrase spans,
  desktop/mobile geometry, доступное имя heading и отсутствие title-raster
  runtime nodes.
- Приёмка означает заметное изменение Hero/Menu/About относительно baseline,
  отсутствие горизонтального overflow и перекрытий, а также прохождение
  полного test/build/diff gate.

## Explicit non-goals

- Не заменять текст на PNG ради совпадения.
- Не менять фотографии, навигационную семантику или carousel behavior в рамках
  этого прохода, если это не требуется для устранения heading overlap.
- Не утверждать visual 1:1 без свежих browser screenshots.
