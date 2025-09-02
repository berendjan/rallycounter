import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Navigation() {
  const location = useLocation()
  const { t } = useTranslation()
  
  const navItems = [
    { path: '/', labelKey: 'navigation.home' },
    { path: '/scores', labelKey: 'navigation.scores' },
    { path: '/settings', labelKey: 'navigation.settings' },
    { path: '/help', labelKey: 'navigation.help' }
  ]
  
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                location.pathname === item.path
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}