export interface MenuItem {
  id: string
  name: string
  description: string
}

export interface Location {
  id: string
  name: string
  address: string
  context: string
  entranceNote?: string
  routeUrl: string
}

export const yandexCardUrl = 'https://yandex.ru/maps/org/white_cup/19381755919/'

// Public contact cards checked on 2026-09-14. See docs/redesign-2026-09-14.md.
export const siteData = {
  brandName: 'White Cup',
  tagline: 'Завтраки, кофе и свой вайб в White Cup',
  phone: '+7 (937) 235-57-15',
  phoneHref: 'tel:+79372355715',
  yandexOrgId: '19381755919',
  yandexCardUrl,
  menuUrl: `${yandexCardUrl}menu/`,
  galleryUrl: `${yandexCardUrl}gallery/`,
  vkUrl: 'https://vk.ru/white_cup',
  locations: [
    {
      id: 'modern-museum',
      name: 'Красноармейская, 17',
      address: 'Красноармейская, 17',
      context: 'во дворе Музея Модерна',
      routeUrl: yandexCardUrl,
    },
    {
      id: 'tsekh',
      name: 'Куйбышева, 128А',
      address: 'Куйбышева, 128А',
      context: 'Станкозавод, пространство «Цех»',
      routeUrl: 'https://yandex.ru/maps/org/white_cup/193710716150/',
    },
  ] as Location[],
  menuItems: [
    { id: 'cappuccino', name: 'Капучино', description: 'Эспрессо и нежная молочная пенка.' },
    { id: 'bagel', name: 'Бейгл с лососем', description: 'Лосось, крем-чиз и свежая зелень.' },
    { id: 'waffle', name: 'Вафля с ягодами', description: 'Хрустящая вафля, ягоды и ванильный крем.' },
    { id: 'syrniki', name: 'Сырники', description: 'Со сметаной и ягодным соусом.' },
    { id: 'cheesecake', name: 'Малиновый чизкейк', description: 'Нежный чизкейк с малиной и фисташкой.' },
    { id: 'oatmeal', name: 'Овсянка с ягодами', description: 'Тёплая овсянка, ягоды, орехи и мёд.' },
    { id: 'shakshuka', name: 'Шакшука', description: 'Яйца с томатами, зеленью и тёплым хлебом.' },
    { id: 'croissant', name: 'Круассан с джемом', description: 'Слоёный круассан с джемом и ягодами.' },
  ] as MenuItem[],
}
