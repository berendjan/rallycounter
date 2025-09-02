import { useTranslation } from 'react-i18next'

export default function Help() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t('help.title')}</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* How to Use */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            📱 {t('help.howToUse')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <p className="text-gray-700">{t('help.instructions.step1')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                2
              </div>
              <p className="text-gray-700">{t('help.instructions.step2')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                3
              </div>
              <p className="text-gray-700">{t('help.instructions.step3')}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                4
              </div>
              <p className="text-gray-700">{t('help.instructions.step4')}</p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            🔧 {t('help.troubleshooting')}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="font-medium text-gray-800 mb-1">🎚️ Sensitivity Issues</div>
              <p className="text-sm text-gray-600">{t('help.tips.sensitivity')}</p>
            </div>
            <div>
              <div className="font-medium text-gray-800 mb-1">🎤 Microphone Problems</div>
              <p className="text-sm text-gray-600">{t('help.tips.permissions')}</p>
            </div>
            <div>
              <div className="font-medium text-gray-800 mb-1">📍 Environment Setup</div>
              <p className="text-sm text-gray-600">{t('help.tips.calibration')}</p>
            </div>
          </div>
        </div>

        {/* Technical Information */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            ⚙️ Technical Details
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <div className="font-medium">Detection Method</div>
              <div className="text-gray-600">Volume threshold + frequency filtering (2-8kHz)</div>
            </div>
            <div>
              <div className="font-medium">Supported Browsers</div>
              <div className="text-gray-600">Safari (iOS), Chrome, Firefox, Brave (Android)</div>
            </div>
            <div>
              <div className="font-medium">Permissions Required</div>
              <div className="text-gray-600">Microphone access for audio detection</div>
            </div>
            <div>
              <div className="font-medium">Data Storage</div>
              <div className="text-gray-600">Local storage (scores and settings stay on device)</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <div className="font-medium text-gray-800 mb-1">Q: Why isn't it detecting my hits?</div>
              <p className="text-sm text-gray-600">
                Try increasing sensitivity in Settings or move closer to the table. Background noise can interfere with detection.
              </p>
            </div>
            <div>
              <div className="font-medium text-gray-800 mb-1">Q: Can I use this outdoors?</div>
              <p className="text-sm text-gray-600">
                Yes, but you may need to increase sensitivity due to wind and ambient noise.
              </p>
            </div>
            <div>
              <div className="font-medium text-gray-800 mb-1">Q: Will my scores be saved if I close the app?</div>
              <p className="text-sm text-gray-600">
                Yes, all scores and settings are saved locally on your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}