import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ArrowDownToLine,
  CalendarDays,
  Cloud,
  Menu,
  Truck,
} from 'lucide-react'
import { displayDate } from '../utils/dates'
import Footer from './Footer'

export default function NavigationBar({ bookingCount, children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  return (
    <>
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><ArrowDownToLine size={21} strokeWidth={2.5} /></div>
          <div>
            <div className="brand-name">purku<span>kalenteri</span></div>
            <div className="brand-caption">RECEIVING OPERATIONS</div>
          </div>
        </div>

        <div className="sidebar-label">NAVIGATION</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CalendarDays size={18} />
            <span>Calendar</span>
          </NavLink>
          <NavLink to="/bookings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Truck size={18} />
            <span>Bookings</span>
            <span className="nav-count">{bookingCount}</span>
          </NavLink>
          <NavLink to="/weather" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Cloud size={18} />
            <span>Weather</span>
            <span className="weather-live-dot" />
          </NavLink>
        </nav>

      </aside>

      {mobileNavOpen && (
        <button className="mobile-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />
      )}

      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation">
            <Menu size={20} />
          </button>
          <div className="topbar-right">
            <div className="topbar-date">{displayDate(new Date(), 'EEE, MMM d')}</div>
          </div>
        </header>
        <div className="page-content">
          {children}
          <Footer />
        </div>
      </main>
    </>
  )
}
