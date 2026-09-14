import { siteData } from '../data/site'

import { BrandMark } from './BrandMark'

/**
 * A small, explicit hand-off at the end of the long-form story. It keeps the
 * useful actions available after a visitor has read the page and labels the
 * public source links so they are discoverable without relying on icon-only
 * affordances.
 */
export function Footer() {
  return (
    <footer id="contact" className="site-footer" aria-labelledby="site-footer-title">
      <div className="site-footer__inner">
        <div className="site-footer__lead">
          <p className="scene-kicker">White Cup / До встречи</p>
          <h2 id="site-footer-title" data-motion="rise" data-motion-step={0}>
            Зайдём на кофе?
          </h2>
          <p className="site-footer__lede" data-motion="soft" data-motion-step={1}>
            Выберите адрес, откройте актуальное меню — и оставьте немного времени на свой вайб.
          </p>
          <div
            className="site-footer__actions"
            role="group"
            aria-label="Действия в конце страницы"
            data-motion="rise"
            data-motion-step={2}
          >
            <a className="button-link button-link--primary" href={siteData.menuUrl} target="_blank" rel="noreferrer">
              Открыть меню <span aria-hidden="true">↗</span>
            </a>
            <a className="button-link button-link--quiet" href="#locations">
              Как нас найти <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="site-footer__contact">
          <a
            className="site-footer__brand"
            href="#hero"
            aria-label="White Cup — на главную"
            data-motion="art"
            data-motion-step={3}
          >
            <BrandMark />
          </a>
          <a
            className="site-footer__phone"
            href={siteData.phoneHref}
            data-motion="rise"
            data-motion-step={4}
          >
            {siteData.phone}
          </a>
          <nav className="site-footer__links" aria-label="Ссылки White Cup">
            <a
              href={siteData.vkUrl}
              target="_blank"
              rel="noreferrer"
              data-motion="soft"
              data-motion-step={5}
            >
              Группа White Cup во VK <span aria-hidden="true">↗</span>
            </a>
            <a
              href={siteData.yandexCardUrl}
              target="_blank"
              rel="noreferrer"
              data-motion="soft"
              data-motion-step={5}
            >
              White Cup в Яндекс Картах <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </div>

      <div className="site-footer__meta">
        <p>Фото: публичная галерея Яндекс Карт. Меню, наличие и график лучше уточнить перед визитом.</p>
        <p>White Cup · Самара</p>
      </div>
    </footer>
  )
}
