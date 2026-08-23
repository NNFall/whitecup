export type MediaKind = 'documentary' | 'decorative'
export type MediaSceneRole = 'hero' | 'about' | 'events' | 'locations'

export interface MediaProvenance {
  id: string
  src: string
  alt: string
  kind: MediaKind
  sourceUrl?: string
  sourceLabel: string
  provenance: string
  /** Optional runtime fallback description for decorative artwork. */
  fallbackDescription?: string
}

export interface DocumentaryMediaProvenance extends MediaProvenance {
  kind: 'documentary'
  sceneRoles: readonly MediaSceneRole[]
}

const yandexGallerySource = 'Yandex Maps public gallery photo'

export const mediaAssets = {
  'interior-01': {
    id: 'interior-01',
    src: '/media/interior-01.webp',
    alt: 'Интерьер White Cup с красным потолком, диваном и чашками кофе на столах',
    kind: 'documentary',
    sceneRoles: ['hero'],
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/1514203/2a0000016c109682c2ceb6f712128c3f4d16/XXXL',
    sourceLabel: yandexGallerySource,
    provenance:
      'Скопировано из визуально проверенного публичного фото Yandex Maps; документальная фотография.',
  },
  'interior-02': {
    id: 'interior-02',
    src: '/media/interior-02.webp',
    alt: 'Зал White Cup с красным потолком, картой на потолке и креслами',
    kind: 'documentary',
    sceneRoles: ['locations'],
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/19646909/2a0000019d305944029e9227dcca48b96620/XXXL',
    sourceLabel: yandexGallerySource,
    provenance:
      'Скопировано из визуально проверенного публичного фото Yandex Maps; документальная фотография.',
  },
  'interior-03': {
    id: 'interior-03',
    src: '/media/interior-03.webp',
    alt: 'Зал White Cup с креслами, столами и посетительницей у окна',
    kind: 'documentary',
    sceneRoles: ['events'],
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/13206104/2a00000196de0dbb3282514593bc6237bdc4/XXXL',
    sourceLabel: yandexGallerySource,
    provenance:
      'Скопировано из визуально проверенного публичного фото Yandex Maps; документальная фотография.',
  },
  'interior-04': {
    id: 'interior-04',
    src: '/media/interior-04.webp',
    alt: 'Барная стойка White Cup и зал с характерной сеткой проводов на потолке',
    kind: 'documentary',
    sceneRoles: ['locations'],
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/15510144/2a0000019629b457fc898ad13e448accc57f/XXXL',
    sourceLabel: yandexGallerySource,
    provenance:
      'Скопировано из визуально проверенного публичного фото Yandex Maps; документальная фотография.',
  },
  'interior-05': {
    id: 'interior-05',
    src: '/media/interior-05.webp',
    alt: 'Зона с диванами, художественными работами и столиками в White Cup',
    kind: 'documentary',
    sceneRoles: ['about'],
    sourceUrl:
      'https://avatars.mds.yandex.net/get-altay/17788144/2a0000019de3ad33c100c4aa6126a42e79a0/XXXL',
    sourceLabel: yandexGallerySource,
    provenance:
      'Скопировано из визуально проверенного публичного фото Yandex Maps; документальная фотография.',
  },
} satisfies Record<string, DocumentaryMediaProvenance>

export const documentaryMedia: DocumentaryMediaProvenance[] = Object.values(mediaAssets)

/**
 * Documentary interior photos are assigned to story scenes explicitly. They
 * are not food photography and must not be used as menu-item imagery.
 */
export const documentarySceneMedia: Record<MediaSceneRole, readonly DocumentaryMediaProvenance[]> = {
  hero: [mediaAssets['interior-01']],
  about: [mediaAssets['interior-05']],
  events: [mediaAssets['interior-03']],
  locations: [mediaAssets['interior-02'], mediaAssets['interior-04']],
}

