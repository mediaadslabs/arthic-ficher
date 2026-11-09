import type { WeatherCondition, WeatherForecast, WeatherType, TimeSystem, TimeOfDay, BoatPhysics, Position } from './types'
import { getTimeOfDayFromHour } from './types'

export function updateTimeSystem(time: TimeSystem, delta: number): TimeSystem {
  const minutesPerSecond = 2 * time.speedMultiplier
  const newMinutes = time.minute + minutesPerSecond * delta

  let newHour = time.hour
  let newDay = time.day
  let remainingMinutes = newMinutes

  while (remainingMinutes >= 60) {
    remainingMinutes -= 60
    newHour++
  }

  while (remainingMinutes < 0) {
    remainingMinutes += 60
    newHour--
  }

  if (newHour >= 24) {
    newHour -= 24
    newDay++
  }

  if (newHour < 0) {
    newHour += 24
    newDay--
  }

  const newTimeOfDay = getTimeOfDayFromHour(newHour)

  return {
    hour: newHour,
    minute: Math.floor(remainingMinutes),
    day: newDay,
    timeOfDay: newTimeOfDay,
    speedMultiplier: time.speedMultiplier,
  }
}

export function generateWeatherChange(current: WeatherCondition): WeatherType {
  const transitions: Record<WeatherType, WeatherType[]> = {
    clear: ['clear', 'clear', 'cloudy', 'cloudy', 'rain', 'heatwave'],
    cloudy: ['clear', 'cloudy', 'cloudy', 'rain', 'rain', 'fog', 'snow'],
    rain: ['cloudy', 'rain', 'rain', 'storm', 'fog', 'hail', 'thunderstorm'],
    snow: ['cloudy', 'snow', 'snow', 'blizzard', 'fog', 'ice_storm', 'polar_night'],
    fog: ['cloudy', 'fog', 'clear', 'rain', 'mist'],
    storm: ['rain', 'storm', 'storm', 'cloudy', 'thunderstorm', 'supercell', 'hurricane'],
    blizzard: ['snow', 'blizzard', 'storm', 'cloudy', 'ice_storm', 'polar_night', 'whiteout'],
    aurora: ['clear', 'clear', 'cloudy', 'clear', 'magnetic_storm', 'meteor_shower', 'blood_moon'],
    whiteout: ['blizzard', 'snow', 'storm', 'whiteout', 'ice_storm'],
    hail: ['rain', 'storm', 'hail', 'thunderstorm', 'ice_storm'],
    thunderstorm: ['storm', 'thunderstorm', 'rain', 'hail', 'supercell', 'tornado'],
    mist: ['fog', 'mist', 'clear', 'cloudy', 'rain'],
    heatwave: ['clear', 'heatwave', 'cloudy', 'mist', 'thunderstorm'],
    polar_night: ['snow', 'blizzard', 'polar_night', 'aurora', 'ice_storm'],
    magnetic_storm: ['aurora', 'clear', 'magnetic_storm', 'storm', 'meteor_shower'],
    hurricane: ['storm', 'hurricane', 'supercell', 'rain', 'tsunami', 'rogue_wave'],
    tornado: ['thunderstorm', 'tornado', 'supercell', 'storm', 'hurricane'],
    tsunami: ['storm', 'tsunami', 'hurricane', 'rain', 'rogue_wave'],
    volcanic_ash: ['clear', 'volcanic_ash', 'cloudy', 'fog', 'mist'],
    meteor_shower: ['clear', 'aurora', 'meteor_shower', 'magnetic_storm', 'clear'],
    blood_moon: ['aurora', 'clear', 'blood_moon', 'magnetic_storm', 'meteor_shower'],
    supercell: ['storm', 'thunderstorm', 'supercell', 'tornado', 'hurricane', 'hail'],
    ice_storm: ['snow', 'blizzard', 'ice_storm', 'polar_night', 'hail', 'whiteout'],
    rogue_wave: ['storm', 'rogue_wave', 'tsunami', 'hurricane', 'clear'],
  }

  const options = transitions[current.type]
  return options[Math.floor(Math.random() * options.length)]
}

export function updateWeatherForecast(weather: WeatherForecast, delta: number): WeatherForecast {
  const newTimeUntilChange = weather.timeUntilChange - delta

  if (newTimeUntilChange <= 0) {
    const nextType = weather.next
    const duration = 180 + Math.random() * 300
    const newNext = generateWeatherChange(weather.current)

    const newCondition = generateWeatherCondition(nextType, weather.current)

    return {
      current: newCondition,
      next: newNext,
      timeUntilChange: duration,
    }
  }

  return {
    ...weather,
    timeUntilChange: newTimeUntilChange,
  }
}

