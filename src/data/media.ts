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

const menuCleanBaseReferenceEdit: DecorativeMediaProvenance = {
  id: 'menu-clean-base-reference-edit',
  src: '/media/menu-clean-base-1672.webp',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied menu reference',
  provenance:
    'Чистый бумажный фон с правой линейной иллюстрацией кафе, восстановленный редактированием предоставленного menu-референса без baked-текста, карточек и интерфейса. Локальный authoring PNG не публикуется; production использует только responsive WebP. Это decorative reference-art, не документальная фотография White Cup.',
}

const defineMenuCardReferenceEdit = (
  id: string,
  filename: string,
  description: string,
): DecorativeMediaProvenance => ({
  id: `menu-${id}-reference-edit`,
  src: `/media/menu-${filename}-768.webp`,
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied menu reference',
  provenance: `${description} Создано как отдельный decorative reference-edit и оптимизировано в responsive WebP; локальный authoring PNG не публикуется. Ассет не является документальной фотографией блюда White Cup.`,
})

const menuCardReferenceEdits = {
  cappuccino: defineMenuCardReferenceEdit(
    'cappuccino',
    'cappuccino',
    'Крупный кадр капучино на деревянном столе, восстановленный по композиции предоставленного menu-референса.',
  ),
  bagel: defineMenuCardReferenceEdit(
    'bagel',
    'bagel',
    'Крупный кадр бейгла с лососем на тарелке, восстановленный по композиции предоставленного menu-референса.',
  ),
  waffle: defineMenuCardReferenceEdit(
    'waffle',
    'waffle',
    'Крупный кадр вафли с ягодами, восстановленный по композиции предоставленного menu-референса.',
  ),
  syrniki: defineMenuCardReferenceEdit(
    'syrniki',
    'syrniki',
    'Крупный кадр сырников с ягодами, восстановленный по композиции предоставленного menu-референса.',
  ),
  cheesecake: defineMenuCardReferenceEdit(
    'cheesecake',
    'cheesecake',
    'Крупный кадр малинового чизкейка, восстановленный по композиции предоставленного menu-референса.',
  ),
} as const

export type MenuCardMediaId = keyof typeof menuCardReferenceEdits

export const menuSceneLayerManifest = {
  backdrop: defineSceneLayer('backdrop', menuCleanBaseReferenceEdit, {
    srcSet:
      '/media/menu-clean-base-960.webp 960w, /media/menu-clean-base-1672.webp 1672w',
    sizes: '100vw',
  }),
  cards: Object.fromEntries(
    Object.entries(menuCardReferenceEdits).map(([id, asset]) => [
      id,
      defineSceneLayer('foreground', asset, {
        srcSet: `/media/menu-${id}-480.webp 480w, /media/menu-${id}-768.webp 768w`,
        sizes: '(max-width: 480px) 82vw, (max-width: 1679px) 20vw, 17vw',
      }),
    ]),
  ) as Record<MenuCardMediaId, SceneLayerManifestEntry>,
  skyline: defineSceneLayer('decoration', heroSkylineReference),
} as const

const aboutCleanBaseReferenceEdit: DecorativeMediaProvenance = {
  id: 'about-clean-base-reference-edit',
  src: '/media/about-clean-base-1672.webp',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied About reference',
  provenance:
    'Чистая бумажно-интерьерная композиция с органическим краем, восстановленная редактированием предоставленного About-референса без baked-текста, карточек, выпечки и чашки. Локальный authoring PNG не публикуется; production использует responsive WebP. Это decorative reference-art, не документальная фотография White Cup.',
}

const aboutPastryReferenceEdit: DecorativeMediaProvenance = {
  id: 'about-pastry-reference-edit',
  src: '/media/about-pastry-cutout-1200.webp',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + Remove Background Local',
  provenance:
    'Независимый декоративный слой с булочкой и тарелкой, восстановленный по предоставленному About-референсу; прозрачность сохранена в responsive WebP. Это reference-art, не документальная фотография блюда White Cup.',
}

