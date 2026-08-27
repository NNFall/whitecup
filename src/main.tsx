import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import './styles/tokens.css'
import './styles/global.css'
import './styles/footer.css'
import './styles/live-typography.css'
import './styles/menu-carousel-polish.css'
import './styles/scene-continuity-polish.css'
import './styles/mobile-hero-polish.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('White Cup root element was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
