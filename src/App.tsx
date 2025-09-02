import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Highscores from './pages/Highscores'
import Help from './pages/Help'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/scores" element={<Highscores />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
