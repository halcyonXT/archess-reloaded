import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeContextProvider } from "./context/ThemeContext.jsx"
import { GameContextProvider } from './context/GameContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'
import { SubscriptionContextProvider } from './context/SubscriptionContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <SubscriptionContextProvider>
      <UserContextProvider>
        <GameContextProvider>
          <ThemeContextProvider>
            <App />
          </ThemeContextProvider>
        </GameContextProvider>
      </UserContextProvider>
    </SubscriptionContextProvider>
  </SocketProvider>,
)
