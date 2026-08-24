export type SceneLayerMediaKind =
  | 'decorative-reference-edit'
  | 'decorative-reference-extract'
  | 'decorative-generated'

export type MediaKind = 'documentary' | 'decorative'
export type MediaSceneRole = 'hero' | 'about' | 'events' | 'locations'
export type SceneLayerRole = 'backdrop' | 'foreground' | 'decoration'

interface MediaProvenanceBase {
  id: string
  src: string
  /** Original high-resolution authoring artifact; production may use derivatives. */
  sourceArtifactSrc?: string
  alt: string
  sourceUrl?: string
  sourceLabel: string
  provenance: string
  /** Optional runtime fallback description for decorative artwork. */
  fallbackDescription?: string
}

export interface DocumentaryMediaProvenance extends MediaProvenanceBase {
  kind: 'documentary'
  sceneRoles: readonly MediaSceneRole[]
}

export interface DecorativeMediaProvenance extends MediaProvenanceBase {
  kind: 'decorative'
  provenanceKind: SceneLayerMediaKind
}

export type MediaProvenance = DocumentaryMediaProvenance | DecorativeMediaProvenance

export interface SceneLayerManifestEntry {
  asset: DecorativeMediaProvenance
  layer: SceneLayerRole
  src: string
  srcSet?: string
  sizes?: string
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

export const generatedSkyline: DecorativeMediaProvenance = {
  id: 'samara-skyline',
  src: '/media/samara-skyline-decorative.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-generated',
  sourceLabel: 'Image Generation Skill',
  provenance:
    'Сгенерированный прозрачный силуэт Самары для декоративного слоя hero; не является документальной фотографией и не используется как карта.',
  fallbackDescription: 'При недоступности PNG показывается локальный inline SVG-эскиз силуэта Самары.',
}

/**
 * The reference hero is intentionally assembled from independent decorative
 * layers. Keeping each file in the provenance registry makes it explicit that
 * these are reference-art or synthetic art-direction assets, not documentary
 * venue evidence.
 */
export const heroCafeBackdrop: DecorativeMediaProvenance = {
  id: 'hero-cafe-backdrop',
  src: '/media/hero-reference-cafe-crop.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied reference crop',
  provenance:
    'Изолированный правый фотопанельный crop из предоставленного 1672×941 референса; из crop удалены baked-навигация и текстовые фрагменты, DOM-типографика остаётся семантической. Это декоративный reference-art, не документальная фотография White Cup.',
  fallbackDescription: 'При недоступности reference crop показывается проверенный документальный интерьер White Cup как визуальный fallback.',
}

export const heroFoodBurger: DecorativeMediaProvenance = {
  id: 'hero-food-burger',
  src: '/media/hero-food-burger.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-generated',
  sourceLabel: 'Image Generation Skill + Remove Background Local',
  provenance:
    'Синтетический декоративный breakfast-бургер/бублик для арт-дирекции первого экрана; фон удалён локальным Remove Background и ассет не выдаётся за документальную фотографию меню.',
}

export const heroFoodLatte: DecorativeMediaProvenance = {
  id: 'hero-food-latte',
  src: '/media/hero-food-latte.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-generated',
  sourceLabel: 'Image Generation Skill + Remove Background Local',
  provenance:
    'Синтетический декоративный латте в чашке для арт-дирекции первого экрана; фон удалён локальным Remove Background и ассет не выдаётся за документальную фотографию White Cup.',
}

export const heroDoodlesReference: DecorativeMediaProvenance = {
  id: 'hero-doodles-reference',
  src: '/media/hero-doodles-exact.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied reference crop + local alpha extraction',
  provenance:
    'Точечно извлечённые из предоставленного референса облака, птица, сердце и маленькие marks на прозрачный холст; baked-типографика и навигация не входят в ассет.',
}

export const heroSkylineReference: DecorativeMediaProvenance = {
  id: 'hero-skyline-reference',
  src: '/media/hero-skyline-exact.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied reference crop + local alpha extraction',
  provenance:
    'Точно извлечённая из нижней части предоставленного референса прозрачная линейная иллюстрация с orange sun; не является картой или документальной фотографией.',
}

export const heroGeneratedLayers = [
  heroCafeBackdrop,
  heroFoodBurger,
  heroFoodLatte,
  heroDoodlesReference,
  heroSkylineReference,
] as const

export const heroCleanBaseEdit: DecorativeMediaProvenance = {
  id: 'hero-clean-base-edit',
  src: '/media/hero-clean-base-edit-1672.webp',
  sourceArtifactSrc: '/media/hero-clean-base-edit-poc.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied reference',
  provenance:
    'Отредактированный по предоставленному референсу чистый фон hero без навигации, текста, логотипа, doodles, бублика и чашки; исходный PNG сохранён как authoring artifact, production использует responsive WebP. Reference-art, не документальная фотография White Cup.',
}

export const heroBagelReferenceEdit: DecorativeMediaProvenance = {
  id: 'hero-bagel-reference-edit',
  src: '/media/hero-bagel-cutout-1200.webp',
  sourceArtifactSrc: '/media/hero-bagel-cutout-poc.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + Remove Background Local',
  provenance:
    'Изолированный по предоставленному hero-референсу декоративный бублик с тарелкой; прозрачность создана локальным Remove Background и сохранена в responsive WebP, исходный PNG оставлен как authoring artifact. Ассет не является документальной фотографией меню.',
}

export const heroCoffeeReferenceEdit: DecorativeMediaProvenance = {
  id: 'hero-coffee-reference-edit',
  src: '/media/hero-coffee-cutout-1200.webp',
  sourceArtifactSrc: '/media/hero-coffee-cutout-poc.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + Remove Background Local',
  provenance:
    'Изолированная по предоставленному hero-референсу декоративная чашка латте с блюдцем и ложкой; прозрачность создана локальным Remove Background и сохранена в responsive WebP, исходный PNG оставлен как authoring artifact. Ассет не является документальной фотографией меню.',
}

export const heroRouteCupReferenceEdit: DecorativeMediaProvenance = {
  id: 'hero-route-cup-reference-edit',
  src: '/media/hero-route-cup-1672.webp',
  sourceArtifactSrc: '/media/hero-route-cup.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied reference + Remove Background Local',
  provenance:
    'Независимый прозрачный слой с тонким пунктирным маршрутом и маленькой чашкой, восстановленный по геометрии предоставленного hero-референса; декоративный reference-edit, не документальная фотография.',
}

const defineSceneLayer = (
  layer: SceneLayerRole,
  asset: DecorativeMediaProvenance,
  responsive?: Pick<SceneLayerManifestEntry, 'sizes' | 'srcSet'>,
): SceneLayerManifestEntry => ({ asset, layer, src: asset.src, ...responsive })

export const heroSceneLayerManifest = {
  backdrop: defineSceneLayer('backdrop', heroCleanBaseEdit, {
    srcSet:
      '/media/hero-clean-base-edit-960.webp 960w, /media/hero-clean-base-edit-1672.webp 1672w',
    sizes: '100vw',
  }),
  foregrounds: [
    defineSceneLayer('foreground', heroBagelReferenceEdit, {
      srcSet:
        '/media/hero-bagel-cutout-720.webp 720w, /media/hero-bagel-cutout-1200.webp 1200w',
      sizes: '(max-width: 480px) 130vw, (max-width: 720px) 125vw, 40vw',
    }),
    defineSceneLayer('foreground', heroCoffeeReferenceEdit, {
      srcSet:
        '/media/hero-coffee-cutout-720.webp 720w, /media/hero-coffee-cutout-1200.webp 1200w',
      sizes: '(max-width: 480px) 102vw, (max-width: 720px) 98vw, 30vw',
    }),
  ],
  decorations: [
    defineSceneLayer('decoration', heroDoodlesReference),
    defineSceneLayer('decoration', heroRouteCupReferenceEdit),
    defineSceneLayer('decoration', heroSkylineReference),
  ],
} as const

export const heroFoodCutout: DecorativeMediaProvenance = {
  id: 'hero-food-cutout',
  src: '/media/hero-food-cutout.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-generated',
  sourceLabel: 'Image Generation Skill + Remove Background Local',
  provenance:
    'Сгенерированный food-cutout для декоративной композиции первого экрана; фон удалён локальным Remove Background, ассет не выдаётся за документальную фотографию меню.',
}

export const heroCleanPanel: DecorativeMediaProvenance = {
  id: 'hero-clean-panel',
  src: '/media/hero-clean-panel.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill',
  provenance:
    'Сгенерированная декоративная панель по локальному референсу первого экрана: интерьер, красный потолок, бублик и кофе без текста и интерфейсных элементов; не является документальной фотографией White Cup.',
  fallbackDescription: 'При недоступности панели используется проверенный документальный интерьер White Cup.',
}

export const heroLogoBadge: DecorativeMediaProvenance = {
  id: 'hero-logo-badge',
  src: '/media/hero-logo-reference.png',
  alt: 'White Cup',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied reference crop + local alpha extraction',
  provenance:
    'Точно извлечённый знак White Cup из предоставленного первого экранного референса с прозрачным paper-background; используется как декоративный header-asset, не является документальной фотографией.',
}

export const heroSkylineLine: DecorativeMediaProvenance = {
  id: 'hero-skyline-line',
  src: '/media/hero-skyline-line.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-generated',
  sourceLabel: 'Image Generation Skill',
  provenance:
    'Сгенерированная прозрачная линейная иллюстрация горизонта Самары с собором и солнцем для декоративного слоя hero; не является картой или документальной фотографией.',
}

export const decorativeMedia: DecorativeMediaProvenance[] = [
  generatedSkyline,
  ...heroGeneratedLayers,
  heroCleanBaseEdit,
  heroBagelReferenceEdit,
  heroCoffeeReferenceEdit,
  heroRouteCupReferenceEdit,
  heroFoodCutout,
  heroCleanPanel,
  heroLogoBadge,
  heroSkylineLine,
  {
    id: 'paper-sketches',
    src: 'inline-svg-or-css',
    alt: '',
    kind: 'decorative',
    provenanceKind: 'decorative-generated',
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
