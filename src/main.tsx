import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import ErrorBoundary from './components/common/ErrorBoundary.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>    
      <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>    
  </StrictMode>,
)