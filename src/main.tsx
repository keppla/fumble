import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import { App } from './components/App.tsx'

import './style/reset.scss'
import './style/main.scss'
import './style/images.scss'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)