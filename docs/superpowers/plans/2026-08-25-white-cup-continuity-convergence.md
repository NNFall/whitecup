# White Cup continuity convergence: план реализации

> Исполнение: subagent-driven-development, TDD и две независимые стадии ревью после каждой изолированной задачи. Пользователь уже дал прямое разрешение продолжать без паузы и проверять результат во встроенном браузере.

**Цель:** превратить шесть reference-faithful сцен White Cup в один плавный paper-route лендинг, сохранив смысл, доступность и точные композиционные инварианты на desktop/mobile.

**Архитектура:** `App` будет задавать явную последовательность сцен и `SceneBridge` между ними. `StickyNav` получит одно непрерывное состояние: hero-reference layout в начале и компактный контекстный rail дальше. Общие CSS-переменные заменят базовую display-гарнитуру и отменят жёсткие сцены-разделители. Генерированный bridge-art останется явно decorative, а живые фотографии не будут подменяться синтетическими.

---

## 1. Зафиксировать контракты до кода — выполнено

**Файлы:**
- Modify: `src/App.test.tsx` или создать `src/components/SceneBridge.test.tsx`
- Modify: `src/components/StickyNav.test.tsx`
- Create: `src/components/SceneBridge.tsx`

**TDD:**
1. Написать тест, который ожидает пять `data-scene-bridge` в точном порядке: `hero-menu`, `menu-about`, `about-visit`, `visit-events`, `events-locations`.
2. Написать тест, который ожидает у мостов `aria-hidden="true"` и отсутствие tabindex/смыслового заголовка.
3. Написать тест навигационного контракта: hero использует full layout, не-hero состояние остаётся в DOM как компактная, доступная навигация.
4. Запустить focused test и зафиксировать ожидаемый RED.

## 2. Реализовать независимый SceneBridge — выполнено

**Файлы:**
- Create: `src/components/SceneBridge.tsx`
- Create/Modify: `src/components/SceneBridge.test.tsx`
- Create: `public/media/story-route-connector.png` или `.webp`
- Modify: `src/data/media.ts`
- Modify: `docs/reference/white-cup-asset-provenance.md`

**Шаги:**
1. Сгенерировать один прозрачный декоративный raster connector через Image Generation Skill, проверить alpha и явную классификацию `decorative-generated`.
2. Если нужен реальный cutout, проверить его через Remove Background Local и только после визуального сравнения использовать результат.
3. Реализовать `SceneBridge` как inert presentation-layer с явными `from`/`to` dataset значениями и responsive image source.
4. Запустить focused test, добиться GREEN.
5. Провести spec review, затем quality review только после spec PASS.

## 3. Встроить сквозной narrative и стабильную шапку — выполнено

**Файлы:**
- Modify: `src/App.tsx`
- Modify: `src/components/StickyNav.tsx`
- Modify: `src/components/StickyNav.test.tsx`
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/global.css`

**Шаги:**
1. Добавить bridges между последовательными section elements, не нарушив существующие id и hash navigation.
2. Заменить базовый display stack: heading/nav uses `White Cup Body`, `White Cup Hand` is an explicit accent only.
3. Убрать profile states, в которых desktop header пропадает. В hero сохранить measured reference geometry, после hero переводить в компактный rail посредством dataset, opacity и transform.
4. Убрать общий жёсткий border-bottom сцены и дать bridge управлять стыком, без layout animation.
5. Запустить tests: сначала focused GREEN, затем full suite.
6. Провести spec review, затем code-quality review, устранить все P1/P2 находки.

## 4. Полировка границ шести сцен и адаптивов — выполнено

**Файлы:**
- Modify: `src/styles/global.css`
- Modify when required: `src/sections/HeroSection.tsx`, `MenuSection.tsx`, `AboutSection.tsx`, `VisitSection.tsx`, `EventsSection.tsx`, `LocationsSection.tsx`
- Modify: `docs/visual-deviations.md`

**Шаги:**
1. Для каждой пары сцен установить собственный бумажный ритм, густоту рельефа и место connector-art, не подменяя ключевой кадр референса.
2. Устранить наложения nav/CTA/heading, сохранив coordinate contracts для 1920x1080 и 1536x864.
3. В mobile media queries сделать bridges краткими, убрать только несмысловые декоративные слои и проверить, что CTA полностью видимы на 320x568.
4. Добавить или обновить visual-contract tests, затем run focused tests.
5. Провести spec review и quality review.

## 5. Визуальная проверка, финальное ревью и публикация — в процессе

**Файлы:**
- Create: `docs/evidence/continuity-convergence/*`
- Modify: `docs/verification.md`
- Modify: `docs/visual-deviations.md`

**Шаги:**
1. [x] Во встроенном браузере снять hero, каждый bridge/junction и полную страницу на 1920x1080, 390x844 и 320x568; 1536x864 остаётся в предыдущей evidence-серии и будет обновлён перед публикацией.
2. [x] На viewport-проверках подтвердить `scrollWidth === clientWidth`, один h1, CTA/nav reachability и отсутствие горизонтального overflow.
3. [x] Получить независимые spec/quality ревью; Antigravity запускался, но его завершённый output отсутствует и PASS не заявляется.
4. [x] Выполнить `npm.cmd test -- --run --pool=threads --maxWorkers=1` (17 файлов/96 тестов), `npm.cmd run build`, `git diff --check`; вручную сверить evidence с шестью supplied references.
5. [x] Обновить verification/deviations с фактическими командами, снимками и осознанными отклонениями.
6. [ ] Проверить git status, stage только нужные файлы, commit, push `master` в `NNFall/whitecup`, затем подтвердить remote SHA.
