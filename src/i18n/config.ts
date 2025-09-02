import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Define inline translations for better bundling
const resources = {
  en: {
    translation: {
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
        "currentScore": "Current Score",
        "audioLevel": "Audio Level",
        "listeningActive": "Listening for paddle hits...",
        "microphoneReady": "Microphone ready",
        "microphoneNotConnected": "Microphone not connected",
        "session": "Session",
        "inactivityTimeout": "Inactivity Timeout",
        "waitingForFirstHit": "Waiting for first hit...",
        "thisSession": "This Session",
        "latest": "Latest"
      },
      "settings": {
        "title": "Settings",
        "audioSensitivity": "Audio Sensitivity",
        "language": "Language",
        "minHitInterval": "Minimum Hit Interval",
        "theme": "Theme",
        "calibrate": "Calibrate Audio",
        "microphoneTest": "Microphone Test",
        "testMicrophone": "Test Microphone",
        "testMicrophoneDescription": "Test your microphone settings and calibrate sensitivity",
        "sessionTimeout": "Session Auto-Stop Timeout",
        "timeoutDescription": "Sessions will automatically stop after this time. Set to 0 to disable."
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
    translation: {
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
        "currentScore": "Huidige Score",
        "audioLevel": "Audio Niveau",
        "listeningActive": "Luisterend naar batje-slagen...",
        "microphoneReady": "Microfoon gereed",
        "microphoneNotConnected": "Microfoon niet verbonden",
        "session": "Sessie",
        "inactivityTimeout": "Inactiviteit Time-out",
        "waitingForFirstHit": "Wachten op eerste slag...",
        "thisSession": "Deze Sessie",
        "latest": "Nieuwste"
      },
      "settings": {
        "title": "Instellingen",
        "audioSensitivity": "Audio Gevoeligheid",
        "language": "Taal",
        "minHitInterval": "Minimale Hit Interval",
        "theme": "Thema",
        "calibrate": "Audio Kalibreren",
        "microphoneTest": "Microfoon Test",
        "testMicrophone": "Test Microfoon",
        "testMicrophoneDescription": "Test je microfoon instellingen en kalibreer gevoeligheid",
        "sessionTimeout": "Sessie Auto-Stop Time-out",
        "timeoutDescription": "Sessies stoppen automatisch na deze tijd. Zet op 0 om uit te schakelen."
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
  },
  de: {
    translation: {
      "navigation": {
        "home": "Start",
        "scores": "Punkte",
        "settings": "Einstellungen",
        "help": "Hilfe"
      },
      "home": {
        "title": "Rally Zähler",
        "start": "Start",
        "stop": "Stop",
        "reset": "Zurücksetzen",
        "currentScore": "Aktuelle Punktzahl",
        "audioLevel": "Audio Pegel",
        "listeningActive": "Lausche auf Schläger-Treffer...",
        "microphoneReady": "Mikrofon bereit",
        "microphoneNotConnected": "Mikrofon nicht verbunden",
        "session": "Sitzung",
        "inactivityTimeout": "Inaktivitäts-Timeout",
        "waitingForFirstHit": "Warte auf ersten Treffer...",
        "thisSession": "Diese Sitzung",
        "latest": "Neueste"
      },
      "settings": {
        "title": "Einstellungen",
        "audioSensitivity": "Audio Empfindlichkeit",
        "language": "Sprache",
        "minHitInterval": "Mindest-Hit-Intervall",
        "theme": "Thema",
        "calibrate": "Audio Kalibrieren",
        "microphoneTest": "Mikrofon Test",
        "testMicrophone": "Mikrofon Testen",
        "testMicrophoneDescription": "Mikrofon-Einstellungen testen und Empfindlichkeit kalibrieren",
        "sessionTimeout": "Sitzung Auto-Stopp Timeout",
        "timeoutDescription": "Sitzungen stoppen automatisch nach dieser Zeit. Auf 0 setzen zum Deaktivieren."
      },
      "scores": {
        "title": "Bestenliste",
        "noScores": "Noch keine Punkte",
        "freePlay": "Freies Spiel",
        "timedChallenge": "Zeit Herausforderung",
        "targetChallenge": "Ziel Herausforderung",
        "duration": "Dauer",
        "export": "Daten Exportieren",
        "clear": "Alle Löschen"
      },
      "help": {
        "title": "Hilfe",
        "howToUse": "Anwendung",
        "troubleshooting": "Fehlerbehebung",
        "instructions": {
          "step1": "Mikrofon-Berechtigung erteilen wenn gefragt",
          "step2": "Telefon nahe dem Tischtennistisch halten",
          "step3": "Start drücken um mit dem Zählen zu beginnen",
          "step4": "Die App erkennt Schläger-Treffer automatisch"
        },
        "tips": {
          "sensitivity": "Empfindlichkeit in Einstellungen anpassen falls Treffer nicht erkannt werden",
          "permissions": "Sicherstellen dass Mikrofon-Berechtigung aktiviert ist",
          "calibration": "Kalibrierung in ruhiger Umgebung versuchen"
        }
      },
      "common": {
        "save": "Speichern",
        "cancel": "Abbrechen",
        "ok": "OK",
        "error": "Fehler",
        "loading": "Laden..."
      }
    }
  },
  fr: {
    translation: {
      "navigation": {
        "home": "Accueil",
        "scores": "Scores",
        "settings": "Paramètres",
        "help": "Aide"
      },
      "home": {
        "title": "Compteur de Rally",
        "start": "Démarrer",
        "stop": "Arrêter",
        "reset": "Réinitialiser",
        "currentScore": "Score Actuel",
        "audioLevel": "Niveau Audio",
        "listeningActive": "Écoute des coups de raquette...",
        "microphoneReady": "Microphone prêt",
        "microphoneNotConnected": "Microphone non connecté",
        "session": "Session",
        "inactivityTimeout": "Timeout d'Inactivité",
        "waitingForFirstHit": "Attente du premier coup...",
        "thisSession": "Cette Session",
        "latest": "Dernier"
      },
      "settings": {
        "title": "Paramètres",
        "audioSensitivity": "Sensibilité Audio",
        "language": "Langue",
        "minHitInterval": "Intervalle Minimum de Frappe",
        "theme": "Thème",
        "calibrate": "Calibrer l'Audio",
        "microphoneTest": "Test Microphone",
        "testMicrophone": "Tester le Microphone",
        "testMicrophoneDescription": "Testez vos paramètres de microphone et calibrez la sensibilité",
        "sessionTimeout": "Timeout Auto-Arrêt de Session",
        "timeoutDescription": "Les sessions s'arrêteront automatiquement après ce délai. Mettez à 0 pour désactiver."
      },
      "scores": {
        "title": "Meilleurs Scores",
        "noScores": "Aucun score encore",
        "freePlay": "Jeu Libre",
        "timedChallenge": "Défi Chronométré",
        "targetChallenge": "Défi Cible",
        "duration": "Durée",
        "export": "Exporter les Données",
        "clear": "Tout Effacer"
      },
      "help": {
        "title": "Aide",
        "howToUse": "Comment Utiliser",
        "troubleshooting": "Dépannage",
        "instructions": {
          "step1": "Autoriser les permissions du microphone quand demandé",
          "step2": "Tenir votre téléphone près de la table de ping-pong",
          "step3": "Appuyer sur Démarrer pour commencer le comptage",
          "step4": "L'app détectera automatiquement les coups de raquette"
        },
        "tips": {
          "sensitivity": "Ajuster la sensibilité dans Paramètres si les coups ne sont pas détectés",
          "permissions": "S'assurer que les permissions du microphone sont activées",
          "calibration": "Essayer de calibrer dans un environnement silencieux"
        }
      },
      "common": {
        "save": "Sauvegarder",
        "cancel": "Annuler",
        "ok": "OK",
        "error": "Erreur",
        "loading": "Chargement..."
      }
    }
  },
  es: {
    translation: {
      "navigation": {
        "home": "Inicio",
        "scores": "Puntuaciones",
        "settings": "Configuración",
        "help": "Ayuda"
      },
      "home": {
        "title": "Contador de Rally",
        "start": "Iniciar",
        "stop": "Parar",
        "reset": "Reiniciar",
        "currentScore": "Puntuación Actual",
        "audioLevel": "Nivel de Audio",
        "listeningActive": "Escuchando golpes de raqueta...",
        "microphoneReady": "Micrófono listo",
        "microphoneNotConnected": "Micrófono no conectado",
        "session": "Sesión",
        "inactivityTimeout": "Timeout de Inactividad",
        "waitingForFirstHit": "Esperando primer golpe...",
        "thisSession": "Esta Sesión",
        "latest": "Último"
      },
      "settings": {
        "title": "Configuración",
        "audioSensitivity": "Sensibilidad de Audio",
        "language": "Idioma",
        "minHitInterval": "Intervalo Mínimo de Golpe",
        "theme": "Tema",
        "calibrate": "Calibrar Audio",
        "microphoneTest": "Test de Micrófono",
        "testMicrophone": "Probar Micrófono",
        "testMicrophoneDescription": "Prueba la configuración de tu micrófono y calibra la sensibilidad",
        "sessionTimeout": "Timeout Auto-Parada de Sesión",
        "timeoutDescription": "Las sesiones se detendrán automáticamente después de este tiempo. Pon 0 para desactivar."
      },
      "scores": {
        "title": "Mejores Puntuaciones",
        "noScores": "Sin puntuaciones aún",
        "freePlay": "Juego Libre",
        "timedChallenge": "Desafío Cronometrado",
        "targetChallenge": "Desafío Objetivo",
        "duration": "Duración",
        "export": "Exportar Datos",
        "clear": "Limpiar Todo"
      },
      "help": {
        "title": "Ayuda",
        "howToUse": "Cómo Usar",
        "troubleshooting": "Solución de Problemas",
        "instructions": {
          "step1": "Permitir permisos de micrófono cuando se solicite",
          "step2": "Mantén tu teléfono cerca de la mesa de ping pong",
          "step3": "Presiona Iniciar para comenzar a contar",
          "step4": "La app detectará automáticamente los golpes de raqueta"
        },
        "tips": {
          "sensitivity": "Ajustar sensibilidad en Configuración si no se detectan golpes",
          "permissions": "Asegurarse de que los permisos del micrófono estén activados",
          "calibration": "Intentar calibrar en un ambiente silencioso"
        }
      },
      "common": {
        "save": "Guardar",
        "cancel": "Cancelar",
        "ok": "OK",
        "error": "Error",
        "loading": "Cargando..."
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
  })

export default i18n