const aboutCoffeeReferenceEdit: DecorativeMediaProvenance = {
  id: 'about-coffee-reference-edit',
  src: '/media/about-coffee-cutout-1200.webp',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + Remove Background Local',
  provenance:
    'Независимый декоративный слой с латте, блюдцем и ложкой, восстановленный по предоставленному About-референсу; прозрачность сохранена в responsive WebP. Это reference-art, не документальная фотография напитка White Cup.',
}

const aboutDoodlesReferenceEdit: DecorativeMediaProvenance = {
  id: 'about-doodles-reference-edit',
  src: '/media/about-doodles-reference-edit-1672.webp',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied About reference + Remove Background Local',
  provenance:
    'Независимый полноэкранный прозрачный слой с облаками, птицами, сердцем и пунктирными линиями, восстановленный по предоставленному About-референсу через Image Generation Skill и Remove Background Local. Исходный authoring PNG не публикуется; production использует alpha-preserving lossless WebP. Это декоративный reference-art, не документальная фотография или карта.',
}

const defineAboutBenefitReferenceEdit = (
  id: string,
  filename: string,
  description: string,
): DecorativeMediaProvenance => ({
  id: `about-benefit-${id}-reference-edit`,
  src: `/media/about-benefit-${filename}-480.webp`,
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied About reference + Remove Background Local',
  provenance: `${description} Иллюстрация отделена в самостоятельный прозрачный WebP-слой; это decorative reference-art, не документальная фотография.`,
})

const aboutBenefitReferenceEdits = {
  'specialty-coffee': defineAboutBenefitReferenceEdit(
    'specialty-coffee',
    'coffee',
    'Линейная чашка кофе с оранжевым сердцем, восстановленная по первой benefit-карточке About-референса.',
  ),
  'all-day-breakfast': defineAboutBenefitReferenceEdit(
    'all-day-breakfast',
    'breakfast',
    'Линейная вафля с ягодами, восстановленная по второй benefit-карточке About-референса.',
  ),
  'cozy-atmosphere': defineAboutBenefitReferenceEdit(
    'cozy-atmosphere',
    'chair',
    'Линейное кресло, торшер и оранжевая подушка, восстановленные по третьей benefit-карточке About-референса.',
  ),
  'samara-centre': defineAboutBenefitReferenceEdit(
    'samara-centre',
    'samara',
    'Линейный городской силуэт Самары с оранжевым солнцем, восстановленный по четвёртой benefit-карточке About-референса; не является картой.',
  ),
} as const

export type AboutBenefitMediaId = keyof typeof aboutBenefitReferenceEdits

export const aboutSceneLayerManifest = {
  backdrop: defineSceneLayer('backdrop', aboutCleanBaseReferenceEdit, {
    srcSet:
      '/media/about-clean-base-960.webp 960w, /media/about-clean-base-1672.webp 1672w',
    sizes: '100vw',
  }),
  foregrounds: [
    defineSceneLayer('foreground', aboutPastryReferenceEdit, {
      srcSet:
        '/media/about-pastry-cutout-720.webp 720w, /media/about-pastry-cutout-1200.webp 1200w',
      sizes: '(max-width: 1023px) 128vw, 63vw',
    }),
    defineSceneLayer('foreground', aboutCoffeeReferenceEdit, {
      srcSet:
        '/media/about-coffee-cutout-720.webp 720w, /media/about-coffee-cutout-1200.webp 1200w',
      sizes: '(max-width: 1023px) 88vw, 32vw',
    }),
  ],
  benefits: Object.fromEntries(
    Object.entries(aboutBenefitReferenceEdits).map(([id, asset]) => [
      id,
      defineSceneLayer('decoration', asset, { sizes: '(max-width: 720px) 34vw, 9vw' }),
    ]),
  ) as Record<AboutBenefitMediaId, SceneLayerManifestEntry>,
  decoration: defineSceneLayer('decoration', aboutDoodlesReferenceEdit, {
    sizes: '100vw',
  }),
} as const

const visitCleanBaseReferenceEdit: DecorativeMediaProvenance = {
  id: 'visit-clean-base-reference-edit',
  src: '/media/rhythm-clean-base-desktop.webp',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied Visit reference',
  provenance:
    'Чистый тёплый бумажный фон с верхней правой линейной иллюстрацией кафе и пунктирным маршрутом, восстановленный редактированием предоставленного Visit-референса без baked-текста и карточек. Локальный authoring PNG не публикуется; production использует responsive WebP. Это decorative reference-art, не документальная фотография White Cup.',
}