function generateWeatherCondition(type: WeatherType, previous: WeatherCondition): WeatherCondition {
  const configs: Record<WeatherType, Partial<WeatherCondition>> = {
    clear: {
      intensity: 0.2 + Math.random() * 0.3,
      windSpeed: 3 + Math.random() * 8,
      visibility: 0.9 + Math.random() * 0.1,
      waveHeight: 0.3 + Math.random() * 0.5,
      temperature: 3 + Math.random() * 7,
    },
    cloudy: {
      intensity: 0.4 + Math.random() * 0.3,
      windSpeed: 8 + Math.random() * 12,
      visibility: 0.7 + Math.random() * 0.2,
      waveHeight: 0.8 + Math.random() * 0.7,
      temperature: 0 + Math.random() * 5,
    },
    rain: {
      intensity: 0.5 + Math.random() * 0.4,
      windSpeed: 12 + Math.random() * 15,
      visibility: 0.4 + Math.random() * 0.3,
      waveHeight: 1.2 + Math.random() * 1,
      temperature: -2 + Math.random() * 5,
    },
    snow: {
      intensity: 0.5 + Math.random() * 0.4,
      windSpeed: 10 + Math.random() * 15,
      visibility: 0.3 + Math.random() * 0.3,
      waveHeight: 1 + Math.random() * 1,
      temperature: -10 + Math.random() * 0,
    },
    fog: {
      intensity: 0.6 + Math.random() * 0.3,
      windSpeed: 2 + Math.random() * 5,
      visibility: 0.1 + Math.random() * 0.2,
      waveHeight: 0.3 + Math.random() * 0.4,
      temperature: -3 + Math.random() * 5,
    },
    storm: {
      intensity: 0.7 + Math.random() * 0.3,
      windSpeed: 20 + Math.random() * 25,
      visibility: 0.2 + Math.random() * 0.2,
      waveHeight: 2 + Math.random() * 2,
      temperature: -5 + Math.random() * 3,
    },
    blizzard: {
      intensity: 0.8 + Math.random() * 0.2,
      windSpeed: 25 + Math.random() * 30,
      visibility: 0.05 + Math.random() * 0.1,
      waveHeight: 2.5 + Math.random() * 2,
      temperature: -15 + Math.random() * -5,
    },
    aurora: {
      intensity: 0.1 + Math.random() * 0.2,
      windSpeed: 1 + Math.random() * 3,
      visibility: 0.95 + Math.random() * 0.05,
      waveHeight: 0.2 + Math.random() * 0.3,
      temperature: -10 + Math.random() * 0,
    },
    whiteout: {
      intensity: 1.0,
      windSpeed: 40 + Math.random() * 30,
      visibility: 0.01 + Math.random() * 0.03,
      waveHeight: 4 + Math.random() * 3,
      temperature: -25 + Math.random() * -10,
    },
    hail: {
      intensity: 0.7 + Math.random() * 0.3,
      windSpeed: 18 + Math.random() * 20,
      visibility: 0.3 + Math.random() * 0.2,
      waveHeight: 1.5 + Math.random() * 1.5,
      temperature: -8 + Math.random() * 5,
    },
    thunderstorm: {
      intensity: 0.8 + Math.random() * 0.2,
      windSpeed: 22 + Math.random() * 25,
      visibility: 0.2 + Math.random() * 0.2,
      waveHeight: 2.5 + Math.random() * 2,
      temperature: -5 + Math.random() * 5,
    },
    mist: {
      intensity: 0.4 + Math.random() * 0.3,
      windSpeed: 3 + Math.random() * 5,
      visibility: 0.15 + Math.random() * 0.15,
      waveHeight: 0.3 + Math.random() * 0.4,
      temperature: 0 + Math.random() * 5,
    },
    heatwave: {
      intensity: 0.2 + Math.random() * 0.2,
      windSpeed: 1 + Math.random() * 3,
      visibility: 0.9 + Math.random() * 0.1,
      waveHeight: 0.2 + Math.random() * 0.3,
      temperature: 10 + Math.random() * 10,
    },
    polar_night: {
      intensity: 0.5 + Math.random() * 0.3,
      windSpeed: 15 + Math.random() * 15,
      visibility: 0.2 + Math.random() * 0.2,
      waveHeight: 1.5 + Math.random() * 1.5,
      temperature: -20 + Math.random() * -10,
    },
    magnetic_storm: {
      intensity: 0.6 + Math.random() * 0.3,
      windSpeed: 8 + Math.random() * 12,
      visibility: 0.5 + Math.random() * 0.2,
      waveHeight: 1 + Math.random() * 1,
      temperature: -10 + Math.random() * 5,
    },
    hurricane: {
      intensity: 0.95 + Math.random() * 0.05,
      windSpeed: 50 + Math.random() * 40,
      visibility: 0.02 + Math.random() * 0.04,
      waveHeight: 8 + Math.random() * 5,
      temperature: -3 + Math.random() * 3,
    },
    tornado: {
      intensity: 1.0,
      windSpeed: 80 + Math.random() * 50,
      visibility: 0.05 + Math.random() * 0.08,
      waveHeight: 5 + Math.random() * 3,
      temperature: -5 + Math.random() * 5,
    },
    tsunami: {
      intensity: 0.9 + Math.random() * 0.1,
      windSpeed: 30 + Math.random() * 20,
      visibility: 0.15 + Math.random() * 0.1,
      waveHeight: 15 + Math.random() * 10,
      temperature: -5 + Math.random() * 3,
    },
    volcanic_ash: {
      intensity: 0.8 + Math.random() * 0.2,
      windSpeed: 15 + Math.random() * 10,
      visibility: 0.03 + Math.random() * 0.05,
      waveHeight: 1 + Math.random() * 0.5,
      temperature: -15 + Math.random() * 5,
    },
    meteor_shower: {
      intensity: 0.2 + Math.random() * 0.2,
      windSpeed: 2 + Math.random() * 5,
      visibility: 0.8 + Math.random() * 0.15,
      waveHeight: 0.3 + Math.random() * 0.4,
      temperature: -15 + Math.random() * 5,
    },
    blood_moon: {
      intensity: 0.3 + Math.random() * 0.2,
      windSpeed: 5 + Math.random() * 8,
      visibility: 0.5 + Math.random() * 0.2,
      waveHeight: 1 + Math.random() * 1,
      temperature: -10 + Math.random() * 5,
    },
    supercell: {
      intensity: 0.9 + Math.random() * 0.1,
      windSpeed: 35 + Math.random() * 30,
      visibility: 0.08 + Math.random() * 0.1,
      waveHeight: 4 + Math.random() * 3,
      temperature: -5 + Math.random() * 5,
    },
    ice_storm: {
      intensity: 0.7 + Math.random() * 0.3,
      windSpeed: 25 + Math.random() * 20,
      visibility: 0.1 + Math.random() * 0.1,
      waveHeight: 2 + Math.random() * 1.5,
      temperature: -18 + Math.random() * 5,
    },
    rogue_wave: {
      intensity: 0.85 + Math.random() * 0.15,
      windSpeed: 20 + Math.random() * 15,
      visibility: 0.3 + Math.random() * 0.15,
      waveHeight: 12 + Math.random() * 8,
      temperature: -5 + Math.random() * 3,
    },
  }

  const config = configs[type]
  const windDirection = previous.windDirection + (Math.random() - 0.5) * 1

  return {
    type,
    intensity: config.intensity!,
    windSpeed: config.windSpeed!,
    windDirection: Math.max(0, Math.min(Math.PI * 2, windDirection)),
    visibility: config.visibility!,
    waveHeight: config.waveHeight!,
    temperature: config.temperature!,
    duration: 180 + Math.random() * 300,
  }
}

