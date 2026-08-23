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

export const decorativeMedia: MediaProvenance[] = [
  generatedSkyline,
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
