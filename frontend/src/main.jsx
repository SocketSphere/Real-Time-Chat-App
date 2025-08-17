// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import Navbar from "@/components/Navbar.jsx"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <Navbar className="flex-shrink-0" /> {/* Fixed navbar */}
        <div className="flex-1 overflow-auto"> {/* Scrollable content */}
          <App />
        </div>
      </div>
    </BrowserRouter>
  </React.StrictMode>
)