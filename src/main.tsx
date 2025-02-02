import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TcgMarketApp from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TcgMarketApp />
    </BrowserRouter>
  </StrictMode>,
)