export function getWeatherEffectsOnGameplay(weather: WeatherCondition): {
  fishingDifficulty: number
  boatSpeedPenalty: number
  visibilityRange: number
  damagePerSecond: number
  fishActivity: number
} {
  const fishingDifficulty: Record<WeatherType, number> = {
    clear: 1,
    cloudy: 1.1,
    rain: 1.3,
    snow: 1.4,
    fog: 1.2,
    storm: 1.8,
    blizzard: 2.5,
    aurora: 0.8,
    whiteout: 3.0,
    hail: 2.0,
    thunderstorm: 2.2,
    mist: 1.1,
    heatwave: 0.9,
    polar_night: 1.8,
    magnetic_storm: 1.6,
    hurricane: 3.5,
    tornado: 4.0,
    tsunami: 4.0,
    volcanic_ash: 2.5,
    meteor_shower: 0.7,
    blood_moon: 1.0,
    supercell: 3.0,
    ice_storm: 2.5,
    rogue_wave: 3.5,
  }

  const boatSpeedPenalty: Record<WeatherType, number> = {
    clear: 0,
    cloudy: 0.05,
    rain: 0.1,
    snow: 0.15,
    fog: 0.05,
    storm: 0.3,
    blizzard: 0.5,
    aurora: 0,
    whiteout: 0.8,
    hail: 0.35,
    thunderstorm: 0.4,
    mist: 0.1,
    heatwave: 0,
    polar_night: 0.25,
    magnetic_storm: 0.2,
    hurricane: 0.85,
    tornado: 0.9,
    tsunami: 0.8,
    volcanic_ash: 0.6,
    meteor_shower: 0,
    blood_moon: 0.1,
    supercell: 0.7,
    ice_storm: 0.6,
    rogue_wave: 0.75,
  }

  const visibilityRange: Record<WeatherType, number> = {
    clear: 200,
    cloudy: 150,
    rain: 80,
    snow: 60,
    fog: 30,
    storm: 50,
    blizzard: 15,
    aurora: 250,
    whiteout: 5,
    hail: 60,
    thunderstorm: 45,
    mist: 35,
    heatwave: 200,
    polar_night: 30,
    magnetic_storm: 80,
    hurricane: 5,
    tornado: 3,
    tsunami: 10,
    volcanic_ash: 15,
    meteor_shower: 200,
    blood_moon: 50,
    supercell: 8,
    ice_storm: 20,
    rogue_wave: 25,
  }

  const damagePerSecond: Record<WeatherType, number> = {
    clear: 0,
    cloudy: 0,
    rain: 0,
    snow: 0,
    fog: 0,
    storm: 0.5,
    blizzard: 1,
    aurora: 0,
    whiteout: 2,
    hail: 0.8,
    thunderstorm: 1.2,
    mist: 0,
    heatwave: 0,
    polar_night: 0.5,
    magnetic_storm: 0.3,
    hurricane: 3.0,
    tornado: 4.0,
    tsunami: 5.0,
    volcanic_ash: 1.5,
    meteor_shower: 0,
    blood_moon: 0,
    supercell: 2.5,
    ice_storm: 2.0,
    rogue_wave: 3.5,
  }

  const fishActivity: Record<WeatherType, number> = {
    clear: 1,
    cloudy: 1.1,
    rain: 1.2,
    snow: 0.8,
    fog: 0.9,
    storm: 0.5,
    blizzard: 0.3,
    aurora: 1.5,
    whiteout: 0.1,
    hail: 0.4,
    thunderstorm: 0.3,
    mist: 1.0,
    heatwave: 0.6,
    polar_night: 0.6,
    magnetic_storm: 0.7,
    hurricane: 0.05,
    tornado: 0.02,
    tsunami: 0.1,
    volcanic_ash: 0.3,
    meteor_shower: 2.0,
    blood_moon: 1.8,
    supercell: 0.15,
    ice_storm: 0.3,
    rogue_wave: 0.15,
  }

  return {
    fishingDifficulty: fishingDifficulty[weather.type],
    boatSpeedPenalty: boatSpeedPenalty[weather.type],
    visibilityRange: visibilityRange[weather.type],
    damagePerSecond: damagePerSecond[weather.type],
    fishActivity: fishActivity[weather.type],
  }
}

