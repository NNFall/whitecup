import { fireEvent, render, screen, within } from '@testing-library/react'

import App from '../App'
import { heroSceneLayerManifest } from '../data/media'
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
      ['.hero-backdrop', '/media/hero-clean-base-edit-1672.webp', 'backdrop', 'decorative-reference-edit'],
      ['.hero-bagel', '/media/hero-bagel-cutout-1200.webp', 'foreground', 'decorative-reference-edit'],
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
      '/media/hero-clean-base-edit-960.webp 960w, /media/hero-clean-base-edit-1672.webp 1672w',
    )
    expect(hero.querySelector('.hero-backdrop')).toHaveAttribute('sizes', '100vw')
    expect(hero.querySelector('.hero-backdrop')).toHaveAttribute('fetchpriority', 'high')
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
      '/media/hero-route-cup.png',
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
      '/media/hero-skyline-exact.png',
    )
    expect(menu.querySelectorAll('[data-scene-card-image]')).toHaveLength(5)
    expect(menu.innerHTML).not.toMatch(/ChatGPT Image|01_44_54 \(2\)|menu-clean-base\.png/i)
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

    expect(screen.getByRole('link', { name: /красноармейская, 15/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /куйбышева, 128\/1/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /\+7 \(937\) 235-57-15/i }).every((link) => link.getAttribute('href') === 'tel:+79372355715')).toBe(true)
    expect(screen.getAllByRole('link', { name: /маршрут|яндекс карт/i }).some((link) => link.getAttribute('href')?.includes('yandex.ru'))).toBe(true)
    expect(screen.getAllByRole('link', { name: /white cup.*vk/i }).every((link) => link.getAttribute('href') === 'https://vk.ru/white_cup')).toBe(true)
  })

  it('keeps documentary photo alternatives meaningful and doodles decorative', () => {
    render(<App />)

    const images = document.querySelectorAll('.organic-photo img')
    expect(images.length).toBeGreaterThanOrEqual(3)
    expect(Array.from(images).every((image) => (image.getAttribute('alt') ?? '').trim().length > 12)).toBe(true)

    const doodleContainers = document.querySelectorAll('[data-doodle]')
    expect(doodleContainers.length).toBeGreaterThan(0)
    doodleContainers.forEach((doodle) => expect(doodle).toHaveAttribute('aria-hidden', 'true'))
  })

  it('keeps the entrance clarification with both factual address variants', () => {
    render(<App />)

    const locations = screen.getByRole('region', { name: /адреса/i })
    expect(within(locations).getAllByText(/Красноармейская, 15/i).length).toBeGreaterThan(0)
    expect(within(locations).getByText(/Яндекс.*17|17.*Яндекс/i)).toBeInTheDocument()
  })
})