export const generatedSkyline: MediaProvenance = {
  id: 'samara-skyline',
  src: '/media/samara-skyline-decorative.png',
  alt: '',
  kind: 'decorative',
  sourceLabel: 'Image Generation Skill',
  provenance:
    'Сгенерированный прозрачный силуэт Самары для декоративного слоя hero; не является документальной фотографией и не используется как карта.',
  fallbackDescription: 'При недоступности PNG показывается локальный inline SVG-эскиз силуэта Самары.',
}

export const heroReferenceArt: MediaProvenance = {
  id: 'hero-reference-art',
  src: 'reference-only://hero-reference-art',
  alt: '',
  kind: 'decorative',
  sourceLabel: 'Supplied local visual reference',
  provenance:
    'Локальный PNG-референс первого экрана использован только для арт-дирекции и не хранится/не запрашивается runtime-страницей; текст и CTA остаются семантическим DOM, а документальные фотографии хранятся отдельно.',
  fallbackDescription: 'Не загружается в live UI; runtime использует отдельную сгенерированную декоративную панель и документальный fallback.',
}

export const heroFoodCutout: MediaProvenance = {
  id: 'hero-food-cutout',
  src: '/media/hero-food-cutout.png',
  alt: '',
  kind: 'decorative',
  sourceLabel: 'Image Generation Skill + Remove Background Local',
  provenance:
    'Сгенерированный food-cutout для декоративной композиции первого экрана; фон удалён локальным Remove Background, ассет не выдаётся за документальную фотографию меню.',
}

export const heroCleanPanel: MediaProvenance = {
  id: 'hero-clean-panel',
  src: '/media/hero-clean-panel.png',
  alt: '',
  kind: 'decorative',
  sourceLabel: 'Image Generation Skill',
  provenance:
    'Сгенерированная декоративная панель по локальному референсу первого экрана: интерьер, красный потолок, бублик и кофе без текста и интерфейсных элементов; не является документальной фотографией White Cup.',
  fallbackDescription: 'При недоступности панели используется проверенный документальный интерьер White Cup.',
}

export const heroLogoBadge: MediaProvenance = {
  id: 'hero-logo-badge',
  src: '/media/hero-logo-badge.png',
  alt: 'White Cup',
  kind: 'decorative',
  sourceLabel: 'Image Generation Skill from supplied logo reference',
  provenance:
    'Изолированный декоративный знак White Cup сгенерирован по локальному референсу; используется только как логотип в шапке и не является документальной фотографией.',
}

export const heroSkylineLine: MediaProvenance = {
  id: 'hero-skyline-line',
  src: '/media/hero-skyline-line.png',
  alt: '',
  kind: 'decorative',
  sourceLabel: 'Image Generation Skill',
  provenance:
    'Сгенерированная прозрачная линейная иллюстрация горизонта Самары с собором и солнцем для декоративного слоя hero; не является картой или документальной фотографией.',
}

export const decorativeMedia: MediaProvenance[] = [
  generatedSkyline,
  heroReferenceArt,
  heroFoodCutout,
  heroCleanPanel,
  heroLogoBadge,
  heroSkylineLine,
  {
    id: 'paper-sketches',
    src: 'inline-svg-or-css',
    alt: '',
    kind: 'decorative',
    sourceLabel: 'Local SVG/CSS artwork',
    provenance:
      'Декоративные линии, карта и силуэты создаются локально; не являются фотографией и не обозначают точное местоположение.',
  },
]

export const media = {
  documentary: documentaryMedia,
  decorative: decorativeMedia,
} as const

export const mediaSource = {
  yandexCardUrl: 'https://yandex.ru/maps/org/white_cup/19381755919/',
  browserAssetBatch: '1a59acdf-cdbd-4436-96dc-c2c7910e2c6d',
  vk: {
    url: 'https://vk.ru/white_cup',
    status: 'unverified-blocked',
    verified: false,
    note:
      'Публичная VK-группа указана как источник, но её содержимое не удалось проверить в доступной браузерной среде; VK-only факты не используются.',
  },
  note: 'Only visually reviewed public Yandex WebP files are included; no generated or stock documentary imagery.',
} as const
