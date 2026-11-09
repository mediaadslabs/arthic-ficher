'use client'

import { useGameStore } from '@/lib/game/store'
import { getWeatherTypeDescription } from '@/lib/game/types'

export function TimeWeatherDisplay() {
  const { player } = useGameStore()
  
  if (!player) return null

  const time = player.time
  const weather = player.weather.current

  const formatTime = () => {
    const h = time.hour.toString().padStart(2, '0')
    const m = time.minute.toString().padStart(2, '0')
    return `${h}:${m}`
  }

  const getDayIcon = () => {
    switch (time.timeOfDay) {
      case 'dawn': return '🌅'
      case 'day': return '☀️'
      case 'dusk': return '🌇'
      case 'night': return '🌙'
    }
  }

  const getWeatherIcon = () => {
    switch (weather.type) {
      case 'clear': return '☀️'
      case 'cloudy': return '☁️'
      case 'rain': return '🌧️'
      case 'snow': return '❄️'
      case 'fog': return '🌫️'
      case 'storm': return '⛈️'
      case 'blizzard': return '🌨️'
    }
  }

  const getTempDisplay = () => {
    if (weather.temperature > 0) return `+${Math.round(weather.temperature)}°C`
    return `${Math.round(weather.temperature)}°C`
  }

  return (
    <div className="absolute top-4 right-4 bg-slate-800/80 backdrop-blur rounded-lg p-3 border border-slate-600/50 min-w-[180px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{getDayIcon()}</span>
          <span className="text-slate-300 font-mono text-lg">{formatTime()}</span>
        </div>
        <span className="text-slate-400 text-sm">Day {time.day}</span>
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <span className="text-xl">{getWeatherIcon()}</span>
        <div className="flex-1">
          <div className="text-slate-300 capitalize">{weather.type}</div>
          <div className="text-xs">{getWeatherTypeDescription(weather.type)}</div>
        </div>
      </div>

      <div className="flex justify-between mt-2 text-xs text-slate-400 border-t border-slate-700 pt-2">
        <span>Wind: {Math.round(weather.windSpeed)} kts</span>
        <span>{getTempDisplay()}</span>
      </div>

      {weather.windSpeed > 15 && (
        <div className="mt-2 text-xs text-yellow-400 bg-yellow-900/30 rounded px-2 py-1">
          ⚠️ High winds affecting sailing!
        </div>
      )}

      {(weather.type === 'storm' || weather.type === 'blizzard') && (
        <div className="mt-2 text-xs text-red-400 bg-red-900/30 rounded px-2 py-1">
          ⚠️ Dangerous weather! Seek shelter!
        </div>
      )}
    </div>
  )
}