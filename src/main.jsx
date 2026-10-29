import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.jsx'
import AppMenu from './AppMenu.jsx'
import App2 from './AppEJ1.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppMenu />
  </StrictMode>,
)
