export type SceneLayerMediaKind =
  | 'decorative-reference-edit'
  | 'decorative-reference-extract'
  | 'decorative-generated'

export type MediaKind = 'documentary' | 'decorative'
export type MediaSceneRole = 'hero' | 'about' | 'events' | 'locations'
export type SceneLayerRole = 'backdrop' | 'foreground' | 'decoration'

/**
 * Resolve public media through Vite's deployment base.  The local dev server
 * keeps the familiar `/media/...` paths, while nested static deployments such
 * as `/site/whitecup/` receive the same prefix as Vite's hashed assets.
 */
const mediaBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

export const mediaUrl = (path: string): string => {
  if (!path.startsWith('/')) return path
  return `${mediaBase}${path}`
}

export const mediaSrcSet = (srcSet: string): string =>
  srcSet.replaceAll('/media/', `${mediaBase}/media/`)

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

export interface ResponsiveDecorativeMediaProvenance extends DecorativeMediaProvenance {
  srcSet: string
  sizes: string
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
    src: mediaUrl('/media/interior-01.webp'),
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
    src: mediaUrl('/media/interior-02.webp'),
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
    src: mediaUrl('/media/interior-03.webp'),
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
    src: mediaUrl('/media/interior-04.webp'),
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
    src: mediaUrl('/media/interior-05.webp'),
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

export const heroDoodlesReference: DecorativeMediaProvenance = {
  id: 'hero-doodles-reference',
  src: mediaUrl('/media/hero-doodles-exact.png'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied reference crop + local alpha extraction',
  provenance:
    'Точечно извлечённые из предоставленного референса облака, птица, сердце и маленькие marks на прозрачный холст; baked-типографика и навигация не входят в ассет.',
}

export const heroUnderlineReferenceExtract: DecorativeMediaProvenance = {
  id: 'hero-underline-reference-extract',
  src: mediaUrl('/media/hero-underline-reference-extract-tight.webp'),
  sourceArtifactSrc: 'docs/reference/assets/hero-underline-reference-crop-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied reference crop + exact orange alpha extraction',
  provenance:
    'Точный прозрачный orange-штрих под White Cup, извлечённый из предоставленного hero-референса без baked-текста и paper-фона; production WebP обрезан по alpha-bounds.',
}

export const heroTitleReferenceExtract: ResponsiveDecorativeMediaProvenance = {
  id: 'hero-title-reference-extract',
  src: mediaUrl('/media/hero-title-reference-extract-1600.webp'),
  srcSet: mediaSrcSet('/media/hero-title-reference-extract-800.webp 800w, /media/hero-title-reference-extract-1600.webp 1600w'),
  sizes: '47.85vw',
  sourceArtifactSrc: 'docs/reference/assets/hero-title-reference-crop-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied hero reference crop + local alpha extraction',
  provenance:
    'Точный прозрачный заголовочный слой первого hero, извлечённый из предоставленного референса; включает рукописные контуры, orange-акцент, underline и малые marks, но не содержит paper-фона, навигации или фотографии. Это reference-extract, не документальная фотография и не сгенерированная сцена.',
}

export const heroSkylineReference: DecorativeMediaProvenance = {
  id: 'hero-skyline-reference',
  src: mediaUrl('/media/hero-skyline-exact.png'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied reference crop + local alpha extraction',
  provenance:
    'Точно извлечённая из нижней части предоставленного референса прозрачная линейная иллюстрация с orange sun; не является картой или документальной фотографией.',
}

/**
 * Shared transparent skyline for the paper rhythm scenes. Unlike the small
 * hero extract, this responsive asset keeps the full city line at its native
 * 1200:242 ratio, so menu/footer placement never needs a vertical squash.
 */
const rhythmSkylineReferenceEdit: DecorativeMediaProvenance = {
  id: 'rhythm-skyline-reference-edit',
  src: mediaUrl('/media/rhythm-skyline-reference-edit-1200w.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Supplied rhythm reference + Remove Background Local',
  provenance:
    'Отдельный прозрачный городской skyline, извлечённый из предоставленного rhythm/Visit-референса и оптимизированный в responsive WebP. Это декоративная иллюстрация, не карта и не документальная фотография White Cup.',
}

export const heroCleanBaseEdit: DecorativeMediaProvenance = {
  id: 'hero-clean-base-edit',
  src: mediaUrl('/media/hero-clean-base-v2-1672.webp'),
  sourceArtifactSrc: 'docs/reference/assets/hero-clean-base-v2-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied reference',
  provenance:
    'Отредактированный по предоставленному референсу чистый фон hero без навигации, текста, логотипа, doodles, бублика и чашки; исходный PNG сохранён в docs/reference/assets как authoring artifact, production использует responsive WebP. Reference-art, не документальная фотография White Cup.',
}

export const heroBagelReferenceEdit: DecorativeMediaProvenance = {
  id: 'hero-bagel-reference-edit',
  src: mediaUrl('/media/hero-bagel-plate-reference-edit-1200.webp'),
  sourceArtifactSrc: 'docs/reference/assets/hero-bagel-plate-magenta-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + chroma alpha extraction',
  provenance:
    'Изолированный по предоставленному hero-референсу декоративный бублик с бумажной подложкой и полной тарелкой; после ImageGen-редактирования альфа создана точным chroma-key. Remove Background Local был проверен, но не использован в production из-за потери белой тарелки. Исходный PNG сохранён в docs/reference/assets; ассет не является документальной фотографией меню.',
}

export const heroCoffeeReferenceEdit: DecorativeMediaProvenance = {
  id: 'hero-coffee-reference-edit',
  src: mediaUrl('/media/hero-coffee-cutout-1200.webp'),
  sourceArtifactSrc: 'docs/reference/assets/hero-coffee-cutout-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + Remove Background Local',
  provenance:
    'Изолированная по предоставленному hero-референсу декоративная чашка латте с блюдцем и ложкой; прозрачность создана локальным Remove Background и сохранена в responsive WebP, исходный PNG оставлен как authoring artifact. Ассет не является документальной фотографией меню.',
}

export const heroRouteCupReferenceEdit: DecorativeMediaProvenance = {
  id: 'hero-route-cup-reference-edit',
  src: mediaUrl('/media/hero-route-cup-1672.webp'),
  sourceArtifactSrc: 'docs/reference/assets/hero-route-cup-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied reference + Remove Background Local',
  provenance:
    'Независимый прозрачный слой с тонким пунктирным маршрутом и маленькой чашкой, восстановленный по геометрии предоставленного hero-референса; декоративный reference-edit, не документальная фотография.',
}

export const storyRouteConnectorGenerated: ResponsiveDecorativeMediaProvenance = {
  id: 'story-route-connector-generated',
  src: mediaUrl('/media/story-route-connector-1200.webp'),
  srcSet: mediaSrcSet('/media/story-route-connector-720.webp 720w, /media/story-route-connector-1200.webp 1200w, /media/story-route-connector-2400.webp 2400w'),
  sizes:
    '(max-width: 433px) 155vw, (max-width: 1023px) 42rem, (max-width: 1304px) 92vw, 75rem',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-generated',
  sourceLabel: 'Image Generation Skill, reference-informed decorative route',
  provenance:
    'Новый прозрачный декоративный маршрут с чашкой, облаками, птицами, листом и orange-штрихами, сгенерированный по линии и настроению supplied hero reference. Используется только между сценами, не является картой, документальной фотографией или фактом о White Cup.',
}

const defineSceneLayer = (
  layer: SceneLayerRole,
  asset: DecorativeMediaProvenance,
  responsive?: Pick<SceneLayerManifestEntry, 'sizes' | 'srcSet'>,
): SceneLayerManifestEntry => ({ asset, layer, src: asset.src, ...responsive })

export const heroSceneLayerManifest = {
  backdrop: defineSceneLayer('backdrop', heroCleanBaseEdit, {
    srcSet: mediaSrcSet('/media/hero-clean-base-v2-960.webp 960w, /media/hero-clean-base-v2-1672.webp 1672w'),
    sizes: '100vw',
  }),
  foregrounds: [
    defineSceneLayer('foreground', heroBagelReferenceEdit, {
      srcSet: mediaSrcSet('/media/hero-bagel-plate-reference-edit-720.webp 720w, /media/hero-bagel-plate-reference-edit-1200.webp 1200w'),
      sizes: '(max-width: 480px) 130vw, (max-width: 720px) 125vw, 40vw',
    }),
    defineSceneLayer('foreground', heroCoffeeReferenceEdit, {
      srcSet: mediaSrcSet('/media/hero-coffee-cutout-720.webp 720w, /media/hero-coffee-cutout-1200.webp 1200w'),
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
  src: mediaUrl('/media/menu-clean-base-1672.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied menu reference',
  provenance:
    'Чистый бумажный фон с правой линейной иллюстрацией кафе, восстановленный редактированием предоставленного menu-референса без baked-текста, карточек и интерфейса. Локальный authoring PNG не публикуется; production использует только responsive WebP. Это decorative reference-art, не документальная фотография White Cup.',
}

export const menuTitleReferenceExtract: ResponsiveDecorativeMediaProvenance = {
  id: 'menu-title-reference-extract',
  src: mediaUrl('/media/menu-title-reference-extract-1688.webp'),
  srcSet: mediaSrcSet('/media/menu-title-reference-extract-844.webp 844w, /media/menu-title-reference-extract-1688.webp 1688w'),
  sizes: '50.48vw',
  sourceArtifactSrc: 'docs/reference/assets/menu-title-reference-crop-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied menu reference crop + local alpha extraction',
  provenance:
    'Точный прозрачный рукописный заголовок menu-сцены с orange-акцентом и underline, извлечённый из предоставленного референса. Используется только как desktop reference-extract поверх живого h2; не является документальной фотографией или сгенерированной сценой.',
}

const defineMenuCardReferenceEdit = (
  id: string,
  filename: string,
  description: string,
): DecorativeMediaProvenance => ({
  id: `menu-${id}-reference-edit`,
  src: mediaUrl(`/media/menu-${filename}-768.webp`),
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
  oatmeal: defineMenuCardReferenceEdit(
    'oatmeal',
    'oatmeal',
    'Отдельный editorial-кадр овсяной каши с ягодами, орехами и мёдом для расширения сезонной подборки меню.',
  ),
  shakshuka: defineMenuCardReferenceEdit(
    'shakshuka',
    'shakshuka',
    'Отдельный editorial-кадр шакшуки с яйцами и тёплым хлебом для расширения завтраков.',
  ),
  croissant: defineMenuCardReferenceEdit(
    'croissant',
    'croissant',
    'Отдельный editorial-кадр круассана с джемом и ягодами для расширения витрины.',
  ),
} as const

export type MenuCardMediaId = keyof typeof menuCardReferenceEdits

export const menuSceneLayerManifest = {
  backdrop: defineSceneLayer('backdrop', menuCleanBaseReferenceEdit, {
    srcSet: mediaSrcSet('/media/menu-clean-base-960.webp 960w, /media/menu-clean-base-1672.webp 1672w'),
    sizes: '100vw',
  }),
  cards: Object.fromEntries(
    Object.entries(menuCardReferenceEdits).map(([id, asset]) => [
      id,
      defineSceneLayer('foreground', asset, {
        srcSet: mediaSrcSet(`/media/menu-${id}-480.webp 480w, /media/menu-${id}-768.webp 768w`),
        sizes: '(max-width: 480px) 82vw, (max-width: 1679px) 20vw, 17vw',
      }),
    ]),
  ) as Record<MenuCardMediaId, SceneLayerManifestEntry>,
  skyline: defineSceneLayer('decoration', rhythmSkylineReferenceEdit, {
    srcSet: mediaSrcSet('/media/rhythm-skyline-reference-edit-720w.webp 720w, /media/rhythm-skyline-reference-edit-1200w.webp 1200w'),
    sizes: '(max-width: 1023px) 90vw, min(36vw, 42rem)',
  }),
} as const

const aboutCleanBaseReferenceEdit: DecorativeMediaProvenance = {
  id: 'about-clean-base-reference-edit',
  src: mediaUrl('/media/about-clean-base-1672.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied About reference',
  provenance:
    'Чистая бумажно-интерьерная композиция с органическим краем, восстановленная редактированием предоставленного About-референса без baked-текста, карточек, выпечки и чашки. Локальный authoring PNG не публикуется; production использует responsive WebP. Это decorative reference-art, не документальная фотография White Cup.',
}

export const aboutTitleReferenceUpperExtract: ResponsiveDecorativeMediaProvenance = {
  id: 'about-title-reference-upper-extract',
  src: mediaUrl('/media/about-title-reference-upper-extract-1590.webp'),
  srcSet: mediaSrcSet('/media/about-title-reference-upper-extract-795.webp 795w, /media/about-title-reference-upper-extract-1590.webp 1590w'),
  sizes: '47.55vw',
  sourceArtifactSrc: 'docs/reference/assets/about-title-reference-upper-crop-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied about reference crop + local alpha extraction',
  provenance:
    'Точный верхний прозрачный рукописный title-layer about-сцены, извлечённый из предоставленного референса. Отделён от нижней строки для сохранения исходной сетки; не является документальной фотографией или сгенерированной сценой.',
}

export const aboutTitleReferenceLowerExtract: ResponsiveDecorativeMediaProvenance = {
  id: 'about-title-reference-lower-extract',
  src: mediaUrl('/media/about-title-reference-lower-extract-1750.webp'),
  srcSet: mediaSrcSet('/media/about-title-reference-lower-extract-875.webp 875w, /media/about-title-reference-lower-extract-1750.webp 1750w'),
  sizes: '52.33vw',
  sourceArtifactSrc: 'docs/reference/assets/about-title-reference-lower-crop-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied about reference crop + local alpha extraction',
  provenance:
    'Точная нижняя прозрачная строка рукописного title-layer about-сцены с orange-акцентом, извлечённая из предоставленного референса. Не является документальной фотографией или сгенерированной сценой.',
}

const aboutPastryReferenceEdit: DecorativeMediaProvenance = {
  id: 'about-pastry-plate-reference-edit-v2',
  src: mediaUrl('/media/about-pastry-plate-reference-edit-v2-1200.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied About reference, v2',
  provenance:
    'Независимый декоративный слой с булочкой и полной узорной тарелкой, восстановленный по предоставленному About-референсу; прозрачность сохранена в responsive WebP. Это reference-art, не документальная фотография блюда White Cup.',
}

const aboutCoffeeReferenceEdit: DecorativeMediaProvenance = {
  id: 'about-coffee-reference-edit',
  src: mediaUrl('/media/about-coffee-cutout-1200.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + Remove Background Local',
  provenance:
    'Независимый декоративный слой с латте, блюдцем и ложкой, восстановленный по предоставленному About-референсу; прозрачность сохранена в responsive WebP. Это reference-art, не документальная фотография напитка White Cup.',
}

const aboutDoodlesReferenceEdit: DecorativeMediaProvenance = {
  id: 'about-doodles-reference-edit',
  src: mediaUrl('/media/about-doodles-reference-edit-1672.webp'),
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
  src: mediaUrl(`/media/about-benefit-${filename}-480.webp`),
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
    srcSet: mediaSrcSet('/media/about-clean-base-960.webp 960w, /media/about-clean-base-1672.webp 1672w'),
    sizes: '100vw',
  }),
  foregrounds: [
    defineSceneLayer('foreground', aboutPastryReferenceEdit, {
      srcSet: mediaSrcSet('/media/about-pastry-plate-reference-edit-v2-720.webp 720w, /media/about-pastry-plate-reference-edit-v2-1200.webp 1200w'),
      sizes: '(max-width: 1023px) 128vw, 23vw',
    }),
    defineSceneLayer('foreground', aboutCoffeeReferenceEdit, {
      srcSet: mediaSrcSet('/media/about-coffee-cutout-720.webp 720w, /media/about-coffee-cutout-1200.webp 1200w'),
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
  src: mediaUrl('/media/rhythm-clean-base-desktop.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied Visit reference',
  provenance:
    'Чистый тёплый бумажный фон с верхней правой линейной иллюстрацией кафе и пунктирным маршрутом, восстановленный редактированием предоставленного Visit-референса без baked-текста и карточек. Локальный authoring PNG не публикуется; production использует responsive WebP. Это decorative reference-art, не документальная фотография White Cup.',
}

export const visitTitleReferenceExtract: ResponsiveDecorativeMediaProvenance = {
  id: 'visit-title-reference-extract',
  src: mediaUrl('/media/visit-title-reference-extract-1560.webp'),
  srcSet: mediaSrcSet('/media/visit-title-reference-extract-780.webp 780w, /media/visit-title-reference-extract-1560.webp 1560w'),
  sizes: '47.85vw',
  sourceArtifactSrc: 'docs/reference/assets/visit-title-reference-crop-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied Visit reference crop + local alpha extraction',
  provenance:
    'Точный прозрачный рукописный заголовок Visit-сцены с orange-акцентом и underline, извлечённый из предоставленного референса. Используется только как desktop reference-extract поверх живого h2; не является документальной фотографией или сгенерированной сценой.',
}

const defineVisitCardReferenceEdit = (
  id: string,
  filename: string,
  description: string,
): DecorativeMediaProvenance => ({
  id: `visit-${id}-reference-edit`,
  src: mediaUrl(`/media/rhythm-${filename}-reference-edit-800.webp`),
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
  src: mediaUrl('/media/rhythm-doodles-reference-edit-1672.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Supplied Visit reference + Remove Background Local',
  provenance:
    'Полноэкранный прозрачный слой с точными облаками, птицами, солнцем, маршрутом, стаканчиком, карточными иконками и маленькими штрихами из предоставленного Visit-референса. Фон удалён локально, production использует alpha-preserving WebP; это декоративный reference-art.',
}

const visitSkylineReferenceEdit = rhythmSkylineReferenceEdit

export const visitSceneLayerManifest = {
  backdrop: defineSceneLayer('backdrop', visitCleanBaseReferenceEdit, {
    srcSet: mediaSrcSet('/media/rhythm-clean-base-mobile-960.webp 960w, /media/rhythm-clean-base-desktop.webp 1672w'),
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
    srcSet: mediaSrcSet('/media/rhythm-doodles-reference-edit-960.webp 960w, /media/rhythm-doodles-reference-edit-1672.webp 1672w'),
    sizes: '100vw',
  }),
  skyline: defineSceneLayer('decoration', visitSkylineReferenceEdit, {
    srcSet: mediaSrcSet('/media/rhythm-skyline-reference-edit-720w.webp 720w, /media/rhythm-skyline-reference-edit-1200w.webp 1200w'),
    sizes: '(max-width: 1023px) 92vw, 47vw',
  }),
} as const

const eventsCleanBaseReferenceEdit: DecorativeMediaProvenance = {
  id: 'events-clean-base-reference-edit',
  src: mediaUrl('/media/events-clean-base-1672w.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied Events reference',
  provenance:
    'Чистая полноэкранная бумажно-интерьерная сцена с правой фотопанелью и столом, восстановленная редактированием предоставленного Events-референса без baked-текста, карточек, доски и предметов переднего плана. Production использует только responsive WebP; это decorative reference-art, не документальная фотография White Cup.',
}

export const eventsTitleReferenceExtract: ResponsiveDecorativeMediaProvenance = {
  id: 'events-title-reference-extract',
  src: mediaUrl('/media/events-title-reference-extract-1520.webp'),
  srcSet: mediaSrcSet('/media/events-title-reference-extract-760.webp 760w, /media/events-title-reference-extract-1520.webp 1520w'),
  sizes: '47.25vw',
  sourceArtifactSrc: 'docs/reference/assets/events-title-reference-crop-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied Events reference crop + local alpha extraction',
  provenance:
    'Точный прозрачный рукописный заголовок Events-сцены с orange-акцентом и underline, извлечённый из предоставленного референса. Используется только как desktop reference-extract поверх живого h2; не является документальной фотографией или сгенерированной сценой.',
}

const defineEventsCardReferenceEdit = (
  id: string,
  filename: string,
  description: string,
): DecorativeMediaProvenance => ({
  id: `events-${id}-reference-edit`,
  src: mediaUrl(`/media/events-card-${filename}-800w.webp`),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied Events reference',
  provenance: `${description} Создано как отдельный decorative reference-edit и оптимизировано в WebP; локальный authoring PNG не публикуется. Ассет не является документальной фотографией White Cup.`,
})

const eventsCardReferenceEdits = {
  breakfasts: defineEventsCardReferenceEdit(
    'breakfasts',
    '01',
    'Кадр завтрака двух подруг за столом, восстановленный по первой карточке предоставленного Events-референса.',
  ),
  meetings: defineEventsCardReferenceEdit(
    'meetings',
    '02',
    'Кадр рабочей встречи за ноутбуком, восстановленный по второй карточке предоставленного Events-референса.',
  ),
  'warm-events': defineEventsCardReferenceEdit(
    'warm-events',
    '03',
    'Кадр камерной встречи в кафе, восстановленный по третьей карточке предоставленного Events-референса.',
  ),
} as const

export type EventsCardMediaId = keyof typeof eventsCardReferenceEdits

const eventsCakePlateCleanReferenceEdit: DecorativeMediaProvenance = {
  id: 'events-cake-plate-clean-reference-edit',
  src: mediaUrl('/media/events-cake-plate-clean-1200w.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + Remove Background Local',
  provenance:
    'Отдельный чисто обрезанный прозрачный слой торта вместе с полной тарелкой, восстановленный по нижнему правому foreground предоставленного Events-референса. Production использует alpha-preserving responsive WebP без загрязнённого края исходного cutout; это decorative reference-art, не документальная фотография блюда White Cup.',
}

const eventsCoffeeCleanReferenceEdit: DecorativeMediaProvenance = {
  id: 'events-coffee-clean-reference-edit',
  src: mediaUrl('/media/events-coffee-clean-800w.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + Remove Background Local',
  provenance:
    'Отдельный чисто обрезанный прозрачный слой чашки латте с блюдцем и ложкой, восстановленный по нижнему правому foreground предоставленного Events-референса. Production использует alpha-preserving responsive WebP без лишнего прозрачного поля; это decorative reference-art, не документальная фотография White Cup.',
}

const eventsDoodlesReferenceEdit: DecorativeMediaProvenance = {
  id: 'events-doodles-reference-edit',
  src: mediaUrl('/media/events-doodles-reference-edit-1672.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Supplied Events reference + Remove Background Local',
  provenance:
    'Точный прозрачный полноэкранный слой с контуром фотопанели, маршрутом, облаком, сердцами, чашкой, кексом и карточными значками из предоставленного Events-референса. Production использует alpha-preserving responsive WebP; это декоративный reference-art.',
}

const eventsChalkboardReferenceEdit: DecorativeMediaProvenance = {
  id: 'events-chalkboard-reference-edit',
  src: mediaUrl('/media/events-chalkboard-reference-edit-480w.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit + Remove Background Local',
  provenance:
    'Отдельная декоративная меловая доска для правой стены, восстановленная по предоставленному Events-референсу и оптимизированная в responsive WebP. Текст на ней является частью иллюстрации, а не операционной информацией заведения.',
}

export const eventsSceneLayerManifest = {
  backdrop: defineSceneLayer('backdrop', eventsCleanBaseReferenceEdit, {
    srcSet: mediaSrcSet('/media/events-clean-base-960w.webp 960w, /media/events-clean-base-1672w.webp 1672w'),
    sizes: '100vw',
  }),
  cards: Object.fromEntries(
    Object.entries(eventsCardReferenceEdits).map(([id, asset]) => [
      id,
      defineSceneLayer('foreground', asset, {
        srcSet: `${asset.src} 800w`,
        sizes: '(max-width: 1023px) 88vw, 16vw',
      }),
    ]),
  ) as Record<EventsCardMediaId, SceneLayerManifestEntry>,
  foregrounds: [
    defineSceneLayer('foreground', eventsCakePlateCleanReferenceEdit, {
      srcSet: mediaSrcSet('/media/events-cake-plate-clean-720w.webp 720w, /media/events-cake-plate-clean-1200w.webp 1200w'),
      sizes: '(max-width: 1023px) 80vw, 22.4vw',
    }),
    defineSceneLayer('foreground', eventsCoffeeCleanReferenceEdit, {
      srcSet: mediaSrcSet('/media/events-coffee-clean-480w.webp 480w, /media/events-coffee-clean-800w.webp 800w'),
      sizes: '(max-width: 1023px) 65vw, 23.1vw',
    }),
  ],
  decoration: defineSceneLayer('decoration', eventsDoodlesReferenceEdit, {
    srcSet: mediaSrcSet('/media/events-doodles-reference-edit-960.webp 960w, /media/events-doodles-reference-edit-1672.webp 1672w'),
    sizes: '100vw',
  }),
  chalkboard: defineSceneLayer('decoration', eventsChalkboardReferenceEdit, {
    srcSet: mediaSrcSet('/media/events-chalkboard-reference-edit-300w.webp 300w, /media/events-chalkboard-reference-edit-480w.webp 480w'),
    sizes: '(max-width: 1023px) 30vw, 10vw',
  }),
} as const

const locationsMapReferenceEdit: DecorativeMediaProvenance = {
  id: 'locations-map-reference-edit',
  src: mediaUrl('/media/locations-map-reference-1672w.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied Locations reference',
  provenance:
    'Отдельный чистый акварельный слой Самары без baked-подписей и интерфейса, восстановленный по предоставленному Locations-референсу и оптимизированный в responsive WebP. Это декоративная схема, не интерактивная или географически точная карта.',
}

export const locationsTitleReferenceExtract: ResponsiveDecorativeMediaProvenance = {
  id: 'locations-title-reference-extract',
  src: mediaUrl('/media/locations-title-reference-extract-1500.webp'),
  srcSet: mediaSrcSet('/media/locations-title-reference-extract-750.webp 750w, /media/locations-title-reference-extract-1500.webp 1500w'),
  sizes: '46.95vw',
  sourceArtifactSrc: 'docs/reference/assets/locations-title-reference-crop-authoring.png',
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied Locations reference crop + local alpha extraction',
  provenance:
    'Точный прозрачный рукописный заголовок Locations-сцены с orange-акцентом и underline, извлечённый из предоставленного референса. Используется только как desktop reference-extract поверх живого h2; не является картой, документальной фотографией или сгенерированной сценой.',
}

const locationsInteriorReferenceEdit: DecorativeMediaProvenance = {
  id: 'locations-interior-reference-edit',
  src: mediaUrl('/media/locations-interior-base-1672w.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Image Generation Skill edit of supplied Locations reference',
  provenance:
    'Отдельный интерьерный foreground, восстановленный по правой нижней фотопанели предоставленного Locations-референса и оптимизированный в responsive WebP. Ассет служит reference-art и не выдаётся за документальную фотографию White Cup.',
}

const locationsDoodlesReferenceEdit: DecorativeMediaProvenance = {
  id: 'locations-doodles-reference-edit',
  src: mediaUrl('/media/locations-doodles-reference-edit-1672.webp'),
  alt: '',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-edit',
  sourceLabel: 'Supplied Locations reference + Remove Background Local',
  provenance:
    'Прозрачный полноэкранный слой с пинами, птицами, облаками, чашками, маршрутом и самарским skyline из предоставленного Locations-референса. Production использует alpha-preserving responsive WebP; слой декоративный.',
}

type LocationCardIconName = 'pin' | 'clock' | 'phone' | 'arrow' | 'chat'

function defineLocationCardIcon(
  name: LocationCardIconName,
  description: string,
): DecorativeMediaProvenance {
  return {
    id: `locations-icon-${name}`,
    src: mediaUrl(`/media/locations-icon-${name}.webp`),
    alt: '',
    kind: 'decorative',
    provenanceKind: 'decorative-reference-edit',
    sourceLabel: 'Supplied Locations reference + Remove Background Local crop',
    provenance: `${description} точно извлечён из предоставленного Locations-референса, очищен от фона и сохранён как прозрачный WebP. Ассет декоративный.`,
  }
}

export const locationsCardIconMedia = {
  pin: defineLocationCardIcon('pin', 'Пин адреса'),
  clock: defineLocationCardIcon('clock', 'Знак часов работы'),
  phone: defineLocationCardIcon('phone', 'Знак телефона'),
  arrow: defineLocationCardIcon('arrow', 'Стрелка маршрута'),
  chat: defineLocationCardIcon('chat', 'Знак связи'),
} satisfies Record<LocationCardIconName, DecorativeMediaProvenance>

export const locationsSceneLayerManifest = {
  map: defineSceneLayer('backdrop', locationsMapReferenceEdit, {
    srcSet: mediaSrcSet('/media/locations-map-reference-960w.webp 960w, /media/locations-map-reference-1672w.webp 1672w'),
    /* The map is painted as a large right-side artboard on desktop. Asking
       for the full desktop source avoids a Chromium/WebP paint gap observed
       at effective 125% zoom (1536 CSS px), while mobile still selects 960w. */
    sizes: '(max-width: 1023px) 100vw, 100vw',
  }),
  interior: defineSceneLayer('foreground', locationsInteriorReferenceEdit, {
    srcSet: mediaSrcSet('/media/locations-interior-base-960w.webp 960w, /media/locations-interior-base-1672w.webp 1672w'),
    sizes: '(max-width: 1023px) 100vw, 100vw',
  }),
  decoration: defineSceneLayer('decoration', locationsDoodlesReferenceEdit, {
    srcSet: mediaSrcSet('/media/locations-doodles-reference-edit-960.webp 960w, /media/locations-doodles-reference-edit-1672.webp 1672w'),
    sizes: '100vw',
  }),
} as const

export const heroLogoBadge: DecorativeMediaProvenance = {
  id: 'hero-logo-badge',
  src: mediaUrl('/media/hero-logo-reference.png'),
  alt: 'White Cup',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied reference crop + local alpha extraction',
  provenance:
    'Точно извлечённый знак White Cup из предоставленного первого экранного референса с прозрачным paper-background; используется как декоративный header-asset, не является документальной фотографией.',
}

export const menuLogoReferenceCrop: DecorativeMediaProvenance = {
  id: 'menu-logo-reference-crop',
  src: mediaUrl('/media/menu-logo-reference-crop.png'),
  alt: 'White Cup',
  kind: 'decorative',
  provenanceKind: 'decorative-reference-extract',
  sourceLabel: 'Supplied menu reference crop',
  provenance:
    'Точный компактный вертикальный знак White Cup из предоставленного menu-референса; paper-поле сохранено, чтобы исходная графика и подпись не перерисовывались.',
}

export const decorativeMedia: DecorativeMediaProvenance[] = [
  heroCleanBaseEdit,
  heroTitleReferenceExtract,
  heroBagelReferenceEdit,
  heroCoffeeReferenceEdit,
  heroRouteCupReferenceEdit,
  storyRouteConnectorGenerated,
  heroLogoBadge,
  menuLogoReferenceCrop,
  menuCleanBaseReferenceEdit,
  menuTitleReferenceExtract,
  ...Object.values(menuCardReferenceEdits),
  aboutCleanBaseReferenceEdit,
  aboutTitleReferenceUpperExtract,
  aboutTitleReferenceLowerExtract,
  aboutPastryReferenceEdit,
  aboutCoffeeReferenceEdit,
  aboutDoodlesReferenceEdit,
  ...Object.values(aboutBenefitReferenceEdits),
  visitCleanBaseReferenceEdit,
  visitTitleReferenceExtract,
  ...Object.values(visitCardReferenceEdits),
  visitDoodlesReferenceEdit,
  visitSkylineReferenceEdit,
  eventsCleanBaseReferenceEdit,
  eventsTitleReferenceExtract,
  ...Object.values(eventsCardReferenceEdits),
  eventsCakePlateCleanReferenceEdit,
  eventsCoffeeCleanReferenceEdit,
  eventsDoodlesReferenceEdit,
  eventsChalkboardReferenceEdit,
  locationsMapReferenceEdit,
  locationsTitleReferenceExtract,
  locationsInteriorReferenceEdit,
  locationsDoodlesReferenceEdit,
  ...Object.values(locationsCardIconMedia),
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