export function getSunPosition(time: TimeSystem): [number, number, number] {
  const hourDecimal = time.hour + time.minute / 60
  const angle = ((hourDecimal - 6) / 12) * Math.PI

  const x = Math.cos(angle) * 100
  const y = Math.max(0, Math.sin(angle) * 100)
  const z = 50

  return [x, y, z]
}

export function getSkyColors(time: TimeSystem): {
  skyColor: string
  fogColor: string
  ambientIntensity: number
  sunIntensity: number
} {
  const hourDecimal = time.hour + time.minute / 60

  if (hourDecimal >= 6 && hourDecimal < 8) {
    const t = (hourDecimal - 6) / 2
    return {
      skyColor: lerpColor('#0a1628', '#87ceeb', t),
      fogColor: lerpColor('#1a2a4a', '#c8dce8', t),
      ambientIntensity: 0.15 + t * 0.25,
      sunIntensity: t * 1.2,
    }
  } else if (hourDecimal >= 8 && hourDecimal < 17) {
    return {
      skyColor: '#87ceeb',
      fogColor: '#c8dce8',
      ambientIntensity: 0.4,
      sunIntensity: 1.2,
    }
  } else if (hourDecimal >= 17 && hourDecimal < 20) {
    const t = (hourDecimal - 17) / 3
    return {
      skyColor: lerpColor('#87ceeb', '#0a1628', t),
      fogColor: lerpColor('#c8dce8', '#1a2a4a', t),
      ambientIntensity: 0.4 - t * 0.25,
      sunIntensity: 1.2 - t * 1.2,
    }
  } else {
    return {
      skyColor: '#0a1628',
      fogColor: '#1a2a4a',
      ambientIntensity: 0.15,
      sunIntensity: 0,
    }
  }
}

function lerpColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16)
  const g1 = parseInt(color1.slice(3, 5), 16)
  const b1 = parseInt(color1.slice(5, 7), 16)

  const r2 = parseInt(color2.slice(1, 3), 16)
  const g2 = parseInt(color2.slice(3, 5), 16)
  const b2 = parseInt(color2.slice(5, 7), 16)

  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
