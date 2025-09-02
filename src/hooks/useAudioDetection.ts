import { useState, useRef, useCallback, useEffect } from 'react'

interface AudioDetectionConfig {
  sensitivity: number
  minHitInterval: number
  frequencyMin: number
  frequencyMax: number
}

interface AudioDetectionState {
  isActive: boolean
  isListening: boolean
  audioLevel: number
  hitCount: number
  lastHitTime: number
}

export function useAudioDetection(config: AudioDetectionConfig) {
  const [state, setState] = useState<AudioDetectionState>({
    isActive: false,
    isListening: false,
    audioLevel: 0,
    hitCount: 0,
    lastHitTime: 0
  })
  
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  // Enhanced detection state
  const previousLevelsRef = useRef<number[]>([])
  const backgroundNoiseRef = useRef<number>(0)
  const noiseCalibrationCountRef = useRef<number>(0)
  
  const initializeAudio = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      })
      
      streamRef.current = stream
      
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext
      
      // Create analyser node
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.1
      analyserRef.current = analyser
      
      // Connect microphone to analyser
      const microphone = audioContext.createMediaStreamSource(stream)
      microphoneRef.current = microphone
      microphone.connect(analyser)
      
      setState(prev => ({ ...prev, isListening: true }))
      
      return true
    } catch (error) {
      console.error('Error accessing microphone:', error)
      return false
    }
  }, [])
  
  const startDetection = useCallback(async () => {
    if (!audioContextRef.current || !analyserRef.current) {
      const initialized = await initializeAudio()
      if (!initialized) return false
    }
    
    // Reset detection state
    previousLevelsRef.current = []
    backgroundNoiseRef.current = 0
    noiseCalibrationCountRef.current = 0
    
    setState(prev => ({ ...prev, isActive: true, hitCount: 0 }))
    startAnalysis()
    return true
  }, [initializeAudio])
  
  const stopDetection = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false }))
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])
  
  const resetCounter = useCallback(() => {
    setState(prev => ({ ...prev, hitCount: 0, lastHitTime: 0 }))
  }, [])
  
  const startAnalysis = useCallback(() => {
    if (!analyserRef.current) return
    
    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const analyze = () => {
      if (!analyserRef.current) return
      
      analyser.getByteFrequencyData(dataArray)
      
      // Calculate frequency range for paddle hits (2-8kHz)
      const sampleRate = audioContextRef.current?.sampleRate || 44100
      const nyquist = sampleRate / 2
      const binSize = nyquist / bufferLength
      
      const minBin = Math.floor(config.frequencyMin / binSize)
      const maxBin = Math.floor(config.frequencyMax / binSize)
      
      // Calculate different frequency bands for analysis
      const lowMidBin = Math.floor(3000 / binSize)   // 3kHz
      const highMidBin = Math.floor(6000 / binSize)  // 6kHz
      
      // Low-mid range (2-3kHz) - typical for paddle impact
      let lowMidSum = 0
      for (let i = minBin; i < lowMidBin; i++) {
        lowMidSum += dataArray[i]
      }
      const lowMidAvg = lowMidSum / (lowMidBin - minBin)
      
      // High range (3-6kHz) - typical for paddle sound
      let highSum = 0
      let maxAmplitude = 0
      for (let i = lowMidBin; i < highMidBin; i++) {
        highSum += dataArray[i]
        maxAmplitude = Math.max(maxAmplitude, dataArray[i])
      }
      const highAvg = highSum / (highMidBin - lowMidBin)
      
      // Very high range (6-8kHz) - helps distinguish from speech
      let veryHighSum = 0
      for (let i = highMidBin; i < maxBin; i++) {
        veryHighSum += dataArray[i]
      }
      const veryHighAvg = veryHighSum / (maxBin - highMidBin)
      
      // Combined level for visualization
      const averageAmplitude = (lowMidSum + highSum + veryHighSum) / (maxBin - minBin)
      const normalizedLevel = Math.max(averageAmplitude / 255, maxAmplitude / 255 * 0.7)
      
      // Keep track of recent levels for attack detection
      const currentLevel = Math.max(lowMidAvg, highAvg, veryHighAvg) / 255
      previousLevelsRef.current.push(currentLevel)
      if (previousLevelsRef.current.length > 10) {
        previousLevelsRef.current.shift()
      }
      
      // Calibrate background noise level (first 100 samples)
      if (noiseCalibrationCountRef.current < 100) {
        backgroundNoiseRef.current = (backgroundNoiseRef.current * noiseCalibrationCountRef.current + currentLevel) / (noiseCalibrationCountRef.current + 1)
        noiseCalibrationCountRef.current++
      }
      
      setState(prev => {
        if (!prev.isActive) return { ...prev, audioLevel: normalizedLevel }
        
        const now = Date.now()
        if (now - prev.lastHitTime < config.minHitInterval) {
          return { ...prev, audioLevel: normalizedLevel }
        }
        
        // Enhanced hit detection algorithm
        const isHit = detectHit(currentLevel, highAvg, veryHighAvg, lowMidAvg)
        
        if (isHit) {
          return {
            ...prev,
            audioLevel: normalizedLevel,
            hitCount: prev.hitCount + 1,
            lastHitTime: now
          }
        }
        
        return { ...prev, audioLevel: normalizedLevel }
      })
      
      animationFrameRef.current = requestAnimationFrame(analyze)
    }
    
    // Hit detection logic
    const detectHit = (currentLevel: number, highAvg: number, veryHighAvg: number, lowMidAvg: number) => {
      const baseThreshold = config.sensitivity / 100
      const adaptiveThreshold = Math.max(baseThreshold, backgroundNoiseRef.current * 3)
      
      // 1. Volume threshold check
      if (currentLevel < adaptiveThreshold) return false
      
      // 2. Sharp attack detection - current level should be significantly higher than recent average
      const recentLevels = previousLevelsRef.current.slice(-5) // Last 5 samples
      if (recentLevels.length > 2) {
        const recentAvg = recentLevels.slice(0, -1).reduce((a, b) => a + b, 0) / (recentLevels.length - 1)
        const attackRatio = currentLevel / (recentAvg + 0.01) // Add small value to avoid division by zero
        
        // Paddle hits have sharp attacks (ratio > 2.5)
        if (attackRatio < 2.5) return false
      }
      
      // 3. Frequency signature analysis - paddle hits have strong high frequencies
      const highFreqRatio = (highAvg + veryHighAvg) / (lowMidAvg + 1) // Avoid division by zero
      
      // Paddle hits typically have significant high-frequency content
      // Speech has more energy in lower frequencies
      if (highFreqRatio < 0.8) return false
      
      // 4. Peak detection - paddle hits have sharp peaks
      const normalizedHigh = highAvg / 255
      const normalizedVeryHigh = veryHighAvg / 255
      
      // At least one of the high frequency bands should be strong
      if (normalizedHigh < adaptiveThreshold && normalizedVeryHigh < adaptiveThreshold) return false
      
      return true
    }
    
    analyze()
  }, [config])
  
  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
    }
    
    audioContextRef.current = null
    analyserRef.current = null
    microphoneRef.current = null
    streamRef.current = null
  }, [])
  
  useEffect(() => {
    return cleanup
  }, [cleanup])
  
  return {
    ...state,
    startDetection,
    stopDetection,
    resetCounter,
    initializeAudio,
    cleanup
  }
}