const defineVisitCardReferenceEdit = (
  id: string,
  filename: string,
  description: string,
): DecorativeMediaProvenance => ({
  id: `visit-${id}-reference-edit`,
  src: `/media/rhythm-${filename}-reference-edit-800.webp`,
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied Visit reference',
  provenance: `${description} Создано как отдельный decorative reference-edit и оптимизировано в WebP; локальный authoring PNG не публикуется. Ассет не является документальной фотографией White Cup.`,
})

const visitCardReferenceEdits = {
  'morning-coffee': defineVisitCardReferenceEdit(
    'morning-coffee',
    'coffee-badged',
    'Крупный кадр латте с аккуратно восстановленным знаком White Cup на чашке, собранный по первой карточке предоставленного Visit-референса.',
  ),
  'meeting-in-centre': defineVisitCardReferenceEdit(
    'meeting-in-centre',
    'table',
    'Кадр уютного столика в кафе, восстановленный по второй карточке предоставленного Visit-референса.',
  ),
  'quiet-pause': defineVisitCardReferenceEdit(
    'quiet-pause',
    'waffle',
    'Крупный кадр вафли с ягодами, восстановленный по третьей карточке предоставленного Visit-референса.',
  ),
} as const

export type VisitCardMediaId = keyof typeof visitCardReferenceEdits

const visitDoodlesReferenceEdit: DecorativeMediaProvenance = {
  id: 'visit-doodles-reference-edit',
  src: '/media/rhythm-doodles-reference-edit-1672.webp',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Supplied Visit reference + Remove Background Local',
  provenance:
    'Полноэкранный прозрачный слой с точными облаками, птицами, солнцем, маршрутом, стаканчиком, карточными иконками и маленькими штрихами из предоставленного Visit-референса. Фон удалён локально, production использует alpha-preserving WebP; это декоративный reference-art.',
}

const visitSkylineReferenceEdit: DecorativeMediaProvenance = {
  id: 'visit-skyline-reference-edit',
  src: '/media/rhythm-skyline-reference-edit-1200w.webp',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Supplied Visit reference + Remove Background Local',
  provenance:
    'Отдельный прозрачный городской skyline, извлечённый из нижней части предоставленного Visit-референса и оптимизированный в responsive WebP. Это декоративная иллюстрация, не карта и не документальная фотография.',
}

export const visitSceneLayerManifest = {
  backdrop: defineSceneLayer('backdrop', visitCleanBaseReferenceEdit, {
    srcSet:
      '/media/rhythm-clean-base-mobile-960.webp 960w, /media/rhythm-clean-base-desktop.webp 1672w',
    sizes: '100vw',
  }),
  cards: Object.fromEntries(
    Object.entries(visitCardReferenceEdits).map(([id, asset]) => [
      id,
      defineSceneLayer('foreground', asset, {
        sizes: '(max-width: 1023px) 88vw, 27vw',
      }),
    ]),
  ) as Record<VisitCardMediaId, SceneLayerManifestEntry>,
  decoration: defineSceneLayer('decoration', visitDoodlesReferenceEdit, {
    srcSet:
      '/media/rhythm-doodles-reference-edit-960.webp 960w, /media/rhythm-doodles-reference-edit-1672.webp 1672w',
    sizes: '100vw',
  }),
  skyline: defineSceneLayer('decoration', visitSkylineReferenceEdit, {
    srcSet:
      '/media/rhythm-skyline-reference-edit-720w.webp 720w, /media/rhythm-skyline-reference-edit-1200w.webp 1200w',
    sizes: '(max-width: 1023px) 92vw, 47vw',
  }),
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
  menuCleanBaseReferenceEdit,
  ...Object.values(menuCardReferenceEdits),
  aboutCleanBaseReferenceEdit,
  aboutPastryReferenceEdit,
  aboutCoffeeReferenceEdit,
  aboutDoodlesReferenceEdit,
  ...Object.values(aboutBenefitReferenceEdits),
  visitCleanBaseReferenceEdit,
  ...Object.values(visitCardReferenceEdits),
  visitDoodlesReferenceEdit,
  visitSkylineReferenceEdit,
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
