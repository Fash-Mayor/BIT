import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BITDashboard from './BITDashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BITDashboard />
  </StrictMode>,
)
