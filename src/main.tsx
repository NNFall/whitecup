import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/tokens.css'
import './styles/global.css'
import './styles/footer.css'
import './styles/scene-continuity-polish.css'
import './styles/mobile-hero-polish.css'
import './styles/menu-carousel-polish.css'
import './styles/navigation-polish.css'
import './styles/scene-bridge-polish.css'
import './styles/scene-layout-polish.css'
import './styles/scene-frame-polish.css'
import './styles/live-typography.css'
import App from './App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('White Cup root element was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
