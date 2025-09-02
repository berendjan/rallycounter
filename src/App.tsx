import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Highscores from './pages/Highscores'
import Help from './pages/Help'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/scores" element={<Highscores />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
