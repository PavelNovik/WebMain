import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import { langFromPath } from './i18n/index.jsx'
import './styles/variables.css'
import './styles/global.css'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App initialLang={langFromPath(location.pathname)} />
  </StrictMode>
)

// В продакшене HTML уже отрендерен заранее (scripts/prerender.js) — «оживляем» его
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
