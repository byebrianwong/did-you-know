import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { facts } from './facts'
import { browserStore } from './progress'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App facts={facts} store={browserStore} />
  </StrictMode>,
)
