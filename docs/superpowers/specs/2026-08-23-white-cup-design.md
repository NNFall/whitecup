# White Cup Landing Page Design Specification

Date: 2026-08-23

## Goal

Build a single responsive White Cup cafe landing page that keeps the six supplied 16:9 compositions recognisable at `1920x1080`, while delivering an intentional, usable mobile composition at `390x844` and `320x568`.

## Confirmed sources and content rules

- Local visual direction comes from the six PNGs in `C:\Users\User\Downloads`; each is `1672x941`.
- The public Yandex card confirms White Cup, rating 5.0, the main phone `+7 (937) 235-57-15`, daily `08:00–23:00` hours for the central point, menu categories, and the cafe interior/photo language.
- Independent public source checks confirm two current locations: `Красноармейская, 15 — во дворе Музея Модерна` and `Куйбышева, 128/1 — Станкозавод, пространство «Цех»`.
- The first route CTA links to the user-supplied Yandex card. Its card may display building `17` even though the brand/museum address is `15`; the UI will explain that the entrance is through the Modern Museum courtyard.
- The second location's `10:00–21:00` hours are kept in one editable data object and labelled as subject to confirmation until a current first-party schedule is available.
- The VK page is not accessible in the current browser safety surface; it is not bypassed. No unverified VK-only facts are copied into the page.
- Generated reference photos are art direction only. Publicly observed Yandex photos are the documentary image source; any generated graphics are explicitly decorative.

## Information architecture

One scrollable page with one sticky header and these scenes:

1. Hero: `Завтраки, кофе и свой вайб в White Cup` with primary menu CTA, secondary locations CTA, documentary interior/coffee image and Samara skyline doodle.
2. Menu: horizontally scrollable featured items (cappuccino, salmon bagel, berry waffle, syrniki, seasonal cheesecake) with keyboard controls, snap scrolling, dots and a menu-source link.
3. About: `О White Cup — место, в которое хочется возвращаться`, four benefits (specialty coffee, all-day breakfast, cozy atmosphere, Samara centre) and a documentary interior image.
4. Visit scenarios: `У нас есть место для вашего ритма`, three cards for coffee-to-go, meeting in the centre, and a quiet pause.
5. Events: `Завтраки, встречи и тёплые события`, three scenario cards and a photo; dates are not hard-coded, CTA points to the fresh public feed.
6. Locations: two factual location cards, hours, phone, route links, VK link and a static map illustration with a clear Yandex route CTA.
7. Footer: compact legal/source note, repeat menu/location CTAs and accessible contact links.

## Visual system

```css
--paper: #f7f2e9;
--paper-light: #fbf7f0;
--ink: #12110f;
--ink-soft: #34312d;
--orange: #e9460d;       /* display words, doodles, underline */
--orange-action: #c93608;/* buttons and small text, AA contrast */
--line: #b6aea3;
--map-water: #d8e2e5;
```

Use a small repeating paper grain (CSS/SVG, not a large bitmap), no pure white/black, thin ink borders, and no glassmorphism or heavy shadows. Display roles use a local or Google-hosted Cyrillic-capable handwritten font (`Pangolin`/`Neucha` fallback), the script accent uses `Marck Script`/`Caveat`, and body/navigation use `Golos Text`/`Manrope`. Logo is a single verified White Cup asset, not text retyped from generated PNGs.

Shared primitives:

- `PaperSurface` for the global paper and grain.
- `StickyNav` with active section state, mobile focus-trapped menu, Escape close and focus return.
- `SketchUnderline`, `Doodle`, `SamaraSkyline`, and `RouteLine` SVG primitives.
- `OrganicPhoto` with three prepared SVG masks and a mobile horizontal-cut variant.
- `PaperCard` for thin bordered cards with consistent radius and padding.
- `MenuCarousel` using native horizontal scroll snap, keyboard previous/next, dots and visible next-card affordance.
- `LocationCard` and `StaticMapCard` with real accessible anchors rather than clickable divs.

## Responsive composition

Desktop (`1920x1080`): scene min-height approximately `100dvh`, max content width `1720px`, 64–98px outer gutters, hero split about 56/44, large 88–96px display type, and organic photo cuts made with SVG masks rather than border-radius blobs. Keep the six supplied compositions recognisable and reuse the same skyline/route line rather than six inconsistent generated variants.

Mobile (`390x844`, `320x568`): single-column art direction, 16–20px gutters, 44–56px display type, 17–18px body type, CTA buttons full width and at least 52px tall. Hero order is text → CTA stack → wide 4:3/5:4 photo with a horizontal organic edge. Menu is the only horizontal snap carousel; other scenes are vertical. Locations order cards before the static map. Hide nonessential doodles at 320px and assert `document.documentElement.scrollWidth === window.innerWidth`.

## Interaction and accessibility

- All links are real anchors with descriptive names and visible focus rings.
- Mobile nav has `aria-expanded`, `aria-controls`, focus trap, Escape close and focus restoration.
- Carousel exposes `role="region"`, labelled controls, current slide state, keyboard arrows and touch snap; no autoplay.
- Meaningful documentary images have precise alt text; decorative doodles are `aria-hidden`.
- Content remains visible without JavaScript; reveal effects only enhance opacity/transform.
- `prefers-reduced-motion: reduce` disables reveal movement, smooth scrolling, parallax and autoplay.
- Minimum interactive target is 44px; body text is never handwritten-only; orange action colour is darkened for contrast.
- Map is initially a lightweight static illustration; Yandex is opened only by the route link.

## Data and provenance

Keep all factual copy in `src/data/site.ts` so the second schedule and seasonal menu can be edited without changing components. Keep documentary and decorative image provenance in `src/data/media.ts`. Do not commit credentials, private tokens, or scraped private data. A final report will list every deliberate departure from the generated references and why it improves accuracy, accessibility or trust.

## Verification gates

- Unit/component tests cover navigation, carousel keyboard behaviour, location links, reduced-motion class, and form-free CTA semantics.
- Build succeeds with the fixed dev/preview port `4175`.
- Browser checks capture full-page and first-viewport evidence at `1920x1080`, `390x844`, and `320x568`; no horizontal overflow, clipped headings, or unreadable CTA text.
- Lighthouse-like manual checks record image dimensions, lazy loading, and critical console errors.
- Independent visual review and source/fact review must pass before commit/push.
