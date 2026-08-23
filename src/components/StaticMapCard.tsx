export interface StaticMapCardProps {
  routeUrl: string
  address: string
  className?: string
}

/** Lightweight map illustration. The real route is opened only on demand. */
export function StaticMapCard({ routeUrl, address, className }: StaticMapCardProps) {
  return (
    <aside className={['static-map-card', className].filter(Boolean).join(' ')} aria-label={`Схема маршрута до ${address}`}>
      <div className="static-map-card__art" aria-hidden="true">
        <svg viewBox="0 0 760 440" focusable="false">
          <path className="static-map-card__water" d="M0 80c94-44 172-41 250-20 114 30 201 6 285-25 99-36 170-18 225 28v377H0Z" />
          <path className="static-map-card__street" d="M-20 327c92-70 150-101 254-119 90-15 167-6 265-74 61-42 140-67 283-77M64 464c49-130 82-203 159-277 62-59 131-84 248-107M357-16c-14 111-5 178 57 246 49 52 82 104 91 229" />
          <path className="static-map-card__street static-map-card__street--fine" d="M-10 176c108 28 179 51 258 48 96-3 141-54 224-115 57-42 124-61 240-47M139 461c66-69 126-123 200-154 88-37 128-37 202-26" />
          <path className="static-map-card__route" d="M194 319c34-90 92-130 164-146 59-13 100-45 119-98" />
          <circle className="static-map-card__pin-ring" cx="477" cy="75" r="15" />
          <circle className="static-map-card__pin" cx="477" cy="75" r="6" />
        </svg>
      </div>
      <div className="static-map-card__footer">
        <p><span>White Cup</span><strong>{address}</strong></p>
        <a className="text-link text-link--arrow" href={routeUrl} target="_blank" rel="noreferrer">
          Открыть маршрут в Яндекс Картах <span aria-hidden="true">↗</span>
        </a>
      </div>
    </aside>
  )
}
