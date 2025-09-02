import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAudioDetection } from '../hooks/useAudioDetection'
import { useSettings, useHighscores, useStats, type Score } from '../hooks/useLocalStorage'

export default function Home() {
  const { t } = useTranslation()
  const [settings] = useSettings()
  const [highscores, setHighscores] = useHighscores()
  const [stats, setStats] = useStats()
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [recentSessions, setRecentSessions] = useState<Score[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastHitTimeRef = useRef<number>(0)
  const currentSessionHits = useRef<number>(0)
  
  const audioDetection = useAudioDetection({
    sensitivity: settings.sensitivity,
    minHitInterval: settings.minHitInterval,
    frequencyMin: 2000, // 2kHz
    frequencyMax: 8000, // 8kHz
  })

  const handleStart = async () => {
    console.log('Starting session...')
    const success = await audioDetection.startDetection()
    console.log('Audio detection started:', success)
    
    if (success) {
      const startTime = Date.now()
      console.log('Setting session start time:', startTime)
      setSessionStartTime(startTime)
      lastHitTimeRef.current = startTime
      currentSessionHits.current = 0  // Reset session hit counter
      
      // Set up timeout if configured
      if (settings.sessionTimeout > 0) {
        console.log('Starting inactivity timer with timeout:', settings.sessionTimeout)
        startInactivityTimer()
      } else {
        console.log('No timeout configured')
      }
    } else {
      alert('Could not access microphone. Please check permissions.')
    }
  }
  
  const startInactivityTimer = () => {
    // Clear any existing timer
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current)
    }
    
    setTimeRemaining(settings.sessionTimeout)
    
    // Update countdown every 100ms for precision
    const countdownInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastHit = (now - lastHitTimeRef.current) / 1000
      const remaining = settings.sessionTimeout - timeSinceLastHit
      
      if (remaining <= 0) {
        clearInterval(countdownInterval)
        handleTimeoutStop()
        setTimeRemaining(null)
      } else {
        setTimeRemaining(remaining)
      }
    }, 100)
    
    // Store interval reference for cleanup
    timeoutRef.current = countdownInterval
  }

  const handleStop = () => {
    const finalScore = currentSessionHits.current
    console.log('Handle stop called', { 
      sessionStartTime, 
      audioHitCount: audioDetection.hitCount,
      sessionHitCount: finalScore,
      isActive: audioDetection.isActive 
    })
    
    clearTimeouts()
    audioDetection.stopDetection()
    if (sessionStartTime) {
      const duration = (Date.now() - sessionStartTime) / 1000
      console.log('Calling saveScore with:', { score: finalScore, duration })
      saveScore(finalScore, duration)
    } else {
      console.log('Not saving score because sessionStartTime is null')
    }
    
    // Reset session time and hit counter after saving
    setSessionStartTime(null)
    currentSessionHits.current = 0
  }
  
  const handleTimeoutStop = () => {
    const finalScore = currentSessionHits.current
    console.log('Timeout stop called', { 
      sessionStartTime, 
      audioHitCount: audioDetection.hitCount,
      sessionHitCount: finalScore,
      sessionTimeout: settings.sessionTimeout,
      isActive: audioDetection.isActive
    })
    
    audioDetection.stopDetection()
    
    // Save score using the tracked session hits
    const duration = settings.sessionTimeout
    console.log('Calling saveScore from timeout with:', { score: finalScore, duration })
    saveScore(finalScore, duration)
    
    // Clear session time and hit counter
    setSessionStartTime(null)
    currentSessionHits.current = 0
  }
  
  const clearTimeouts = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current)
      timeoutRef.current = null
    }
    setTimeRemaining(null)
  }

  const handleReset = () => {
    clearTimeouts()
    audioDetection.resetCounter()
    setSessionStartTime(null)
    currentSessionHits.current = 0
  }

  const saveScore = (score: number, duration: number) => {
    console.log('Saving score:', { score, duration })
    
    const newScore = {
      id: crypto.randomUUID(),
      score,
      date: new Date().toISOString(),
      duration,
      type: 'free' as const,
      longestRally: score
    }
    
    console.log('New score object:', newScore)
    
    // Add to recent sessions (keep last 5)
    setRecentSessions(prev => {
      const updated = [newScore, ...prev].slice(0, 5)
      console.log('Updated recent sessions:', updated)
      return updated
    })
    
    // Add to high scores
    setHighscores(prev => {
      const updated = [...prev, newScore].sort((a, b) => b.score - a.score).slice(0, 10)
      console.log('Updated high scores:', updated)
      return updated
    })
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalHits: prev.totalHits + score,
      longestRally: Math.max(prev.longestRally, score),
      totalSessions: prev.totalSessions + 1,
      averageRallyLength: (prev.totalHits + score) / (prev.totalSessions + 1),
      totalPlayTime: prev.totalPlayTime + duration
    }))
    
    // Don't reset sessionStartTime here - let the calling function handle it
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }
  
  // Watch for hit count changes to reset timer and track session hits
  useEffect(() => {
    if (audioDetection.isActive && audioDetection.hitCount > 0 && settings.sessionTimeout > 0) {
      lastHitTimeRef.current = Date.now()
      currentSessionHits.current = audioDetection.hitCount  // Track the current session hits
      console.log('Hit detected, updated session hits:', currentSessionHits.current)
      // Don't restart timer immediately, let the current one continue from the new lastHitTime
    }
  }, [audioDetection.hitCount, audioDetection.isActive, settings.sessionTimeout])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <h1 className="text-4xl font-bold mb-8">{t('home.title')}</h1>
      
      <div className="text-8xl font-mono mb-8 text-blue-600">
        {audioDetection.hitCount}
      </div>
      
      {/* Audio level indicator */}
      <div className="w-64 mb-8">
        <div className="text-sm text-gray-600 mb-2">Audio Level</div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-green-500 h-4 rounded-full transition-all duration-100"
            style={{ width: `${audioDetection.audioLevel * 100}%` }}
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full max-w-md">
        <button 
          onClick={handleStart}
          disabled={audioDetection.isActive}
          className="flex-1 px-8 py-4 bg-green-500 text-white rounded-lg text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed touch-manipulation"
        >
          {t('home.start')}
        </button>
        <button 
          onClick={handleStop}
          disabled={!audioDetection.isActive}
          className="flex-1 px-8 py-4 bg-red-500 text-white rounded-lg text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed touch-manipulation"
        >
          {t('home.stop')}
        </button>
        <button 
          onClick={handleReset}
          className="flex-1 px-8 py-4 bg-gray-500 text-white rounded-lg text-lg font-semibold touch-manipulation"
        >
          {t('home.reset')}
        </button>
      </div>
      
      <div className="text-center text-gray-600 mb-6">
        <div className="text-sm">
          {audioDetection.isListening ? 
            (audioDetection.isActive ? 'Listening for paddle hits...' : 'Microphone ready') :
            'Microphone not connected'
          }
        </div>
        {sessionStartTime && (
          <div className="text-xs mt-1">
            Session: {Math.floor((Date.now() - sessionStartTime) / 1000)}s
          </div>
        )}
        {timeRemaining !== null && (
          <div className="text-lg font-semibold text-orange-600 mt-2">
            Inactivity Timeout: {formatTime(Math.ceil(timeRemaining))}
          </div>
        )}
      </div>
      
      {/* Debug Info */}
      <div className="text-xs text-gray-400 mb-2 text-center">
        Recent sessions: {recentSessions.length} | Highscores: {highscores.length}
      </div>

      {/* Current Session Scores */}
      {recentSessions.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <h3 className="text-lg font-semibold mb-3 text-center">This Session</h3>
          <div className="space-y-2">
            {recentSessions.map((session, index) => (
              <div 
                key={session.id}
                className={`p-3 rounded-lg border-2 ${
                  index === 0 ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{session.score} hits</div>
                    <div className="text-xs text-gray-500">
                      {new Date(session.date).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatDuration(session.duration)}</div>
                    {index === 0 && (
                      <div className="text-xs text-blue-600 font-semibold">Latest</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}