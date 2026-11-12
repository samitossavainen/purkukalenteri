import { Alert } from 'react-bootstrap'
import { CloudRain, Droplets, Snowflake, Wind } from 'lucide-react'

export default function WeatherCard({ current, condition, WeatherIcon, icing, loading }) {
  return (
    <>
      <section className="weather-hero">
        <div className="weather-hero-main">
          <div className="weather-live-label"><span className="weather-live-dot" /> CURRENT CONDITIONS <span>·</span> KUOPIO</div>
          {loading ? (
            <div className="weather-loading">
              <span className="spinner-border spinner-border-sm" role="status" />
              Loading latest conditions...
            </div>
          ) : (
            <>
              <div className="current-weather">
                <div className="current-temperature">{Math.round(current.temperature_2m)}<span>°</span></div>
                <div className="current-condition">
                  <WeatherIcon size={34} strokeWidth={1.6} />
                  <strong>{condition}</strong>
                  <span>Feels like {Math.round(current.apparent_temperature)}°</span>
                </div>
              </div>
              <div className="weather-update">Updated {current.time.slice(11, 16)} local time</div>
            </>
          )}
        </div>
        <div className="weather-metrics">
          <div className="metric-item"><div className="metric-icon"><Droplets size={17} /></div><span>Humidity</span><strong>{loading ? '—' : `${current.relative_humidity_2m}%`}</strong></div>
          <div className="metric-item"><div className="metric-icon"><Wind size={17} /></div><span>Wind speed</span><strong>{loading ? '—' : <>{Math.round(current.wind_speed_10m)} <small>km/h</small></>}</strong></div>
          <div className="metric-item"><div className="metric-icon"><CloudRain size={17} /></div><span>Precipitation</span><strong>{loading ? '—' : <>{current.precipitation} <small>mm</small></>}</strong></div>
        </div>
      </section>

      {icing && (
        <Alert variant={icing.level === 'risk' ? 'danger' : icing.level === 'watch' ? 'warning' : 'success'} className={`icing-alert icing-${icing.level}`}>
          <div className="weather-note-icon"><Snowflake size={17} /></div>
          <div>
            <strong>{icing.title}</strong>
            <p>{icing.message}</p>
            <small>Estimate based on forecast temperature and precipitation; verify actual dock conditions.</small>
          </div>
        </Alert>
      )}
    </>
  )
}
