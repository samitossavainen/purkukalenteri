import { format, parseISO } from 'date-fns'
import { Cloud, CloudDrizzle, CloudRain, CloudSun, Snowflake, Sun } from 'lucide-react'

export const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=62.8924&longitude=27.6770&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation,precipitation_probability,weather_code&timezone=Europe%2FHelsinki&forecast_days=2'

const WEATHER_CODES = {
  0: ['Clear sky', Sun],
  1: ['Mostly clear', CloudSun],
  2: ['Partly cloudy', CloudSun],
  3: ['Overcast', Cloud],
  45: ['Foggy', Cloud],
  48: ['Rime fog', Cloud],
  51: ['Light drizzle', CloudDrizzle],
  53: ['Drizzle', CloudDrizzle],
  55: ['Heavy drizzle', CloudDrizzle],
  56: ['Freezing drizzle', CloudDrizzle],
  57: ['Freezing drizzle', CloudDrizzle],
  61: ['Light rain', CloudRain],
  63: ['Rain', CloudRain],
  65: ['Heavy rain', CloudRain],
  66: ['Freezing rain', CloudRain],
  67: ['Freezing rain', CloudRain],
  71: ['Light snow', Snowflake],
  73: ['Snow', Snowflake],
  75: ['Heavy snow', Snowflake],
  77: ['Snow grains', Snowflake],
  80: ['Rain showers', CloudRain],
  81: ['Rain showers', CloudRain],
  82: ['Heavy showers', CloudRain],
  85: ['Snow showers', Snowflake],
  86: ['Heavy snow showers', Snowflake],
  95: ['Thunderstorm', CloudRain],
  96: ['Thunderstorm & hail', CloudRain],
  99: ['Thunderstorm & hail', CloudRain],
}

export function weatherDetails(code) {
  return WEATHER_CODES[code] || ['Conditions unavailable', Cloud]
}

export function getForecastIndices(weather) {
  if (!weather?.hourly) return []
  const start = weather.hourly.time.findIndex((time) => time >= weather.current.time)
  if (start < 0) return []
  return Array.from({ length: Math.min(12, weather.hourly.time.length - start) }, (_, index) => start + index)
}

export function icingAssessment(weather, indices) {
  const freezingPrecipitationCodes = new Set([56, 57, 66, 67, 71, 73, 75, 77, 85, 86])
  const riskHour = indices.find((index) => {
    const temperature = weather.hourly.temperature_2m[index]
    const precipitationChance = weather.hourly.precipitation_probability[index] || 0
    const precipitation = weather.hourly.precipitation[index] || 0
    const freezingWeather = freezingPrecipitationCodes.has(weather.hourly.weather_code[index])
    return (temperature <= 0 && (precipitationChance >= 20 || precipitation > 0 || freezingWeather))
      || (temperature <= 2 && precipitationChance >= 30)
      || freezingWeather
  })

  if (riskHour !== undefined) {
    const time = format(parseISO(weather.hourly.time[riskHour]), 'HH:mm')
    return {
      level: 'risk',
      title: 'Potential icing conditions',
      message: `Near-freezing or freezing precipitation is possible around ${time}. Check dock surfaces and prepare de-icing equipment.`,
    }
  }

  const belowFreezingHour = indices.find((index) => weather.hourly.temperature_2m[index] <= 0)
  if (belowFreezingHour !== undefined) {
    const time = format(parseISO(weather.hourly.time[belowFreezingHour]), 'HH:mm')
    return {
      level: 'watch',
      title: 'Below-freezing temperatures',
      message: `Temperatures may fall below 0°C around ${time}. Inspect dock surfaces even though significant precipitation is not forecast.`,
    }
  }

  return {
    level: 'clear',
    title: 'No near-term icing signal',
    message: 'No freezing temperatures or near-freezing precipitation are indicated in the next 12 hours.',
  }
}
