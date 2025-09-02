import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

export interface Settings {
  sensitivity: number
  minHitInterval: number
  theme: 'light' | 'dark'
  soundEnabled: boolean
  language: string
  sessionTimeout: number // in seconds, 0 = no timeout
}

export interface Score {
  id: string
  score: number
  date: string
  duration: number
  type: 'free' | 'timed' | 'target'
  longestRally: number
}

export interface Stats {
  totalHits: number
  longestRally: number
  totalSessions: number
  averageRallyLength: number
  totalPlayTime: number
}

export function useSettings() {
  const defaultSettings: Settings = {
    sensitivity: 25, // More sensitive default (was 50)
    minHitInterval: 200,
    theme: 'light',
    soundEnabled: true,
    language: 'en',
    sessionTimeout: 3.0 // 3 seconds default
  }
  
  return useLocalStorage('rallycounter-settings', defaultSettings)
}

export function useHighscores() {
  return useLocalStorage<Score[]>('rallycounter-scores', [])
}

export function useStats() {
  const defaultStats: Stats = {
    totalHits: 0,
    longestRally: 0,
    totalSessions: 0,
    averageRallyLength: 0,
    totalPlayTime: 0
  }
  
  return useLocalStorage('rallycounter-stats', defaultStats)
}