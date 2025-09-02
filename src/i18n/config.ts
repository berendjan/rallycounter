import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Define inline translations for better bundling
const resources = {
  en: {
    common: {
      "navigation": {
        "home": "Home",
        "scores": "Scores",
        "settings": "Settings", 
        "help": "Help"
      },
      "home": {
        "title": "Rally Counter",
        "start": "Start",
        "stop": "Stop",
        "reset": "Reset",
        "currentScore": "Current Score"
      },
      "settings": {
        "title": "Settings",
        "audioSensitivity": "Audio Sensitivity",
        "language": "Language",
        "minHitInterval": "Minimum Hit Interval",
        "theme": "Theme",
        "calibrate": "Calibrate Audio"
      },
      "scores": {
        "title": "High Scores",
        "noScores": "No scores yet",
        "freePlay": "Free Play",
        "timedChallenge": "Timed Challenge",
        "targetChallenge": "Target Challenge",
        "duration": "Duration",
        "export": "Export Data",
        "clear": "Clear All"
      },
      "help": {
        "title": "Help",
        "howToUse": "How to Use",
        "troubleshooting": "Troubleshooting",
        "instructions": {
          "step1": "Allow microphone permissions when prompted",
          "step2": "Hold your phone near the ping pong table",
          "step3": "Press Start to begin counting",
          "step4": "The app will detect paddle hits automatically"
        },
        "tips": {
          "sensitivity": "Adjust sensitivity in Settings if hits aren't detected",
          "permissions": "Make sure microphone permissions are enabled",
          "calibration": "Try calibrating in a quiet environment"
        }
      },
      "common": {
        "save": "Save",
        "cancel": "Cancel",
        "ok": "OK",
        "error": "Error",
        "loading": "Loading..."
      }
    }
  },
  nl: {
    common: {
      "navigation": {
        "home": "Home",
        "scores": "Scores",
        "settings": "Instellingen",
        "help": "Help"
      },
      "home": {
        "title": "Rally Teller",
        "start": "Start",
        "stop": "Stop",
        "reset": "Reset",
        "currentScore": "Huidige Score"
      },
      "settings": {
        "title": "Instellingen",
        "audioSensitivity": "Audio Gevoeligheid",
        "language": "Taal",
        "minHitInterval": "Minimale Hit Interval",
        "theme": "Thema",
        "calibrate": "Audio Kalibreren"
      },
      "scores": {
        "title": "Hoge Scores",
        "noScores": "Nog geen scores",
        "freePlay": "Vrij Spelen",
        "timedChallenge": "Tijd Uitdaging",
        "targetChallenge": "Doel Uitdaging",
        "duration": "Duur",
        "export": "Data Exporteren",
        "clear": "Alles Wissen"
      },
      "help": {
        "title": "Help",
        "howToUse": "Hoe te Gebruiken",
        "troubleshooting": "Probleemoplossing",
        "instructions": {
          "step1": "Sta microfoon permissies toe wanneer gevraagd",
          "step2": "Houd je telefoon bij de pingpong tafel",
          "step3": "Druk op Start om te beginnen met tellen",
          "step4": "De app detecteert batje-hits automatisch"
        },
        "tips": {
          "sensitivity": "Pas gevoeligheid aan in Instellingen als hits niet worden gedetecteerd",
          "permissions": "Zorg dat microfoon permissies zijn ingeschakeld",
          "calibration": "Probeer kalibreren in een rustige omgeving"
        }
      },
      "common": {
        "save": "Opslaan",
        "cancel": "Annuleren",
        "ok": "OK",
        "error": "Fout",
        "loading": "Laden..."
      }
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'nl', 'de', 'fr', 'es'],
    
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    resources,
    
    defaultNS: 'common',
  })

export default i18n