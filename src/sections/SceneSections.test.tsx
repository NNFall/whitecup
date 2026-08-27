import { fireEvent, render, screen, within } from '@testing-library/react'

import App from '../App'
import * as mediaRegistry from '../data/media'
import { heroSceneLayerManifest } from '../data/media'
import { siteData } from '../data/site'
import globalCss from '../styles/global.css?raw'

describe('White Cup story scenes', () => {
  it('keeps the complete six-scene story contract and a single main heading', () => {
    render(<App />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    for (const id of ['hero', 'menu', 'about', 'visit', 'events', 'locations']) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }

    expect(screen.getByRole('group', { name: 'Основные действия' })).toBeInTheDocument()
  })

  it('publishes a production hero manifest without a supplied full-screen reference', () => {
    const manifest = heroSceneLayerManifest

    expect(manifest.backdrop.layer).toBe('backdrop')
    expect(manifest.backdrop.asset.provenanceKind).toBe('decorative-reference-edit')
    expect(manifest.foregrounds).toHaveLength(2)
    expect(manifest.foregrounds.every((entry) => entry.layer === 'foreground')).toBe(true)

    const responsiveLayers = [manifest.backdrop, ...manifest.foregrounds]
    expect(responsiveLayers.every((entry) => entry.src.endsWith('.webp'))).toBe(true)
    expect(responsiveLayers.every((entry) => (entry.srcSet?.split(',').length ?? 0) >= 2)).toBe(true)
    expect(responsiveLayers.every((entry) => Boolean(entry.sizes))).toBe(true)
    expect(
      responsiveLayers.every(
        (entry) =>
          'sourceArtifactSrc' in entry.asset &&
          typeof entry.asset.sourceArtifactSrc === 'string' &&
          entry.asset.sourceArtifactSrc.endsWith('.png'),
      ),
    ).toBe(true)
    expect(
      responsiveLayers.every(
        (entry) => !entry.asset.sourceArtifactSrc?.startsWith('/media/'),
      ),
    ).toBe(true)

    const runtimeSources = [
      manifest.backdrop,
      ...manifest.foregrounds,
      ...manifest.decorations,
    ]

    expect(runtimeSources.every((entry) => entry.src === entry.asset.src)).toBe(true)

    const filenames = runtimeSources.flatMap((entry) => [entry.src, entry.srcSet ?? ''])
    expect(filenames).not.toContain('/media/hero-reference-cafe-crop.png')
    expect(filenames.join(' ')).not.toMatch(/3679ac8b|ChatGPT Image/i)
  })

  it('matches the supplied first-screen hero contract', () => {
    render(<App />)

    const hero = screen.getByRole('region', { name: /завтраки, кофе и свой вайб/i })
    expect(hero.querySelector('.hero-reference-frame')).toBeInTheDocument()
    expect(within(hero).getByRole('heading', { level: 1 })).toHaveTextContent(
      'Завтраки, кофе и свой вайб в White Cup',
    )
    expect(within(hero).getByText('кофе')).toHaveClass('hero-scene__accent')
    expect(within(hero).getByRole('link', { name: /посмотреть меню/i })).toBeInTheDocument()
    expect(within(hero).getByRole('link', { name: /выбрать локацию/i })).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: /white cup/i }).some((image) => image.getAttribute('src') === '/media/hero-logo-reference.png')).toBe(true)

    const decorativeLayers = [
      ['.hero-backdrop', '/media/hero-clean-base-v2-1672.webp', 'backdrop', 'decorative-reference-edit'],
      ['.hero-bagel', '/media/hero-bagel-plate-reference-edit-1200.webp', 'foreground', 'decorative-reference-edit'],
      ['.hero-coffee', '/media/hero-coffee-cutout-1200.webp', 'foreground', 'decorative-reference-edit'],
      ['.hero-skyline-layer', '/media/hero-skyline-exact.png', 'decoration', 'decorative-reference-extract'],
    ] as const

    decorativeLayers.forEach(([selector, src, layerRole, mediaKind]) => {
      const layer = hero.querySelector(selector)
      expect(layer).toBeInTheDocument()
      expect(layer).toHaveAttribute('aria-hidden', 'true')
      expect(layer).toHaveAttribute('data-layer', layerRole)
      expect(layer).toHaveAttribute('data-media-kind', mediaKind)
      expect(layer).toHaveAttribute('src', src)
    })

    expect(hero.querySelector('.hero-backdrop')).toHaveAttribute(
      'srcset',
      '/media/hero-clean-base-v2-960.webp 960w, /media/hero-clean-base-v2-1672.webp 1672w',
    )
    expect(hero.querySelector('.hero-backdrop')).toHaveAttribute('sizes', '100vw')
    expect(hero.querySelector('.hero-backdrop')).toHaveAttribute('fetchpriority', 'high')
    expect(hero.querySelector('.hero-bagel')).toHaveAttribute(
      'srcset',
      '/media/hero-bagel-plate-reference-edit-720.webp 720w, /media/hero-bagel-plate-reference-edit-1200.webp 1200w',
    )
    expect(hero.querySelector('.hero-bagel')).not.toHaveAttribute('fetchpriority')
    expect(hero.querySelector('.hero-coffee')).not.toHaveAttribute('fetchpriority')

    const doodlePicture = hero.querySelector('[data-conditional-layer="doodles"]')
    expect(doodlePicture?.querySelector('source')).toHaveAttribute('media', '(min-width: 721px)')
    expect(doodlePicture?.querySelector('source')).toHaveAttribute('srcset', '/media/hero-doodles-exact.png')
    expect(doodlePicture?.querySelector('.hero-doodle-layer')).toHaveAttribute('src', expect.stringContaining('data:image/'))

    const routePicture = hero.querySelector('[data-conditional-layer="route"]')
    expect(routePicture?.querySelector('source')).toHaveAttribute('media', '(min-width: 721px)')
    expect(routePicture?.querySelector('source')).toHaveAttribute(
      'srcset',
      '/media/hero-route-cup-1672.webp',
    )
    expect(routePicture?.querySelector('.hero-route-layer')).toHaveAttribute('data-layer', 'decoration')
    expect(routePicture?.querySelector('.hero-route-layer')).toHaveAttribute(
      'data-media-kind',
      'decorative-reference-edit',
    )
    expect(heroSceneLayerManifest.decorations[1].asset.sourceArtifactSrc).toBe(
      'docs/reference/assets/hero-route-cup-authoring.png',
    )

    expect(hero.innerHTML).not.toContain('/media/hero-reference-cafe-crop.png')
    expect(hero.innerHTML).not.toMatch(
      /hero-(?:clean-base-edit-poc|bagel-cutout-poc|coffee-cutout-poc)\.png/,
    )

    expect(hero.querySelector('.hero-scene__documentary-fallback img')).not.toBeInTheDocument()

    expect(hero.querySelector('.hero-scene__heart')).toHaveAttribute('aria-hidden', 'true')
    expect(hero.querySelector('.hero-scene__pin')).toHaveAttribute('aria-hidden', 'true')
  })

  it('matches the supplied menu scene copy and semantic card contract', () => {
    render(<App />)

    const menu = screen.getByRole('region', {
      name: /завтраки, ради которых хочется заглянуть/i,
    })
    const heading = within(menu).getByRole('heading', { level: 2 })

    expect(within(menu).getByText('Для утренних ритуалов, встреч и спокойных пауз')).toBeInTheDocument()
    expect(heading).toHaveTextContent('Завтраки, ради которых хочется заглянуть')
    expect(heading.querySelector('.menu-scene__accent')).toHaveTextContent('заглянуть')
    expect(within(menu).getByText(
      'White Cup — это ваш уютный уголок в центре Самары. Здесь удобно взять кофе с собой, провести деловую встречу, перевести дух между делами или неспешно насладиться вечером в приятной атмосфере.',
    )).toBeInTheDocument()
    expect(within(menu).getByText('Популярное и сезонное')).toBeInTheDocument()
    expect(menu.querySelector('.menu-carousel__note')).toHaveTextContent(
      'Это лишь часть меню — листайте, чтобы увидеть больше!',
    )
    expect(within(menu).getByText(/декоративные.*по референсу/i)).toBeInTheDocument()
    expect(within(menu).getByRole('link', { name: /открыть полное меню в яндекс картах/i })).toHaveAttribute(
      'href',
      expect.stringContaining('/menu/'),
    )

    expect(menu.querySelector('.menu-scene__backdrop')).toHaveAttribute(
      'src',
      '/media/menu-clean-base-1672.webp',
    )
    expect(menu.querySelector('.menu-scene__skyline')).toHaveAttribute(
      'src',
      '/media/rhythm-skyline-reference-edit-1200w.webp',
    )
    expect(menu.querySelector('.menu-scene__skyline')).toHaveAttribute(
      'srcset',
      '/media/rhythm-skyline-reference-edit-720w.webp 720w, /media/rhythm-skyline-reference-edit-1200w.webp 1200w',
    )
    expect(menu.querySelectorAll('[data-menu-copy="middle"] [data-scene-card-image]')).toHaveLength(siteData.menuItems.length)
    expect(menu.innerHTML).not.toMatch(/ChatGPT Image|01_44_54 \(2\)|menu-clean-base\.png/i)
  })

  it('keeps a measured desktop menu height without a later legacy intro grid', () => {
    expect(globalCss).toMatch(
      /@media \(min-width: 1024px\)[\s\S]*\.scene\.menu-scene\s*{[^}]*height:\s*100dvh;[^}]*max-height:\s*100dvh;/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width: 1024px\)[\s\S]*\.menu-scene \.section-frame__inner\s*{[^}]*height:\s*100%;[^}]*min-height:\s*0;/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width: 1024px\)[\s\S]*\.menu-scene \.menu-scene__intro\s*{[^}]*display:\s*block;[^}]*grid-template-columns:\s*none;/,
    )
    expect(globalCss).not.toMatch(
      /\.menu-scene__intro\s*{[^}]*display:\s*grid;/,
    )
  })

  it('contains the menu skyline in a natural-ratio crop without covering the footer copy', () => {
    expect(globalCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*\.menu-scene__skyline\s*\{[\s\S]*bottom:\s*0;[\s\S]*width:\s*min\(44%,\s*46rem\);[\s\S]*height:\s*clamp\(4\.5rem,\s*4\.8vw,\s*5\.25rem\);[\s\S]*max-width:\s*calc\(100%\s*-\s*2rem\);[\s\S]*aspect-ratio:\s*1200\s*\/\s*242;[\s\S]*object-fit:\s*contain;[\s\S]*object-position:\s*center bottom;[\s\S]*filter:\s*grayscale\(1\)\s+brightness\(0\.45\)\s+contrast\(1\.2\);[\s\S]*transform:\s*translateX\(-50%\);/,
    )
    expect(globalCss).toMatch(
      /\.menu-scene\s+\.menu-carousel__footer,\s*\.menu-scene\s+\.menu-carousel__note\s*\{[\s\S]*position:\s*relative;[\s\S]*z-index:\s*2;/,
    )
    expect(globalCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*\.menu-scene\s+\.menu-carousel__note\s*\{[\s\S]*--menu-skyline-gap:\s*clamp\(0\.35rem,\s*0\.4vw,\s*0\.55rem\);[\s\S]*transform:\s*translateY\(calc\(clamp\(-5\.25rem,\s*-2\.8vw,\s*-2\.1rem\)\s*-\s*var\(--menu-skyline-gap\)\)\);/,
    )
    expect(globalCss).toMatch(
      /@media\s*\(min-width:\s*1024px\)[\s\S]*\.menu-scene\s+\.menu-carousel__footer\s*\{[\s\S]*transform:\s*translateY\(calc\(clamp\(-5\.25rem,\s*-2\.8vw,\s*-2\.1rem\)\s*-\s*var\(--menu-skyline-gap\)\)\);/,
    )
  })

  it('matches the supplied About scene copy, semantic benefits, and independent layers', () => {
    render(<App />)

    const about = screen.getByRole('region', {
      name: /о white cup.*место, в которое.*хочется возвращаться/i,
    })
    const heading = within(about).getByRole('heading', { level: 2 })
    const introParagraphs = about.querySelectorAll('.about-scene__intro > p')
    const benefits = within(about).getAllByRole('listitem')

    expect(heading).toHaveTextContent('О White Cup — место, в которое хочется возвращаться')
    expect(heading.querySelector('.about-scene__accent')).toHaveTextContent('хочется')
    expect(heading.querySelector('.about-scene__return')).toHaveTextContent('возвращаться')
    expect(introParagraphs).toHaveLength(2)
    expect(introParagraphs[0]).toHaveTextContent(
      'Мы обожаем спешелти-кофе и готовим его с вниманием к каждой детали. Наши завтраки подаём весь день — от хрустящих вафель до сытных боулов и ароматной выпечки.',
    )
    expect(introParagraphs[1]).toHaveTextContent(
      'White Cup — это уютная кофейня в самом сердце Самары, где легко переключиться с городского ритма на своё время.',
    )
    expect(introParagraphs[1].querySelector('.about-scene__city')).toHaveTextContent(
      'в самом сердце Самары',
    )

    expect(benefits).toHaveLength(4)
    expect(benefits.map((benefit) => within(benefit).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'Спешелти-кофе',
      'Завтраки весь день',
      'Уютная атмосфера',
      'Центр Самары',
    ])
    expect(benefits.map((benefit) => within(benefit).getByRole('paragraph').textContent)).toEqual([
      'Только отборные зёрна и бережная обжарка',
      'Любимые блюда в любое время',
      'Тёплый интерьер и дружелюбная команда',
      'В самом сердце города, рядом с культурной жизнью',
    ])
    expect(about.querySelectorAll('[data-about-benefit-image]')).toHaveLength(4)

    expect(about.querySelector('.about-scene__backdrop')).toHaveAttribute(
      'src',
      '/media/about-clean-base-1672.webp',
    )
    expect(about.querySelector('.about-scene__backdrop')).toHaveAttribute(
      'srcset',
      '/media/about-clean-base-960.webp 960w, /media/about-clean-base-1672.webp 1672w',
    )
    expect(about.querySelectorAll('[data-layer="foreground"]')).toHaveLength(2)
    expect(about.querySelector('.about-scene__pastry')).toHaveAttribute(
      'src',
      '/media/about-pastry-plate-reference-edit-v2-1200.webp',
    )
    expect(about.querySelector('.about-scene__coffee')).toHaveAttribute(
      'src',
      '/media/about-coffee-cutout-1200.webp',
    )
    expect(about.querySelector('.about-scene__doodles')).toHaveAttribute(
      'src',
      '/media/about-doodles-reference-edit-1672.webp',
    )
    expect(about.querySelector('.about-scene__doodles')).toHaveAttribute(
      'data-layer',
      'decoration',
    )
    expect(about.querySelector('.about-scene__doodles')).toHaveAttribute(
      'data-media-kind',
      'decorative-reference-edit',
    )
    expect(about.querySelector('.about-scene__doodles')).toHaveAttribute('aria-hidden', 'true')
    expect(about.innerHTML).not.toMatch(
      /about-(?:clean-base|doodles-reference-edit)\.png|ChatGPT Image|01_44_53 \(1\)/i,
    )
    expect(about.querySelector('.organic-photo--about')).not.toBeInTheDocument()
  })

  it('publishes the About assets as responsive decorative scene layers', () => {
    const manifest = (
      mediaRegistry as unknown as {
        aboutSceneLayerManifest?: {
          backdrop: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
          foregrounds: Array<{ src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }>
          benefits: Record<string, { src: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }>
          decoration: { src: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
        }
      }
    ).aboutSceneLayerManifest

    expect(manifest).toBeDefined()
    expect(manifest?.backdrop.asset.kind).toBe('decorative')
    expect(manifest?.backdrop.asset.provenanceKind).toBe('decorative-reference-edit')
    expect(manifest?.backdrop.srcSet?.split(',')).toHaveLength(2)
    expect(manifest?.backdrop.sizes).toBe('100vw')
    expect(manifest?.foregrounds).toHaveLength(2)
    expect(manifest?.foregrounds.every((entry) => entry.src.endsWith('-1200.webp'))).toBe(true)
    expect(manifest?.foregrounds.every((entry) => entry.srcSet?.split(',').length === 2)).toBe(true)
    expect(manifest?.foregrounds.map((entry) => entry.sizes)).toEqual([
      '(max-width: 1023px) 128vw, 23vw',
      '(max-width: 1023px) 88vw, 32vw',
    ])
    expect(Object.values(manifest?.benefits ?? {})).toHaveLength(4)
    expect(Object.values(manifest?.benefits ?? {}).every((entry) => entry.src.endsWith('-480.webp'))).toBe(true)
    expect(manifest?.decoration.src).toBe('/media/about-doodles-reference-edit-1672.webp')
    expect(manifest?.decoration.asset.provenanceKind).toBe('decorative-reference-edit')
    expect(
      [
        manifest?.backdrop,
        ...(manifest?.foregrounds ?? []),
        ...Object.values(manifest?.benefits ?? {}),
        manifest?.decoration,
      ].every((entry) => entry?.asset.sourceArtifactSrc === undefined),
    ).toBe(true)
  })

  it('places the About doodle canvas exactly on desktop and omits it from mobile layout', () => {
    expect(globalCss).toMatch(
      /\.about-scene__doodles\s*{[^}]*position:\s*absolute;[^}]*inset:\s*0;[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*object-fit:\s*cover;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.about-scene__doodles\s*{[^}]*display:\s*none;/,
    )
  })

  it('keeps every mobile About title line inside the authored gutters', () => {
    render(<App />)

    const about = screen.getByRole('region', {
      name: /о white cup.*место, в которое.*хочется возвращаться/i,
    })
    const heading = within(about).getByRole('heading', { level: 2 })

    expect(heading.querySelector('.about-scene__title-line--place')).toHaveTextContent(
      'место, в которое',
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.about-scene__title-line\s*{[^}]*max-width:\s*100%;[^}]*white-space:\s*normal;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.about-scene__title-line--brand\s*{[^}]*font-size:\s*0\.91em;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.about-scene__title-line--place\s*{[^}]*font-size:\s*0\.8em;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.about-scene__title-line:last-child\s*{[^}]*font-size:\s*0\.78em;[^}]*flex-wrap:\s*wrap;/,
    )
  })

  it('aligns an About hash visit to the viewport instead of adding the global nav offset', () => {
    expect(globalCss).toMatch(
      /\.scene\.about-scene\s*{[^}]*scroll-margin-top:\s*0;/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width: 1024px\)[\s\S]*?\.scene\.about-scene\s*{[^}]*height:\s*100dvh;[^}]*max-height:\s*100dvh;/,
    )
  })

  it('matches the supplied Visit scene copy, semantic cards, and independent layers', () => {
    render(<App />)

    const visit = screen.getByRole('region', {
      name: /у нас есть место.*для вашего ритма/i,
    })
    const heading = within(visit).getByRole('heading', { level: 2 })
    const articles = within(visit).getAllByRole('article')

    expect(within(visit).getByText('Для утренних ритуалов, встреч и спокойных пауз')).toBeInTheDocument()
    expect(heading).toHaveTextContent('У нас есть место для вашего ритма')
    expect(heading.querySelector('.visit-scene__accent')).toHaveTextContent('ритма')
    expect(visit.querySelector('.visit-scene__intro p')).toHaveTextContent(
      'White Cup — это ваш уютный уголок в центре Самары. Здесь удобно взять кофе с собой, провести деловую встречу, перевести дух между делами или неспешно насладиться вечером в приятной атмосфере.',
    )

    expect(articles).toHaveLength(3)
    expect(articles.map((article) => within(article).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'Утро с кофе',
      'Встреча в центре',
      'Спокойная пауза',
    ])
    expect(articles.map((article) => within(article).getByRole('paragraph').textContent)).toEqual([
      'Ароматный кофе с собой, свежая выпечка и бодрое начало дня. Быстро, вкусно и рядом с вашими планами.',
      'Удобное расположение, комфортная атмосфера и вкусные блюда — идеальные условия для деловых и дружеских встреч.',
      'Мягкий свет, уютные места и любимый вкус — для чтения, работы или просто чтобы остановиться и выдохнуть.',
    ])

    expect(visit.querySelector('.visit-scene__backdrop')).toHaveAttribute(
      'src',
      '/media/rhythm-clean-base-desktop.webp',
    )
    expect(visit.querySelector('.visit-scene__backdrop')).toHaveAttribute(
      'srcset',
      '/media/rhythm-clean-base-mobile-960.webp 960w, /media/rhythm-clean-base-desktop.webp 1672w',
    )
    expect(visit.querySelector('.visit-scene__skyline')).toHaveAttribute(
      'src',
      '/media/rhythm-skyline-reference-edit-1200w.webp',
    )
    expect(visit.querySelector('.visit-scene__skyline')).toHaveAttribute(
      'srcset',
      '/media/rhythm-skyline-reference-edit-720w.webp 720w, /media/rhythm-skyline-reference-edit-1200w.webp 1200w',
    )
    expect(visit.querySelectorAll('[data-scene-card-image]')).toHaveLength(3)
    visit.querySelectorAll('[data-scene-card-image]').forEach((image) => {
      expect(image).toHaveAttribute('aria-hidden', 'true')
      expect(image).toHaveAttribute('data-layer', 'foreground')
      expect(image).toHaveAttribute('data-media-kind', 'decorative-reference-edit')
      expect(image).toHaveAttribute('alt', '')
    })
    expect(visit.querySelector('[data-scene-card-image="morning-coffee"]')).toHaveAttribute(
      'src',
      '/media/rhythm-coffee-badged-reference-edit-800.webp',
    )
    expect(visit.querySelector('.visit-scene__doodles')).toHaveAttribute(
      'src',
      '/media/rhythm-doodles-reference-edit-1672.webp',
    )
    expect(visit.querySelector('.visit-scene__doodles')).toHaveAttribute(
      'srcset',
      '/media/rhythm-doodles-reference-edit-960.webp 960w, /media/rhythm-doodles-reference-edit-1672.webp 1672w',
    )
    expect(visit.querySelector('.visit-scene__doodles')).toHaveAttribute('aria-hidden', 'true')
    expect(visit.querySelector('.visit-scene__doodles')).toHaveAttribute('data-layer', 'decoration')
    expect(visit.querySelector('.visit-scene__doodles')).toHaveAttribute(
      'data-media-kind',
      'decorative-reference-edit',
    )
    expect(visit.querySelectorAll('[data-visit-doodle]')).toHaveLength(0)
    expect(visit.innerHTML).not.toMatch(/ChatGPT Image|01_44_54 \(3\)|rhythm-(?:clean-base|coffee-reference-edit|table-reference-edit|waffle-reference-edit)\.png/i)
  })

  it('publishes the Visit assets as decorative production layers without the full reference', () => {
    const manifest = (
      mediaRegistry as unknown as {
        visitSceneLayerManifest?: {
          backdrop: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
          cards: Record<string, { src: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }>
          decoration: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
          skyline: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
        }
      }
    ).visitSceneLayerManifest

    expect(manifest).toBeDefined()
    expect(manifest?.backdrop.asset.kind).toBe('decorative')
    expect(manifest?.backdrop.asset.provenanceKind).toBe('decorative-reference-edit')
    expect(manifest?.backdrop.srcSet?.split(',')).toHaveLength(2)
    expect(manifest?.backdrop.sizes).toBe('100vw')
    expect(Object.values(manifest?.cards ?? {})).toHaveLength(3)
    expect(Object.values(manifest?.cards ?? {}).every((entry) => entry.asset.kind === 'decorative')).toBe(true)
    expect(Object.values(manifest?.cards ?? {}).every((entry) => entry.asset.provenanceKind === 'decorative-reference-edit')).toBe(true)
    expect(Object.values(manifest?.cards ?? {}).every((entry) => entry.src.endsWith('-800.webp'))).toBe(true)
    expect(Object.values(manifest?.cards ?? {}).every((entry) => entry.asset.sourceArtifactSrc === undefined)).toBe(true)
    expect(manifest?.cards['morning-coffee'].src).toBe(
      '/media/rhythm-coffee-badged-reference-edit-800.webp',
    )
    expect(manifest?.decoration.src).toBe('/media/rhythm-doodles-reference-edit-1672.webp')
    expect(manifest?.decoration.srcSet?.split(',')).toHaveLength(2)
    expect(manifest?.decoration.sizes).toBe('100vw')
    expect(manifest?.skyline.src).toBe('/media/rhythm-skyline-reference-edit-1200w.webp')
    expect(manifest?.skyline.srcSet?.split(',')).toHaveLength(2)
    expect(manifest?.skyline.asset.provenanceKind).toBe('decorative-reference-edit')
  })

  it('keeps the desktop Visit composition in one viewport and gives mobile its own flow', () => {
    expect(globalCss).toMatch(
      /@media \(min-width: 1024px\)[\s\S]*?\.scene\.visit-scene\s*{[^}]*height:\s*100dvh;[^}]*max-height:\s*100dvh;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.visit-scene \.section-frame__inner\s*{[^}]*grid-template-areas:/,
    )
    expect(globalCss).toMatch(
      /\.scene\.visit-scene\s*{[^}]*scroll-margin-top:\s*0;/,
    )
    expect(globalCss).toMatch(
      /\.visit-scene__intro\s*\{[^}]*width:\s*26\.5%;/,
    )
    expect(globalCss).toMatch(
      /\.visit-scene__title-line--first\s*{[^}]*transform:\s*scaleX\(1\.4\);/,
    )
    expect(globalCss).toMatch(
      /\.visit-scene__title-line--second\s*{[^}]*transform:\s*scaleX\(1\.39\);/,
    )
    expect(globalCss).toMatch(
      /@media \(min-width: 1024px\) and \(max-width: 1439px\)[\s\S]*?\.visit-scene__cards\s*{[^}]*top:/,
    )
    expect(globalCss).toMatch(
      /\.visit-card\[data-visit-card='morning-coffee'\] \.visit-card__media\s*{[^}]*clip-path:\s*polygon\(/,
    )
    expect(globalCss).toMatch(
      /\.visit-card\[data-visit-card='meeting-in-centre'\] \.visit-card__media\s*{[^}]*clip-path:\s*polygon\(/,
    )
    expect(globalCss).toMatch(
      /\.visit-card\[data-visit-card='quiet-pause'\] \.visit-card__media\s*{[^}]*clip-path:\s*polygon\(/,
    )
  })

  it('matches the supplied Events scene copy, semantic cards, and independent layers', () => {
    render(<App />)

    const events = screen.getByRole('region', {
      name: /завтраки, встречи.*и тёплые события/i,
    })
    const heading = within(events).getByRole('heading', { level: 2 })
    const articles = within(events).getAllByRole('article')

    expect(heading).toHaveTextContent('Завтраки, встречи и тёплые события')
    expect(heading.querySelector('.events-scene__title-line--first')).toHaveTextContent(
      'Завтраки, встречи',
    )
    expect(heading.querySelector('.events-scene__title-line--second')).toHaveTextContent(
      'и тёплые события',
    )
    expect(heading.querySelector('.events-scene__accent')).toHaveTextContent('события')
    expect(events.querySelector('.scene-kicker')).not.toBeInTheDocument()
    expect(events.querySelector('.events-scene__intro p')).toHaveTextContent(
      'Начните день с вкусного завтрака в компании друзей, проведите продуктивную встречу за ароматным кофе или устройте камерное мероприятие в уютной атмосфере White Cup.',
    )
    expect(events.querySelector('.events-scene__intro-brand')).toHaveTextContent('White Cup')
    expect(events.querySelectorAll('.events-scene__desktop-break')).toHaveLength(3)

    expect(articles).toHaveLength(3)
    expect(
      articles.map((article) => within(article).getByRole('heading', { level: 3 }).textContent),
    ).toEqual(['Завтраки с друзьями', 'Рабочие встречи', 'Камерные события'])
    expect(articles.map((article) => within(article).getByRole('paragraph').textContent)).toEqual([
      'Вкусные завтраки, душевные разговоры и отличное начало дня.',
      'Уютная атмосфера и всё необходимое для продуктивных встреч.',
      'Идеальное место для небольших праздников, мастер-классов и встреч.',
    ])

    const cardImages = events.querySelectorAll('[data-events-card-image]')
    expect(cardImages).toHaveLength(3)
    cardImages.forEach((image) => {
      expect(image).toHaveAttribute('aria-hidden', 'true')
      expect(image).toHaveAttribute('data-layer', 'foreground')
      expect(image).toHaveAttribute('data-media-kind', 'decorative-reference-edit')
      expect(image).toHaveAttribute('alt', '')
      expect(image).toHaveAttribute('srcset', expect.stringContaining('.webp 800w'))
      expect(image).toHaveAttribute('sizes')
    })

    const expectedLayers = [
      ['.events-scene__doodles', '/media/events-doodles-reference-edit-1672.webp', 'decoration'],
      ['.events-scene__chalkboard', '/media/events-chalkboard-reference-edit-480w.webp', 'decoration'],
      ['.events-scene__cake', '/media/events-cake-plate-clean-1200w.webp', 'foreground'],
      ['.events-scene__coffee', '/media/events-coffee-clean-800w.webp', 'foreground'],
    ] as const

    expectedLayers.forEach(([selector, src, layer]) => {
      const image = events.querySelector(selector)
      expect(image).toHaveAttribute('src', src)
      expect(image).toHaveAttribute('aria-hidden', 'true')
      expect(image).toHaveAttribute('alt', '')
      expect(image).toHaveAttribute('data-layer', layer)
      expect(image).toHaveAttribute('data-media-kind', 'decorative-reference-edit')
      expect(image).toHaveAttribute('srcset')
      expect(image).toHaveAttribute('sizes')
    })

    expect(
      within(events).getByRole('link', { name: /камерные события.*vk.*новой вкладке/i }),
    ).toHaveAttribute('href', 'https://vk.ru/white_cup')
    expect(events.querySelector('.events-scene__backdrop')).not.toBeInTheDocument()
    const documentaryPhoto = events.querySelector('[data-media-id="interior-03"]')
    expect(documentaryPhoto).toHaveAttribute('data-media-kind', 'documentary')
    expect(documentaryPhoto?.querySelector('img')).toHaveAttribute('src', '/media/interior-03.webp')
    expect(documentaryPhoto?.querySelector('img')).toHaveAttribute('alt')
    expect(events.innerHTML).not.toMatch(
      /events-cake-plate-reference-edit|events-coffee-cutout/i,
    )
    expect(events.innerHTML).not.toMatch(
      /ChatGPT Image|01_44_54 \(4\)|events-(?:clean-base|cake-plate-clean|coffee-clean|chalkboard-reference-edit|doodles-reference-edit)\.png/i,
    )
  })

  it('publishes the Events assets as decorative responsive production layers', () => {
    const manifest = (
      mediaRegistry as unknown as {
        eventsSceneLayerManifest?: {
          backdrop: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
          cards: Record<string, { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }>
          foregrounds: Array<{ src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }>
          decoration: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
          chalkboard: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
        }
      }
    ).eventsSceneLayerManifest

    expect(manifest).toBeDefined()
    const layers = [
      manifest?.backdrop,
      ...Object.values(manifest?.cards ?? {}),
      ...(manifest?.foregrounds ?? []),
      manifest?.decoration,
      manifest?.chalkboard,
    ].filter(Boolean)

    expect(manifest?.backdrop.srcSet?.split(',')).toHaveLength(2)
    expect(manifest?.backdrop.sizes).toBe('100vw')
    expect(Object.values(manifest?.cards ?? {})).toHaveLength(3)
    expect(manifest?.foregrounds).toHaveLength(2)
    expect(layers.every((entry) => entry?.asset.kind === 'decorative')).toBe(true)
    expect(layers.every((entry) => entry?.asset.provenanceKind === 'decorative-reference-edit')).toBe(true)
    expect(layers.every((entry) => entry?.src.endsWith('.webp'))).toBe(true)
    expect(layers.every((entry) => Boolean(entry?.srcSet) && Boolean(entry?.sizes))).toBe(true)
    expect(layers.every((entry) => entry?.asset.sourceArtifactSrc === undefined)).toBe(true)
    expect(manifest?.foregrounds.map((entry) => entry.src)).toEqual([
      '/media/events-cake-plate-clean-1200w.webp',
      '/media/events-coffee-clean-800w.webp',
    ])
    expect(manifest?.foregrounds.map((entry) => entry.srcSet)).toEqual([
      '/media/events-cake-plate-clean-720w.webp 720w, /media/events-cake-plate-clean-1200w.webp 1200w',
      '/media/events-coffee-clean-480w.webp 480w, /media/events-coffee-clean-800w.webp 800w',
    ])
    expect(manifest?.foregrounds.map((entry) => entry.sizes)).toEqual([
      '(max-width: 1023px) 80vw, 22.4vw',
      '(max-width: 1023px) 65vw, 23.1vw',
    ])
    expect(manifest?.chalkboard.srcSet?.split(',')).toHaveLength(2)
    expect(manifest?.decoration.srcSet?.split(',')).toHaveLength(2)
  })

  it('keeps the desktop Events composition in one viewport and gives mobile its own flow', () => {
    expect(globalCss).toMatch(
      /@media \(min-width: 1024px\)[\s\S]*?\.scene\.events-scene\s*\{[^}]*height:\s*100dvh;[^}]*max-height:\s*100dvh;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.events-scene \.section-frame__inner\s*\{[^}]*grid-template-areas:/,
    )
    expect(globalCss).toMatch(/\.scene\.events-scene\s*\{[^}]*scroll-margin-top:\s*0;/)
    expect(globalCss).toMatch(
      /\.events-scene__art\s*\{[^}]*position:\s*absolute;[^}]*inset:\s*0;/,
    )
    expect(globalCss).toMatch(
      /\.events-scene__cards\s*\{[^}]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.events-scene__cards\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.events-scene \.section-frame__inner\s*\{[^}]*min-width:\s*0;[^}]*max-width:\s*100%;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.events-scene \.section-frame__heading,\s*\.events-scene__intro,\s*\.events-scene__art,\s*\.events-scene__cards\s*\{[^}]*min-width:\s*0;[^}]*max-width:\s*100%;/,
    )
    expect(globalCss).toMatch(
      /\.events-card__copy h3\s*\{[^}]*position:\s*relative;/,
    )
    expect(globalCss).toMatch(
      /\.events-card__title-link\s*\{[^}]*display:\s*inline;[^}]*text-decoration:\s*none;/,
    )
    expect(globalCss).toMatch(
      /\.events-card__title-link::after\s*\{[^}]*position:\s*absolute;[^}]*height:\s*2\.75rem;[^}]*content:\s*'';/,
    )
    expect(globalCss).toMatch(/\.events-card__title-link:focus-visible\s*\{[^}]*outline:/)
    expect(globalCss).toMatch(
      /\.events-scene__title-line--first\s*\{[^}]*transform:\s*scaleX\(1\.36\);/,
    )
    expect(globalCss).toMatch(
      /\.events-scene__title-line--second\s*\{[^}]*margin-left:\s*0\.2vw;[^}]*transform:\s*scaleX\(1\.34\);/,
    )
    expect(globalCss).toMatch(
      /\.events-scene__cake\s*\{[^}]*top:\s*70\.6%;[^}]*left:\s*57\.7%;[^}]*width:\s*22\.4%;/,
    )
    expect(globalCss).toMatch(
      /\.events-scene__coffee\s*\{[^}]*top:\s*66\.7%;[^}]*left:\s*78\.2%;[^}]*width:\s*23\.1%;/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.events-scene__title-line--first,\s*\.events-scene__title-line--second\s*\{[^}]*margin-left:\s*0;[^}]*transform:\s*none;/,
    )
  })

  it('matches the supplied Locations scene while preserving verified visit facts', () => {
    render(<App />)

    const locations = screen.getByRole('region', { name: 'Как нас найти' })
    const heading = within(locations).getByRole('heading', { level: 2 })
    const articles = within(locations).getAllByRole('article')

    expect(heading).toHaveTextContent('Как нас найти')
    expect(heading.querySelector('.locations-scene__title-accent')).toHaveTextContent('найти')
    expect(locations.querySelector('.scene-kicker')).not.toBeInTheDocument()
    expect(locations.querySelector('.locations-scene__intro p')).toHaveTextContent(
      'Мы в самом сердце Самары. Две уютные кофейни с ароматным кофе, свежими завтраками и тёплой атмосферой каждый день.',
    )

    expect(articles).toHaveLength(2)
    expect(within(locations).getByRole('article', { name: 'Красноармейская, 15' })).toBeInTheDocument()
    expect(
      within(locations).getByRole('article', {
        name: 'Станкозавод, Куйбышева, 128/1',
      }),
    ).toBeInTheDocument()
    expect(articles[0]).toContainHTML('<address')
    expect(articles[1]).toContainHTML('<address')
    expect(articles[0].querySelector('address h3')).not.toBeInTheDocument()
    expect(articles[1].querySelector('address h3')).not.toBeInTheDocument()
    expect(articles[0].querySelector('address .location-card__meta-label')).not.toBeInTheDocument()
    expect(articles[1].querySelector('address .location-card__meta-label')).not.toBeInTheDocument()
    expect(within(articles[0]).getByRole('heading', { level: 3 })).toHaveTextContent(
      'Красноармейская, 15',
    )
    expect(within(articles[1]).getByRole('heading', { level: 3 })).toHaveTextContent(
      'Станкозавод, Куйбышева, 128/1',
    )
    expect(within(articles[0]).getByText('08:00–23:00')).toBeInTheDocument()
    expect(within(articles[1]).getByText('10:00–21:00')).toBeInTheDocument()
    expect(within(articles[0]).getByText(/вход через двор музея модерна/i)).toBeInTheDocument()
    expect(within(articles[0]).getByText(/яндекс.*17/i)).toBeInTheDocument()
    expect(within(articles[1]).getByText(/уточняйте актуальный график/i)).toBeInTheDocument()

    const routeLinks = within(locations).getAllByRole('link', {
      name: /построить маршрут до White Cup/i,
    })
    const contactLinks = within(locations).getAllByRole('link', {
      name: /связаться с White Cup/i,
    })

    expect(routeLinks).toHaveLength(2)
    expect(routeLinks.every((link) => link.textContent?.trim() === 'Построить маршрут')).toBe(true)
    expect(routeLinks.every((link) => link.getAttribute('href')?.includes('yandex.ru'))).toBe(true)
    expect(contactLinks).toHaveLength(2)
    expect(contactLinks.every((link) => link.textContent?.trim() === 'Связаться')).toBe(true)
    expect(contactLinks.every((link) => link.getAttribute('href') === 'tel:+79372355715')).toBe(true)
    expect(within(locations).getAllByText('+7 (937) 235-57-15')).toHaveLength(2)

    const map = locations.querySelector('.static-map-card')
    expect(map).toHaveAttribute('aria-hidden', 'true')
    expect(map).toHaveAttribute('data-decorative-map', 'true')
    expect(map).not.toHaveAttribute('role')
    expect(map?.querySelector('svg')).not.toBeInTheDocument()

    const expectedLayers = [
      ['.locations-scene__map-image', '/media/locations-map-reference-1672w.webp', 'backdrop'],
      ['.locations-scene__doodles', '/media/locations-doodles-reference-edit-1672.webp', 'decoration'],
    ] as const

    expectedLayers.forEach(([selector, src, layer]) => {
      const image = locations.querySelector(selector)
      expect(image).toHaveAttribute('src', src)
      expect(image).toHaveAttribute('aria-hidden', 'true')
      expect(image).toHaveAttribute('alt', '')
      expect(image).toHaveAttribute('data-layer', layer)
      expect(image).toHaveAttribute('data-media-kind', 'decorative-reference-edit')
      expect(image).toHaveAttribute('srcset')
      expect(image).toHaveAttribute('sizes')
    })

    const expectedCardSprites = ['pin', 'clock', 'phone', 'arrow', 'chat'] as const
    expectedCardSprites.forEach((sprite) => {
      const images = locations.querySelectorAll<HTMLImageElement>(
        `.location-card__icon--${sprite}`,
      )
      expect(images).toHaveLength(2)
      images.forEach((image) => {
        expect(image).toHaveAttribute('src', `/media/locations-icon-${sprite}.webp`)
        expect(image).toHaveAttribute('alt', '')
        expect(image).toHaveAttribute('aria-hidden', 'true')
        expect(image).toHaveAttribute('draggable', 'false')
        expect(image).toHaveAttribute('data-media-kind', 'decorative-reference-edit')
      })
    })
    expect(locations.querySelector('[src*="locations-card-icons-reference-edit"]')).not.toBeInTheDocument()
    expect(locations.querySelector('.locations-scene__card-icons')).not.toBeInTheDocument()
    expect(routeLinks[0].querySelector('.location-card__icon--arrow')).toBeInTheDocument()
    expect(contactLinks[0].querySelector('.location-card__icon--chat')).toBeInTheDocument()

    expect(locations.querySelector('.locations-scene__interior')).not.toBeInTheDocument()
    const documentaryPhoto = locations.querySelector('[data-media-id="interior-02"]')
    expect(documentaryPhoto).toHaveAttribute('data-media-kind', 'documentary')
    expect(documentaryPhoto?.querySelector('img')).toHaveAttribute('src', '/media/interior-02.webp')
    expect(documentaryPhoto?.querySelector('img')).toHaveAttribute('alt')
    expect(locations.innerHTML).not.toMatch(
      /ChatGPT Image|01_44_55 \(5\)|locations-(?:clean-base|map-reference|interior-base|doodles-reference-edit|card-icons-reference-edit)\.png/i,
    )
  })

  it('publishes Locations artwork as responsive decorative production layers', () => {
    const registry = mediaRegistry as unknown as {
        locationsSceneLayerManifest?: {
          map: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
          interior: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
          decoration: { src: string; srcSet?: string; sizes?: string; asset: { kind: string; provenanceKind: string; sourceArtifactSrc?: string } }
        }
        locationsCardIconMedia?: Record<string, { src: string; alt: string; kind: string; provenanceKind: string; sourceArtifactSrc?: string }>
      }
    const manifest = registry.locationsSceneLayerManifest
    const cardSprites = Object.values(registry.locationsCardIconMedia ?? {})

    expect(manifest).toBeDefined()
    const layers = [
      manifest?.map,
      manifest?.interior,
      manifest?.decoration,
    ].filter(Boolean)

    expect(layers).toHaveLength(3)
    expect(layers.every((entry) => entry?.asset.kind === 'decorative')).toBe(true)
    expect(layers.every((entry) => entry?.asset.provenanceKind === 'decorative-reference-edit')).toBe(true)
    expect(layers.every((entry) => entry?.src.endsWith('.webp'))).toBe(true)
    expect(layers.every((entry) => entry?.srcSet?.split(',').length === 2)).toBe(true)
    expect(layers.every((entry) => Boolean(entry?.sizes))).toBe(true)
    expect(layers.every((entry) => entry?.asset.sourceArtifactSrc === undefined)).toBe(true)
    expect(manifest?.map.src).toBe('/media/locations-map-reference-1672w.webp')
    expect(manifest?.interior.src).toBe('/media/locations-interior-base-1672w.webp')
    expect(cardSprites).toHaveLength(5)
    expect(cardSprites.map((asset) => asset.src).sort()).toEqual(
      ['arrow', 'chat', 'clock', 'phone', 'pin'].map(
        (name) => `/media/locations-icon-${name}.webp`,
      ),
    )
    expect(cardSprites.every((asset) => asset.alt === '')).toBe(true)
    expect(cardSprites.every((asset) => asset.kind === 'decorative')).toBe(true)
    expect(cardSprites.every((asset) => asset.provenanceKind === 'decorative-reference-edit')).toBe(true)
    expect(cardSprites.every((asset) => asset.sourceArtifactSrc === undefined)).toBe(true)
  })

  it('keeps Locations in one desktop viewport and authors a separate mobile flow', () => {
    expect(globalCss).toMatch(
      /@media \(min-width: 1024px\)[\s\S]*?\.scene\.locations-scene\s*{[^}]*height:\s*100dvh;[^}]*max-height:\s*100dvh;/,
    )
    expect(globalCss).toMatch(/\.scene\.locations-scene\s*{[^}]*scroll-margin-top:\s*0;/)
    expect(globalCss).toMatch(
      /\.locations-scene__art\s*{[^}]*position:\s*absolute;[^}]*inset:\s*0;/,
    )
    expect(globalCss).toMatch(
      /\.locations-scene__interior\s*{[^}]*clip-path:\s*polygon\(/,
    )
    expect(globalCss).toMatch(
      /\.location-card__action\s*{[^}]*min-height:\s*3rem;/,
    )
    expect(globalCss).toMatch(/\.location-card__action:focus-visible\s*{[^}]*outline:/)
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.locations-scene \.section-frame__inner\s*{[^}]*grid-template-areas:/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.locations-scene__cards\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);/,
    )
    expect(globalCss).toMatch(
      /@media \(max-width: 1023px\)[\s\S]*?\.locations-scene__map-image\s*{[^}]*position:\s*absolute;/,
    )
  })

  it('locks the reviewed Locations convergence geometry and hit targets', () => {
    expect(globalCss).toMatch(/\.locations-scene__interior\s*\{[^}]*top:\s*51%;[^}]*height:\s*49%;/)
    expect(globalCss).toMatch(/\.locations-scene__map-city\s*\{[^}]*top:\s*56%;/)
    expect(globalCss).toMatch(
      /\.locations-scene__map-label\[data-map-location='modern-museum'\]\s*\{[^}]*top:\s*39\.5%;/,
    )
    expect(globalCss).toMatch(
      /\.locations-scene__map-label\[data-map-location='tsekh'\]\s*\{[^}]*top:\s*78%;/,
    )
    expect(globalCss).not.toContain('.locations-scene__card-icons')
    expect(globalCss).toMatch(/\.location-card\s*\{[^}]*position:\s*relative;/)
    expect(globalCss).toMatch(
      /\.location-card__icon\s*\{[^}]*max-width:\s*2\.375rem;[^}]*pointer-events:\s*none;/,
    )
    expect(globalCss).toMatch(
      /\.location-card__icon--pin,\s*\.location-card__icon--clock,\s*\.location-card__icon--phone\s*\{[^}]*position:\s*absolute;/,
    )
    expect(globalCss).toMatch(
      /\.location-card__action-icon\s*\{[^}]*width:\s*1\.56rem;[^}]*max-width:\s*1\.56rem;/,
    )
    expect(globalCss).not.toContain('.locations-scene__action-icons')
    expect(globalCss).not.toContain('.locations-scene__contact-icons')
    expect(globalCss).toMatch(
      /\.location-card,\s*\.location-card\[data-location-card='tsekh'\]\s*\{[^}]*min-height:\s*35\.7vh;/,
    )
    expect(globalCss).toMatch(
      /\.location-card__phone::before\s*\{[^}]*height:\s*2\.75rem;/,
    )
  })

  it('defers the documentary hero fallback until the clean backdrop fails', () => {
    render(<App />)

    const hero = screen.getByRole('region', { name: /завтраки, кофе и свой вайб/i })
    const backdrop = hero.querySelector<HTMLImageElement>('.hero-backdrop')
    expect(backdrop).toBeInTheDocument()
    expect(hero.querySelector('.hero-scene__documentary-fallback img')).not.toBeInTheDocument()
    expect(hero.querySelector('[src="/media/hero-food-cutout.png"]')).not.toBeInTheDocument()

    fireEvent.error(backdrop as HTMLImageElement)

    expect(hero.querySelector('.hero-scene__documentary-fallback')).toHaveAttribute('data-fallback-visible', 'true')
    expect(hero.querySelector('.hero-scene__documentary-fallback img')).toHaveAttribute('src', '/media/interior-01.webp')
  })

  it('does not use viewport-width full bleed that creates a narrow-screen scrollbar', () => {
    expect(globalCss).not.toContain('width: 100vw')
    expect(globalCss).not.toContain('calc((100% - 100vw) / 2)')
  })

  it('uses verified contact, location and source links', () => {
    render(<App />)

    expect(screen.getAllByRole('link', { name: /красноармейская, 15/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /куйбышева, 128\/1/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /\+7 \(937\) 235-57-15/i }).every((link) => link.getAttribute('href') === 'tel:+79372355715')).toBe(true)
    expect(screen.getAllByRole('link', { name: /маршрут|яндекс карт/i }).some((link) => link.getAttribute('href')?.includes('yandex.ru'))).toBe(true)
    expect(screen.getAllByRole('link', { name: /white cup.*vk/i }).every((link) => link.getAttribute('href') === 'https://vk.ru/white_cup')).toBe(true)
  })

  it('keeps documentary photo alternatives meaningful and doodles decorative', () => {
    render(<App />)

    const images = document.querySelectorAll('.organic-photo img')
    expect(Array.from(images).every((image) => (image.getAttribute('alt') ?? '').trim().length > 12)).toBe(true)

    const doodleContainers = document.querySelectorAll('[data-doodle]')
    expect(doodleContainers.length).toBeGreaterThan(0)
    doodleContainers.forEach((doodle) => expect(doodle).toHaveAttribute('aria-hidden', 'true'))
  })

  it('keeps the entrance clarification with both factual address variants', () => {
    render(<App />)

    const locations = screen.getByRole('region', { name: /как нас найти/i })
    expect(within(locations).getAllByText(/Красноармейская, 15/i).length).toBeGreaterThan(0)
    expect(within(locations).getAllByText(/Яндекс.*17|17.*Яндекс/i).length).toBeGreaterThan(0)
  })
})
