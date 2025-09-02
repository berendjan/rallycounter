import { useTranslation } from 'react-i18next'
import { useHighscores, useStats } from '../hooks/useLocalStorage'

export default function Highscores() {
  const { t } = useTranslation()
  const [highscores, setHighscores] = useHighscores()
  const [stats] = useStats()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all scores?')) {
      setHighscores([])
    }
  }

  const handleExportData = () => {
    const data = {
      highscores,
      stats,
      exported: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rallycounter-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{t('scores.title')}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            {t('scores.export')}
          </button>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
          >
            {t('scores.clear')}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalHits}</div>
          <div className="text-sm text-gray-600">Total Hits</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-green-600">{stats.longestRally}</div>
          <div className="text-sm text-gray-600">Best Rally</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalSessions}</div>
          <div className="text-sm text-gray-600">Sessions</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(stats.averageRallyLength)}
          </div>
          <div className="text-sm text-gray-600">Avg Rally</div>
        </div>
      </div>

      {/* High Scores */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Top Scores</h2>
        </div>
        <div className="divide-y">
          {highscores.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {t('scores.noScores')}
            </div>
          ) : (
            highscores.map((score, index) => (
              <div key={score.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-400 w-8">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">
                        {score.score} hits
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(score.date)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {t(`scores.${score.type}`)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDuration(score.duration)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}