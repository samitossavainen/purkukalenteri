import { useEffect, useMemo, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { ArrowLeft, ChevronDown, Cloud, CloudSun } from 'lucide-react'
import { isValid, parseISO } from 'date-fns'
import ForecastCard from '../components/ForecastCard'
import PageHeading from '../components/PageHeading'
import WeatherCard from '../components/WeatherCard'
import { getForecastIndices, icingAssessment, weatherDetails, WEATHER_URL } from '../utils/weather'

function isValidForecast(data) {
  const currentFields = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'precipitation',
    'weather_code',
    'wind_speed_10m',
  ]
  const hourlyFields = ['temperature_2m', 'precipitation', 'precipitation_probability', 'weather_code']

  return Boolean(data?.current)
    && typeof data.current.time === 'string'
    && isValid(parseISO(data.current.time))
    && currentFields.every((field) => Number.isFinite(data.current[field]))
    && Array.isArray(data.hourly?.time)
    && data.hourly.time.length > 0
    && data.hourly.time.every((time) => typeof time === 'string' && isValid(parseISO(time)))
    && hourlyFields.every((field) => (
      Array.isArray(data.hourly[field])
      && data.hourly[field].length === data.hourly.time.length
      && data.hourly[field].every(Number.isFinite)
    ))
}

export default function WeatherPage() {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function fetchWeather() {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(WEATHER_URL)
      if (!response.ok) throw new Error(`Weather service returned ${response.status}.`)
      const data = await response.json()
      if (!isValidForecast(data)) throw new Error('Weather service returned incomplete forecast data.')
      setWeather(data)
    } catch (requestError) {
      console.error('Could not load weather forecast.', requestError)
      setError('We couldn’t load the latest forecast. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  const current = weather?.current
  const [condition, WeatherIcon] = current ? weatherDetails(current.weather_code) : ['Loading forecast', CloudSun]
  const forecastIndices = useMemo(() => getForecastIndices(weather), [weather])
  const icing = weather && forecastIndices.length ? icingAssessment(weather, forecastIndices) : null

  return (
    <>
      <PageHeading eyebrow="DOCK PREPARATION" title="Weather conditions" description="Local forecasts help your team prepare for changing unloading conditions.">
        <div className="location-chip"><span className="location-dot" /> Kuopio, Finland <ChevronDown size={14} /></div>
      </PageHeading>

      {error ? (
        <Alert variant="danger" className="weather-error" role="alert">
          <div className="weather-error-icon"><Cloud size={19} /></div>
          <div><strong>Forecast unavailable</strong><p>{error}</p></div>
          <Button variant="light" className="app-secondary-button" onClick={fetchWeather}>Try again</Button>
        </Alert>
      ) : (
        <>
          <WeatherCard current={current} condition={condition} WeatherIcon={WeatherIcon} icing={icing} loading={loading} />
          <ForecastCard weather={weather} indices={forecastIndices} loading={loading} />
          <section className="weather-note">
            <div className="weather-note-icon"><CloudSun size={17} /></div>
            <p><strong>Cold-chain reminder</strong> Compare outdoor conditions with shipment measurements and check temperature-controlled unloading areas. Forecasts are provided by Open-Meteo.</p>
            <span>METRIC UNITS</span>
          </section>
        </>
      )}
      <div className="page-footnote">
        <span>Weather data provided by Open-Meteo</span>
        <button className="refresh-weather" onClick={fetchWeather} disabled={loading}><ArrowLeft size={13} /> Refresh forecast</button>
      </div>
    </>
  )
}
