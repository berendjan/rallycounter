import { useEffect, useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAudioDetection } from '../hooks/useAudioDetection'
import { useSettings, useHighscores, useStats, type Score } from '../hooks/useLocalStorage'

export default function Home() {
  const { t } = useTranslation()
  const [settings] = useSettings()
  const [, setHighscores] = useHighscores()
  const [, setStats] = useStats()
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [recentSessions, setRecentSessions] = useState<Score[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [autoRestartCountdown, setAutoRestartCountdown] = useState<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const lastHitTimeRef = useRef<number>(0)
  const currentSessionHits = useRef<number>(0)
  
  const audioDetection = useAudioDetection({
    sensitivity: settings.sensitivity,
    minHitInterval: settings.minHitInterval,
    frequencyMin: 2000, // 2kHz
    frequencyMax: 8000, // 8kHz
  })

  const handleStart = async () => {
    const success = await audioDetection.startDetection()
    
    if (success) {
      const startTime = Date.now()
      setSessionStartTime(startTime)
      lastHitTimeRef.current = startTime
      currentSessionHits.current = 0  // Reset session hit counter
      
      // Don't start timeout timer yet - wait for first hit
      setTimeRemaining(null)
    } else {
      alert('Could not access microphone. Please check permissions.')
    }
  }
  
  const handleAutoRestart = async () => {
    const success = await audioDetection.startDetection()
    
    if (success) {
      const startTime = Date.now()
      setSessionStartTime(startTime)
      lastHitTimeRef.current = startTime
      currentSessionHits.current = 0  // Reset session hit counter
      
      // Wait for first hit before starting timer (same as manual start)
      setTimeRemaining(null)
    } else {
      alert('Could not access microphone. Please check permissions.')
    }
  }
  
  const startInactivityTimer = useCallback(() => {
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
  }, [settings.sessionTimeout])

  const handleStop = () => {
    const finalScore = currentSessionHits.current
    
    clearTimeouts()
    audioDetection.stopDetection()
    if (sessionStartTime) {
      const duration = (Date.now() - sessionStartTime) / 1000
      saveScore(finalScore, duration)
    }
    
    // Reset session time and hit counter after saving
    setSessionStartTime(null)
    currentSessionHits.current = 0
    setAutoRestartCountdown(null)
  }
  
  const handleTimeoutStop = () => {
    const finalScore = currentSessionHits.current
    
    // Stop detection immediately to reset counter display
    audioDetection.stopDetection()
    
    // Save score using the tracked session hits
    const duration = settings.sessionTimeout
    saveScore(finalScore, duration)
    
    // Clear session time and hit counter
    setSessionStartTime(null)
    currentSessionHits.current = 0
    
    // Show auto-restart countdown
    setAutoRestartCountdown(2)
    
    // Countdown animation
    const countdownInterval = setInterval(() => {
      setAutoRestartCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval)
          return null
        }
        return prev - 1
      })
    }, 1000)
    
    // Auto-restart after countdown
    setTimeout(() => {
      setAutoRestartCountdown(null)
      // Only auto-restart if the user hasn't manually stopped
      if (!audioDetection.isActive) {
        handleAutoRestart()
      }
    }, 2000)
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
    setAutoRestartCountdown(null)
  }

  const saveScore = useCallback((score: number, duration: number) => {
    const newScore = {
      id: crypto.randomUUID(),
      score,
      date: new Date().toISOString(),
      duration,
      type: 'free' as const,
      longestRally: score
    }
    
    // Add to recent sessions (keep last 5)
    setRecentSessions(prev => [newScore, ...prev].slice(0, 5))
    
    // Add to high scores
    setHighscores(prev => [...prev, newScore].sort((a, b) => b.score - a.score).slice(0, 10))
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalHits: prev.totalHits + score,
      longestRally: Math.max(prev.longestRally, score),
      totalSessions: prev.totalSessions + 1,
      averageRallyLength: (prev.totalHits + score) / (prev.totalSessions + 1),
      totalPlayTime: prev.totalPlayTime + duration
    }))
  }, [setRecentSessions, setHighscores, setStats])
  
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
  
  // Watch for hit count changes to start/reset timer and track session hits
  useEffect(() => {
    if (audioDetection.isActive && audioDetection.hitCount > 0 && settings.sessionTimeout > 0) {
      lastHitTimeRef.current = Date.now()
      currentSessionHits.current = audioDetection.hitCount  // Track the current session hits
      
      // Start timer on first hit, or reset it continues from the new lastHitTime
      if (audioDetection.hitCount === 1) {
        // First hit - start the inactivity timer
        startInactivityTimer()
      }
      // For subsequent hits, the timer continues running and uses the updated lastHitTimeRef
    }
  }, [audioDetection.hitCount, audioDetection.isActive, settings.sessionTimeout, startInactivityTimer])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">{t('home.title')}</h1>
      
      <div className="text-8xl font-mono mb-8 text-blue-600 dark:text-blue-400">
        {audioDetection.hitCount}
      </div>
      
      {/* Audio level indicator */}
      <div className="w-64 mb-8">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('home.audioLevel')}</div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
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
      
      <div className="text-center text-gray-600 dark:text-gray-400 mb-6">
        <div className="text-sm">
          {audioDetection.isListening ? 
            (audioDetection.isActive ? t('home.listeningActive') : t('home.microphoneReady')) :
            t('home.microphoneNotConnected')
          }
        </div>
        {sessionStartTime && (
          <div className="text-xs mt-1">
            {t('home.session')}: {Math.floor((Date.now() - sessionStartTime) / 1000)}s
          </div>
        )}
        {audioDetection.isActive && settings.sessionTimeout > 0 && (
          <div className="text-lg font-semibold mt-2">
            {timeRemaining !== null ? (
              <span className="text-orange-600 dark:text-orange-400">
                Inactivity Timeout: {formatTime(Math.ceil(timeRemaining))}
              </span>
            ) : (
              <span className="text-blue-600 dark:text-blue-400">
                {t('home.waitingForFirstHit')}
              </span>
            )}
          </div>
        )}
        {autoRestartCountdown !== null && (
          <div className="text-lg font-semibold mt-2">
            <span className="text-green-600 dark:text-green-400">
              Auto-restarting in {autoRestartCountdown}s...
            </span>
          </div>
        )}
      </div>
      
      {/* Current Session Scores */}
      {recentSessions.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <h3 className="text-lg font-semibold mb-3 text-center text-gray-900 dark:text-gray-100">{t('home.thisSession')}</h3>
          <div className="space-y-2">
            {recentSessions.map((session, index) => (
              <div 
                key={session.id}
                className={`p-3 rounded-lg border-2 ${
                  index === 0 ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-gray-900 dark:text-gray-100">{session.score} hits</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(session.date).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatDuration(session.duration)}</div>
                    {index === 0 && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{t('home.latest')}</div>
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