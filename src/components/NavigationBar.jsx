import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  ArrowDownToLine,
  CalendarDays,
  ChevronDown,
  ChevronRight,
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

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <CalendarDays size={18} />
            <span>Calendar</span>
            <span className="nav-shortcut">01</span>
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

        <div className="sidebar-bottom">
          <div className="dock-card">
            <div className="dock-card-icon"><Truck size={17} /></div>
            <div className="dock-card-copy">
              <span>Receiving dock</span>
              <strong>Kuopio, Finland</strong>
            </div>
            <span className="status-dot" />
          </div>
          <div className="sidebar-footer">
            <span className="avatar">PK</span>
            <span className="profile-copy"><strong>Operations team</strong><small>Dock manager</small></span>
            <ChevronDown size={16} className="profile-chevron" />
          </div>
        </div>
      </aside>

      {mobileNavOpen && (
        <button className="mobile-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />
      )}

      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation">
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{location.pathname === '/' ? 'Calendar' : location.pathname.slice(1)}</strong>
          </div>
          <div className="topbar-right">
            <div className="today-label"><span className="status-dot" /> Operations active</div>
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
