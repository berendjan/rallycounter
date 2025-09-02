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
      
      // Calculate average amplitude in target frequency range
      let sum = 0
      let maxAmplitude = 0
      for (let i = minBin; i < maxBin; i++) {
        sum += dataArray[i]
        maxAmplitude = Math.max(maxAmplitude, dataArray[i])
      }
      const averageAmplitude = sum / (maxBin - minBin)
      // Use a combination of average and peak for better visualization
      const normalizedLevel = Math.max(averageAmplitude / 255, maxAmplitude / 255 * 0.7)
      
      setState(prev => {
        const threshold = config.sensitivity / 100
        const now = Date.now()
        
        if (normalizedLevel > threshold && 
            now - prev.lastHitTime > config.minHitInterval &&
            prev.isActive) {
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