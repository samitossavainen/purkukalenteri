import { format, parseISO } from 'date-fns'
import { Droplets } from 'lucide-react'
import { weatherDetails } from '../utils/weather'

export default function ForecastCard({ weather, indices, loading }) {
  return (
    <section className="forecast-panel">
      <div className="forecast-heading">
        <div>
          <div className="eyebrow">PLAN AHEAD</div>
          <h2>Next 12 hours</h2>
          <p>Hourly temperature and precipitation outlook for dock operations.</p>
        </div>
        <span className="forecast-source"><span className="status-dot" /> Live forecast <span>·</span> Open-Meteo</span>
      </div>
      {loading ? (
        <div className="forecast-skeleton"><span /><span /><span /><span /><span /><span /><span /></div>
      ) : (
        <div className="forecast-scroll">
          <div className="forecast-grid hourly-forecast-grid">
            {indices.map((index) => {
              const hour = weather.hourly.time[index]
              const [label, Icon] = weatherDetails(weather.hourly.weather_code[index])
              const hourDate = parseISO(hour)
              return (
                <div className={`forecast-day ${index === indices[0] ? 'forecast-today' : ''}`} key={hour}>
                  <span className="forecast-weekday">{format(hourDate, 'EEE')}</span>
                  <span className="forecast-date">{format(hourDate, 'HH:mm')}</span>
                  <Icon className="forecast-icon" size={26} strokeWidth={1.65} />
                  <span className="forecast-condition">{label}</span>
                  <span className="forecast-temps"><strong>{Math.round(weather.hourly.temperature_2m[index])}°</strong></span>
                  <span className="forecast-rain">
                    <Droplets size={12} /> {weather.hourly.precipitation_probability[index] ?? 0}%
                    <small>· {weather.hourly.precipitation[index] ?? 0} mm</small>
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
