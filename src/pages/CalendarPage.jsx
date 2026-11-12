import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { CalendarDays, Check, CloudSun, Plus, ArrowRight } from 'lucide-react'
import CalendarGrid from '../components/CalendarGrid'
import PageHeading from '../components/PageHeading'
import { localDate, mondayOf, shiftDate } from '../utils/dates'

export default function CalendarPage({ bookings, onCreate, onView }) {
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()))
  const days = useMemo(() => Array.from({ length: 5 }, (_, index) => shiftDate(weekStart, index)), [weekStart])
  const today = localDate(new Date())
  const activeBookings = bookings.filter((booking) => !booking.cancelled)
  const weekBookings = activeBookings.filter((booking) => days.some((day) => localDate(day) === booking.date))
  const todayCount = weekBookings.filter((booking) => booking.date === today).length

  return (
    <>
      <PageHeading eyebrow="PLAN & COORDINATE" title="Unloading calendar" description="Keep every delivery moving and every dock ready.">
        <button className="btn btn-primary app-primary-button" onClick={() => onCreate()}>
          <Plus size={17} /> New booking
        </button>
      </PageHeading>

      <section className="summary-grid" aria-label="Weekly overview">
        <div className="summary-card">
          <div className="summary-icon summary-icon-blue"><CalendarDays size={18} /></div>
          <div className="summary-copy"><span>THIS WEEK</span><strong>{weekBookings.length}<small> bookings</small></strong></div>
          <div className="summary-aside">{weekBookings.length ? 'Scheduled' : 'No bookings yet'}</div>
        </div>
        <div className="summary-card">
          <div className="summary-icon summary-icon-green"><Check size={18} /></div>
          <div className="summary-copy"><span>TODAY</span><strong>{todayCount}<small> arrivals</small></strong></div>
          <div className="summary-aside">{todayCount ? 'Dock prepared' : 'Ready to plan'}</div>
        </div>
        <div className="summary-card summary-weather-card">
          <div className="summary-icon summary-icon-sky"><CloudSun size={19} /></div>
          <div className="summary-copy"><span>DOCK CONDITIONS</span><strong>Kuopio</strong></div>
          <NavLink className="weather-link" to="/weather">View forecast <ArrowRight size={14} /></NavLink>
        </div>
      </section>

      <CalendarGrid
        bookings={activeBookings}
        days={days}
        today={today}
        onCreate={onCreate}
        onView={onView}
        onPreviousWeek={() => setWeekStart((current) => shiftDate(current, -7))}
        onNextWeek={() => setWeekStart((current) => shiftDate(current, 7))}
        onToday={() => setWeekStart(mondayOf(new Date()))}
      />
      <div className="page-footnote">
        <span>All times shown in local time (EET)</span>
        <span>6 unloading slots per day <span className="footnote-divider">·</span> Monday to Friday</span>
      </div>
    </>
  )
}
