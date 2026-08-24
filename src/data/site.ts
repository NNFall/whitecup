export interface MenuItem {
  id: string
  name: string
  description: string
  price?: string
  imageId?: string
}

export interface Location {
  id: string
  name: string
  address: string
  context: string
  hours: string
  hoursNote?: string
  mapAddress?: string
  entranceNote?: string
  routeUrl: string
}

export interface Benefit {
  id: string
  title: string
  description: string
}

export interface VisitScenario {
  id: string
  title: string
  description: string
}

export interface EventCard {
  id: string
  title: string
  description: string
}

export interface SiteData {
  brandName: string
  tagline: string
  phone: string
  phoneHref: string
  yandexOrgId: string
  yandexCardUrl: string
  menuUrl: string
  galleryUrl: string
  vkUrl: string
  secondaryHoursNote: string
  locations: Location[]
  menuItems: MenuItem[]
  benefits: Benefit[]
  visitScenarios: VisitScenario[]
  events: EventCard[]
}

const yandexCardUrl = 'https://yandex.ru/maps/org/white_cup/19381755919/'
const secondaryHoursNote = 'Уточняйте актуальный график перед визитом'

export const siteData: SiteData = {
  brandName: 'White Cup',
  tagline: 'Завтраки, кофе и свой вайб в White Cup',
  phone: '+7 (937) 235-57-15',
  phoneHref: 'tel:+79372355715',
  yandexOrgId: '19381755919',
  yandexCardUrl,
  menuUrl: `${yandexCardUrl}menu/`,
  galleryUrl: `${yandexCardUrl}gallery/`,
  vkUrl: 'https://vk.ru/white_cup',
  secondaryHoursNote,
  locations: [
    {
      id: 'modern-museum',
      name: 'Красноармейская, 15',
      address: 'Красноармейская, 15',
      context: 'во дворе Музея Модерна',
      hours: '08:00–23:00',
      mapAddress: 'Красноармейская, 17',
      entranceNote:
        'Вход через двор Музея Модерна. В карточке Яндекс может отображаться дом 17.',
      routeUrl: yandexCardUrl,
    },
    {
      id: 'tsekh',
      name: 'Куйбышева, 128/1',
      address: 'Куйбышева, 128/1',
      context: 'Станкозавод, пространство «Цех»',
      hours: '10:00–21:00',
      hoursNote: secondaryHoursNote,
      routeUrl: 'https://yandex.ru/maps/?text=Самара%2C%20Куйбышева%2C%20128%2F1',
    },
  ],
  menuItems: [
    {
      id: 'cappuccino',
      name: 'Капучино',
      description: 'Нежная молочная пенка и насыщенный эспрессо — идеальное начало дня.',
      price: '270–320 ₽',
    },
    {
      id: 'bagel',
      name: 'Бейгл с лососем',
      description: 'Сытный бейгл с лососем, крем-чизом и свежей зеленью.',
    },
    {
      id: 'waffle',
      name: 'Вафля с ягодами',
      description: 'Хрустящая вафля с сезонными ягодами и ванильным кремом.',
    },
    {
      id: 'syrniki',
      name: 'Сырники',
      description: 'Нежные сырники со сметаной и ягодным соусом.',
    },
    {
      id: 'cheesecake',
      name: 'Малиновый чизкейк',
      description: 'Нежный чизкейк с малиной и фисташкой.',
    },
  ],
  benefits: [
    {
      id: 'specialty-coffee',
      title: 'Спешелти-кофе',
      description: 'Только отборные зёрна и бережная обжарка',
    },
    {
      id: 'all-day-breakfast',
      title: 'Завтраки весь день',
      description: 'Любимые блюда в любое время',
    },
    {
      id: 'cozy-atmosphere',
      title: 'Уютная атмосфера',
      description: 'Тёплый интерьер и дружелюбная команда',
    },
    {
      id: 'samara-centre',
      title: 'Центр Самары',
      description: 'В самом сердце города, рядом с культурной жизнью',
    },
  ],
  visitScenarios: [
    {
      id: 'coffee-to-go',
      title: 'Кофе по пути',
      description: 'Зайти за чашкой перед прогулкой по центру.',
    },
    {
      id: 'meeting-in-centre',
      title: 'Встреча в центре',
      description: 'Собраться за завтраком, кофе или длинным разговором.',
    },
    {
      id: 'quiet-pause',
      title: 'Тихая пауза',
      description: 'Остаться наедине с книгой, ноутбуком или собственными мыслями.',
    },
  ],
  events: [
    {
      id: 'breakfasts',
      title: 'Завтраки без спешки',
      description: 'Утренний стол, кофе и время для себя.',
    },
    {
      id: 'meetings',
      title: 'Встречи и разговоры',
      description: 'Место для людей, идей и случайных встреч.',
    },
    {
      id: 'warm-events',
      title: 'Тёплые события',
      description: 'Следите за свежими анонсами в публичной ленте.',
    },
  ],
}

export { secondaryHoursNote, yandexCardUrl }
