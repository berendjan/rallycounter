# Rally Counter Web App

## Overview
A web application that detects the sound of ping pong paddle hits and counts the number of passes between paddles to track high scores during rally practice.

## Technical Requirements

### Tech Stack
- React app with Vite build tool
- React Router for navigation
- Shadcn/ui for frontend components
- Tailwind CSS for styling
- TypeScript for type safety
- React-i18next for internationalization
- Deployment: Cloudflare as static page

### Browser Compatibility
- Safari on iOS
- Chrome/Firefox/Brave on Android
- Must request proper microphone permissions
- All code in English, UI supports multiple languages

## Audio Detection Specification

### Method: Volume Threshold + Frequency Filtering
- Detect audio peaks using Web Audio API
- Filter for paddle hit frequency range (2-8kHz)
- Configurable sensitivity slider (10-90%)
- Minimum time between hits: 200ms (prevents double counting)
- Real-time audio visualization (volume meter)

### Calibration
- Auto-calibration during first 5 seconds
- Manual sensitivity adjustment in settings
- Background noise filtering

## Application Structure

### Pages (React Router)
1. **Home/Dashboard** (`/`)
   - Current session counter display
   - Start/Stop/Reset buttons
   - Real-time audio feedback meter
   - Current rally count
   - Session timer

2. **Settings** (`/settings`)
   - Audio sensitivity slider
   - Minimum hit interval setting
   - Microphone permissions check
   - Audio calibration tool
   - Dark/Light mode toggle
   - Language selection dropdown

3. **Highscores** (`/scores`)
   - Top 10 scores with date/time
   - Filter by session type
   - Export/Import data (JSON)
   - Clear all data option
   - Personal statistics

4. **Help** (`/help`)
   - How to use instructions
   - Troubleshooting guide
   - Audio setup tips
   - FAQ section

### UI/UX Requirements
- Mobile-first responsive design
- Large touch-friendly buttons
- Clear visual feedback for audio detection
- Accessible color scheme
- Loading states and error handling

## Game Logic

### Session Types
1. **Free Play**: Unlimited counting until stop
2. **Timed Challenge**: 30s/60s/120s sessions
3. **Target Challenge**: First to reach X hits (50/100/200)

### Scoring System
- 1 point per detected paddle hit
- Bonus for consecutive hits (combo multiplier)
- Track longest rally per session
- Record session duration and average hits/second

### Hit Detection Rules
- Volume must exceed sensitivity threshold
- Must be within paddle hit frequency range
- Minimum 200ms between consecutive hits
- Maximum 2 second gap (resets combo counter)

## Data Storage (localStorage)

```json
{
  "highscores": [
    {
      "id": "uuid",
      "score": 156,
      "date": "2024-01-01T15:30:00Z",
      "duration": 45,
      "type": "free|timed|target",
      "longestRally": 23
    }
  ],
  "settings": {
    "sensitivity": 50,
    "minHitInterval": 200,
    "theme": "light|dark",
    "soundEnabled": true,
    "language": "en|nl|de|fr|es"
  },
  "stats": {
    "totalHits": 1234,
    "longestRally": 156,
    "totalSessions": 45,
    "averageRallyLength": 12.5,
    "totalPlayTime": 3600
  }
}
```

## Performance Requirements
- Audio processing with <50ms latency
- Smooth 60fps UI updates
- Efficient memory usage for long sessions
- Background audio processing when tab not active

## Internationalization (i18n)

### Language Support
- **Default**: Auto-detect browser language (navigator.language)
- **Supported**: English (en), Dutch (nl), German (de), French (fr), Spanish (es)
- **Fallback**: English if browser language not supported
- **Implementation**: React-i18next with JSON translation files

### Language Selection
- Dropdown in Settings page with flag icons
- Immediately applies without restart
- Saves preference to localStorage
- Updates page title and meta tags

### Translation Structure
```
/public/locales/
├── en/
│   └── common.json
├── nl/
│   └── common.json
├── de/
│   └── common.json
├── fr/
│   └── common.json
└── es/
    └── common.json
```

### Key Translation Areas
- Navigation labels
- Button text and tooltips
- Settings descriptions
- Error messages
- Help content
- Score labels and units
- Session type names

## Error Handling
- Microphone permission denied
- Audio device not available
- Browser compatibility issues
- localStorage quota exceeded
- Audio processing errors
- Translation loading errors
