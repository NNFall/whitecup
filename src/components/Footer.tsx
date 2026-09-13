import { siteData } from '../data/site'

import { BrandMark } from './BrandMark'

export function Footer() {
  return (
    <footer id="contact" className="site-footer" aria-labelledby="site-footer-title">
      <div className="site-footer__inner">
        <div className="site-footer__lead">
          <p className="site-footer__kicker">White Cup / До встречи</p>
          <h2 id="site-footer-title">Зайдём на кофе?</h2>
          <p className="site-footer__lede">
            Выберите адрес, откройте актуальное меню — и увидимся в White Cup.
          </p>
          <a
            className="button-link button-link--primary site-footer__menu-link"
            href={siteData.menuUrl}
            target="_blank"
            rel="noreferrer"
          >
            Открыть меню <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="site-footer__contact">
          <a className="site-footer__brand" href="#hero" aria-label="White Cup — на главную">
            <BrandMark />
          </a>
          <a className="site-footer__phone" href={siteData.phoneHref}>
            {siteData.phone}
          </a>
          <nav className="site-footer__links" aria-label="Ссылки White Cup">
            <a href={siteData.vkUrl} target="_blank" rel="noreferrer">
              White Cup во VK <span aria-hidden="true">↗</span>
            </a>
            <a href={siteData.yandexCardUrl} target="_blank" rel="noreferrer">
              Яндекс Карты <span aria-hidden="true">↗</span>
            </a>
            <a href="#locations">Адреса кофеен <span aria-hidden="true">↓</span></a>
          </nav>
        </div>
      </div>

      <div className="site-footer__meta">
        <p>Фото кофейни — из публичной галереи Яндекс Карт.</p>
        <p>White Cup · Самара</p>
      </div>
    </footer>
  )
}
