import { useTranslation } from 'react-i18next'
import { useSettings } from '../hooks/useLocalStorage'
import { useTheme } from '../contexts/ThemeContext'
import { useEffect } from 'react'

export default function Settings() {
  const { t, i18n } = useTranslation()
  const [settings, setSettings] = useSettings()
  const { theme, setTheme } = useTheme()

  // Sync i18n language with settings on component mount
  useEffect(() => {
    if (settings.language && settings.language !== i18n.language) {
      i18n.changeLanguage(settings.language)
    }
  }, [])

  const handleSensitivityChange = (value: number) => {
    setSettings(prev => ({ ...prev, sensitivity: value }))
  }

  const handleIntervalChange = (value: number) => {
    setSettings(prev => ({ ...prev, minHitInterval: value }))
  }
  
  const handleTimeoutChange = (value: number) => {
    setSettings(prev => ({ ...prev, sessionTimeout: value }))
  }

  const handleLanguageChange = (language: string) => {
    setSettings(prev => ({ ...prev, language }))
    i18n.changeLanguage(language)
  }

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ]

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">{t('settings.title')}</h1>
      
      <div className="space-y-8">
        {/* Audio Sensitivity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{t('settings.audioSensitivity')}</label>
          <div className="space-y-3">
            <input 
              type="range" 
              min="1" 
              max="95" 
              value={settings.sensitivity}
              onChange={(e) => handleSensitivityChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low Threshold<br/><strong>More Sensitive</strong></span>
              <span className="font-medium text-center">{settings.sensitivity}%</span>
              <span className="text-right">High Threshold<br/><strong>Less Sensitive</strong></span>
            </div>
            <div className="text-xs text-gray-400 mt-2 text-center">
              <strong>Lower values</strong> = detects quiet sounds easily • <strong>Higher values</strong> = only loud sounds register
            </div>
          </div>
        </div>

        {/* Hit Interval */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium mb-3">{t('settings.minHitInterval')}</label>
          <div className="space-y-3">
            <input 
              type="range" 
              min="100" 
              max="500" 
              step="50"
              value={settings.minHitInterval}
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>100ms</span>
              <span className="font-medium">{settings.minHitInterval}ms</span>
              <span>500ms</span>
            </div>
          </div>
        </div>

        {/* Session Timeout */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{t('settings.sessionTimeout')}</label>
          <div className="space-y-3">
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="1"
              value={settings.sessionTimeout * 10} // Convert to 100ms units
              onChange={(e) => handleTimeoutChange(Number(e.target.value) / 10)} // Convert back to seconds
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Off</span>
              <span className="font-medium">
                {settings.sessionTimeout === 0 ? 'Off' : 
                 settings.sessionTimeout < 1 ? `${Math.round(settings.sessionTimeout * 1000)}ms` :
                 `${settings.sessionTimeout}s`}
              </span>
              <span>10s</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {t('settings.timeoutDescription')}
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{t('settings.language')}</label>
          <select 
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Theme Selection */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{t('settings.theme')}</label>
          <div className="flex gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`px-4 py-2 rounded-lg border-2 ${
                theme === 'light' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
              }`}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`px-4 py-2 rounded-lg border-2 ${
                theme === 'dark' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
              }`}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* Microphone Test */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{t('settings.microphoneTest')}</h3>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            {t('settings.testMicrophone')}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {t('settings.testMicrophoneDescription')}
          </p>
        </div>
      </div>
    </div>
  )
}