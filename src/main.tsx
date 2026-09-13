import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/tokens.css'
import './styles/global.css'
import './styles/footer.css'
import './styles/hero.css'
import './styles/menu.css'
import './styles/story.css'
import './styles/navigation.css'
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
