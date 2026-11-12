import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { TIME_SLOTS, WEEKDAYS } from '../utils/bookings'
import { localDate, weekLabel } from '../utils/dates'
import TimeSlotCard from './TimeSlotCard'

export default function CalendarGrid({
  bookings,
  days,
  today,
  onCreate,
  onView,
  onPreviousWeek,
  onNextWeek,
  onToday,
}) {
  return (
    <section className="calendar-panel">
      <div className="calendar-toolbar">
        <div className="calendar-title">
          <span className="calendar-title-mark"><CalendarDays size={17} /></span>
          <div><h2>Weekly schedule</h2><p>{weekLabel(days)}</p></div>
        </div>
        <div className="calendar-controls">
          <button className="btn btn-sm btn-light today-button" onClick={onToday}>Today</button>
          <div className="week-arrows">
            <button className="icon-button" onClick={onPreviousWeek} aria-label="Previous week"><ChevronLeft size={18} /></button>
            <button className="icon-button" onClick={onNextWeek} aria-label="Next week"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      <div className="calendar-scroll">
        <div className="calendar-grid">
          <div className="calendar-corner">LOCAL TIME</div>
          {days.map((day, index) => {
            const date = localDate(day)
            const isToday = date === today
            return (
              <div className={`day-heading ${isToday ? 'is-today' : ''}`} key={date}>
                <span>{WEEKDAYS[index]}</span>
                <strong>{day.getDate()}</strong>
                {isToday && <i>Today</i>}
              </div>
            )
          })}
          {TIME_SLOTS.map((time) => (
            <div className="calendar-row" key={time}>
              <div className="time-label">{time}</div>
              {days.map((day) => {
                const date = localDate(day)
                const booking = bookings.find((item) => item.date === date && item.time === time)
                return (
                  <TimeSlotCard
                    key={`${date}-${time}`}
                    date={date}
                    time={time}
                    booking={booking}
                    onCreate={onCreate}
                    onView={onView}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-legend">
        <span><i className="legend-dot legend-standard" /> Standard unloading</span>
        <span><i className="legend-dot legend-temperature" /> Temperature range check</span>
        <span className="legend-note">Click an available slot to add a booking</span>
      </div>
    </section>
  )
}
