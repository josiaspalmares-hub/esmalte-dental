import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './panel/App'

createRoot(document.getElementById('raiz')!).render(<StrictMode><App /></StrictMode>)
