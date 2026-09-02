// Imports strict mode.
import { StrictMode } from 'react'

// Imports the React root function.
import { createRoot } from 'react-dom/client'

// Imports the global styles.
import './index.css'

// Imports the application.
import App from './App.tsx'

// Finds the root element.
const rootElement = document.getElementById('root')!

// Creates the React root.
const root = createRoot(rootElement)

// Renders the application.
root.render(
    // Checks the application during development.
    <StrictMode>
        {/* Renders the application. */}
        <App />
    {/* Ends strict mode. */}
    </StrictMode>,
)
