import { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { addDays, format, isSameMonth, isWeekend, parseISO, startOfWeek } from 'date-fns'
import { Alert, Button, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSun,
  Download,
  Droplets,
  Menu,
  Plus,
  Search,
  Snowflake,
  Sun,
  Thermometer,
  Truck,
  Wind,
  X,
} from 'lucide-react'

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=62.8924&longitude=27.6770&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation,precipitation_probability,weather_code&timezone=Europe%2FHelsinki&forecast_days=2'

function localDate(date) {
  return format(date, 'yyyy-MM-dd')
}

function shiftDate(date, days) {
  return addDays(date, days)
}

function nextWeekdayDate(date = new Date()) {
  const day = date.getDay()
  return localDate(day === 6 ? shiftDate(date, 2) : day === 0 ? shiftDate(date, 1) : date)
}

function mondayOf(date) {
  return startOfWeek(date, { weekStartsOn: 1 })
}

function displayDate(date, pattern = 'MMM d') {
  return format(date, pattern)
}

function weekLabel(days) {
  const start = days[0]
  const end = days[4]
  if (isSameMonth(start, end)) {
    return `${format(start, 'MMMM d')}–${format(end, 'd, yyyy')}`
  }
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
}

function loadBookings() {
  try {
    const saved = window.localStorage.getItem('purkukalenteri-bookings')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Could not load saved bookings.', error)
    return []
  }
}

function App() {
  const [bookings, setBookings] = useState(loadBookings)
  const [editingBooking, setEditingBooking] = useState(null)
  const [isBookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    window.localStorage.setItem('purkukalenteri-bookings', JSON.stringify(bookings))
  }, [bookings])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [location.pathname])

  function openNewBooking(date = nextWeekdayDate(), time = TIME_SLOTS[0]) {
    setEditingBooking({ date, time })
    setBookingModalOpen(true)
  }

  function saveBooking(booking) {
    setBookings((current) => {
      const exists = current.some((item) => item.id === booking.id)
      return exists
        ? current.map((item) => (item.id === booking.id ? booking : item))
        : [...current, { ...booking, id: crypto.randomUUID() }]
    })
    setBookingModalOpen(false)
    setEditingBooking(null)
  }

  function deleteBooking(id) {
    setBookings((current) => current.filter((booking) => booking.id !== id))
  }

  return (
    <div className="app-shell">
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
            <span className="nav-count">{bookings.length}</span>
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

      {mobileNavOpen && <button className="mobile-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" />}

      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNavOpen((open) => !open)} aria-label="Toggle navigation">
            <Menu size={20} />
          </button>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{location.pathname === '/' ? 'Calendar' : location.pathname.slice(1)}</strong></div>
          <div className="topbar-right">
            <div className="today-label"><span className="status-dot" /> Operations active</div>
            <div className="topbar-date">{displayDate(new Date(), 'EEE, MMM d')}</div>
          </div>
        </header>

        <div className="page-content">
          <Routes>
            <Route
              path="/"
              element={<CalendarPage bookings={bookings} onCreate={openNewBooking} onView={setSelectedBooking} />}
            />
            <Route
              path="/bookings"
              element={<BookingsPage bookings={bookings} onCreate={() => openNewBooking()} onView={setSelectedBooking} onEdit={(item) => { setEditingBooking(item); setBookingModalOpen(true) }} onDelete={deleteBooking} />}
            />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="*" element={<CalendarPage bookings={bookings} onCreate={openNewBooking} onView={setSelectedBooking} />} />
          </Routes>
        </div>
      </main>

      {isBookingModalOpen && (
        <BookingModal
          booking={editingBooking}
          bookings={bookings}
          onClose={() => { setBookingModalOpen(false); setEditingBooking(null) }}
          onSave={saveBooking}
        />
      )}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onEdit={() => {
            setEditingBooking(selectedBooking)
            setSelectedBooking(null)
            setBookingModalOpen(true)
          }}
        />
      )}
    </div>
  )
}

function PageHeading({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  )
}

function CalendarPage({ bookings, onCreate, onView }) {
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()))
  const days = useMemo(() => Array.from({ length: 5 }, (_, index) => shiftDate(weekStart, index)), [weekStart])
  const today = localDate(new Date())
  const weekBookings = bookings.filter((booking) => days.some((day) => localDate(day) === booking.date))
  const todayCount = weekBookings.filter((booking) => booking.date === today).length

  function moveWeek(amount) {
    setWeekStart((current) => shiftDate(current, amount * 7))
  }

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

      <section className="calendar-panel">
        <div className="calendar-toolbar">
          <div className="calendar-title">
            <span className="calendar-title-mark"><CalendarDays size={17} /></span>
            <div><h2>Weekly schedule</h2><p>{weekLabel(days)}</p></div>
          </div>
          <div className="calendar-controls">
            <button className="btn btn-sm btn-light today-button" onClick={() => setWeekStart(mondayOf(new Date()))}>Today</button>
            <div className="week-arrows">
              <button className="icon-button" onClick={() => moveWeek(-1)} aria-label="Previous week"><ChevronLeft size={18} /></button>
              <button className="icon-button" onClick={() => moveWeek(1)} aria-label="Next week"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        <div className="calendar-scroll">
          <div className="calendar-grid">
            <div className="calendar-corner">LOCAL TIME</div>
            {days.map((day, index) => {
              const isToday = localDate(day) === today
              return (
                <div className={`day-heading ${isToday ? 'is-today' : ''}`} key={localDate(day)}>
                  <span>{WEEKDAYS[index]}</span>
                  <strong>{format(day, 'd')}</strong>
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
                    <div className="calendar-cell" key={`${date}-${time}`}>
                      {booking ? (
                        <button className={`booking-card ${booking.temperatureControlled ? 'booking-cold' : ''}`} onClick={() => onView(booking)} title={`View ${booking.referenceNumber}`}>
                          <span className="booking-card-top"><span className="booking-reference">{booking.referenceNumber}</span>{booking.temperatureControlled && <Snowflake size={13} />}</span>
                          <strong>{booking.truckRegistration}</strong>
                          <span className="booking-destination">{booking.destination}</span>
                        </button>
                      ) : (
                        <button className="slot-add" onClick={() => onCreate(date, time)} aria-label={`Add booking ${date} at ${time}`}><Plus size={15} /></button>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="calendar-legend"><span><i className="legend-dot legend-blue" /> Standard unloading</span><span><i className="legend-dot legend-cold" /> Temperature controlled</span><span className="legend-note">Click any slot to add a booking</span></div>
      </section>
      <div className="page-footnote"><span>All times shown in local time (EET)</span><span>6 unloading slots per day <span className="footnote-divider">·</span> Monday to Friday</span></div>
    </>
  )
}

function BookingsPage({ bookings, onCreate, onView, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const filteredBookings = useMemo(() => bookings
    .filter((booking) => {
      const search = query.trim().toLowerCase()
      return !search || [booking.referenceNumber, booking.truckRegistration, booking.cargoDescription, booking.destination]
        .some((value) => value.toLowerCase().includes(search))
    })
    .filter((booking) => filter === 'all' || (filter === 'cold' ? booking.temperatureControlled : booking.certificatesRequired))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [bookings, query, filter])

  function exportBookings() {
    const header = ['Reference', 'Date', 'Time', 'Truck registration', 'Cargo', 'Destination', 'Temperature controlled', 'Certificates required']
    const rows = filteredBookings.map((booking) => [
      booking.referenceNumber, booking.date, booking.time, booking.truckRegistration,
      booking.cargoDescription, booking.destination, booking.temperatureControlled ? 'Yes' : 'No',
      booking.certificatesRequired ? 'Yes' : 'No',
    ])
    const csv = [header, ...rows].map((row) => row.map((field) => `"${String(field).replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'purkukalenteri-bookings.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageHeading eyebrow="INCOMING DELIVERIES" title="Booking management" description="Review, update, and prepare for every scheduled delivery.">
        <button className="btn btn-light app-secondary-button" onClick={exportBookings}><Download size={16} /> Export CSV</button>
        <button className="btn btn-primary app-primary-button" onClick={onCreate}><Plus size={17} /> New booking</button>
      </PageHeading>

      <div className="booking-stats">
        <div><span>Total bookings</span><strong>{bookings.length}</strong></div>
        <div><span>Temperature controlled</span><strong>{bookings.filter((booking) => booking.temperatureControlled).length}</strong></div>
        <div><span>Certificates required</span><strong>{bookings.filter((booking) => booking.certificatesRequired).length}</strong></div>
      </div>

      <section className="management-panel">
        <div className="management-toolbar">
          <div><h2>All bookings <span className="count-pill">{filteredBookings.length}</span></h2><p>Your incoming delivery schedule</p></div>
          <div className="management-filters">
            <label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookings..." /></label>
            <select className="form-select filter-select" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter bookings">
              <option value="all">All bookings</option>
              <option value="cold">Temperature controlled</option>
              <option value="certificates">Certificates required</option>
            </select>
          </div>
        </div>
        {filteredBookings.length ? (
            <Table responsive className="booking-table align-middle mb-0">
              <thead><tr><th>REFERENCE</th><th>ARRIVAL</th><th>TRUCK</th><th>CARGO & DESTINATION</th><th>REQUIREMENTS</th><th><span className="visually-hidden">Actions</span></th></tr></thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td><button className="reference-button" onClick={() => onView(booking)}>{booking.referenceNumber}</button></td>
                    <td><strong className="arrival-date">{displayDate(parseISO(booking.date), 'MMM d, yyyy')}</strong><span className="table-subline">{booking.time}</span></td>
                    <td><span className="truck-cell"><span className="truck-icon"><Truck size={15} /></span><strong>{booking.truckRegistration}</strong></span></td>
                    <td><strong>{booking.cargoDescription}</strong><span className="table-subline">{booking.destination}</span></td>
                    <td><div className="requirement-tags">{booking.temperatureControlled && <span className="requirement-tag cold-tag"><Snowflake size={12} /> Cold</span>}{booking.certificatesRequired && <span className="requirement-tag certificate-tag">Certificates</span>}{!booking.temperatureControlled && !booking.certificatesRequired && <span className="no-requirements">None</span>}</div></td>
                    <td><div className="row-actions"><button className="icon-button" onClick={() => onEdit(booking)} aria-label={`Edit ${booking.referenceNumber}`}><span className="edit-glyph">✎</span></button><button className="icon-button delete-action" onClick={() => setDeleteTarget(booking)} aria-label={`Delete ${booking.referenceNumber}`}><X size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </Table>
        ) : (
          <div className="empty-state"><div className="empty-icon"><Truck size={22} /></div><h3>{query || filter !== 'all' ? 'No matching bookings' : 'Nothing scheduled yet'}</h3><p>{query || filter !== 'all' ? 'Try adjusting your search or filter.' : 'Add your first unloading appointment to get started.'}</p>{!query && filter === 'all' && <button className="btn btn-primary app-primary-button" onClick={onCreate}><Plus size={16} /> Create a booking</button>}</div>
        )}
        <div className="management-footer"><span>Showing {filteredBookings.length} of {bookings.length} bookings</span><span>Stored on this device</span></div>
      </section>

      {deleteTarget && (
        <div className="modal-backdrop-custom" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null) }}>
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="modal-heading"><div><div className="eyebrow">REMOVE APPOINTMENT</div><h2 id="delete-title">Delete this booking?</h2></div><button className="icon-button" onClick={() => setDeleteTarget(null)} aria-label="Close"><X size={18} /></button></div>
            <p className="confirm-copy">Booking <strong>{deleteTarget.referenceNumber}</strong> for {deleteTarget.truckRegistration} will be permanently removed.</p>
            <div className="modal-actions"><button className="btn btn-light app-secondary-button" onClick={() => setDeleteTarget(null)}>Cancel</button><button className="btn btn-danger" onClick={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}>Delete booking</button></div>
          </div>
        </div>
      )}
    </>
  )
}

function BookingModal({ booking, bookings, onClose, onSave }) {
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    referenceNumber: booking.referenceNumber || '',
    date: booking.date || localDate(new Date()),
    time: booking.time || TIME_SLOTS[0],
    truckRegistration: booking.truckRegistration || '',
    cargoDescription: booking.cargoDescription || '',
    destination: booking.destination || '',
    temperatureControlled: booking.temperatureControlled || false,
    certificatesRequired: booking.certificatesRequired || false,
  })
  const isEditing = Boolean(booking.id)

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (isWeekend(parseISO(form.date))) {
      setFormError('Choose a weekday (Monday to Friday) for this unloading appointment.')
      return
    }
    const slotTaken = bookings.some((item) =>
      item.id !== booking.id && item.date === form.date && item.time === form.time,
    )
    if (slotTaken) {
      setFormError('This time slot is already booked. Choose another available slot.')
      return
    }
    setFormError('')
    onSave({ ...form, id: booking.id })
  }

  return (
    <Modal show onHide={onClose} centered size="lg" scrollable className="booking-react-modal">
      <Modal.Header closeButton>
        <div>
          <div className="eyebrow">{isEditing ? 'UPDATE APPOINTMENT' : 'INCOMING DELIVERY'}</div>
          <Modal.Title as="h2">{isEditing ? 'Edit booking' : 'New booking'}</Modal.Title>
          <p className="modal-subtitle">Enter the delivery details and dock requirements.</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submit}>
          <div className="form-section-label">APPOINTMENT DETAILS</div>
          <Row className="g-3">
            <Col md={6}><Form.Group controlId="referenceNumber" className="form-field"><Form.Label>Reference number <b>*</b></Form.Label><Form.Control value={form.referenceNumber} onChange={(event) => update('referenceNumber', event.target.value)} placeholder="e.g. PO-2024-0842" required /></Form.Group></Col>
            <Col md={6}><Form.Group controlId="truckRegistration" className="form-field"><Form.Label>Truck registration <b>*</b></Form.Label><Form.Control value={form.truckRegistration} onChange={(event) => update('truckRegistration', event.target.value.toUpperCase())} placeholder="e.g. ABC-123" required /></Form.Group></Col>
            <Col md={6}><Form.Group controlId="arrivalDate" className="form-field"><Form.Label>Arrival date <b>*</b></Form.Label><Form.Control type="date" value={form.date} onChange={(event) => update('date', event.target.value)} required /></Form.Group></Col>
            <Col md={6}><Form.Group controlId="timeSlot" className="form-field"><Form.Label>Time slot <b>*</b></Form.Label><Form.Select value={form.time} onChange={(event) => update('time', event.target.value)} required>{TIME_SLOTS.map((time) => <option value={time} key={time}>{time}</option>)}</Form.Select></Form.Group></Col>
          </Row>

          <div className="form-section-label form-section-spaced">CARGO INFORMATION</div>
          <Row className="g-3">
            <Col md={6}><Form.Group controlId="cargoDescription" className="form-field"><Form.Label>Cargo description <b>*</b></Form.Label><Form.Control value={form.cargoDescription} onChange={(event) => update('cargoDescription', event.target.value)} placeholder="e.g. Fresh produce, 24 pallets" required /></Form.Group></Col>
            <Col md={6}><Form.Group controlId="destination" className="form-field"><Form.Label>Destination <b>*</b></Form.Label><Form.Control value={form.destination} onChange={(event) => update('destination', event.target.value)} placeholder="e.g. Warehouse A" required /></Form.Group></Col>
          </Row>

          <div className="form-section-label form-section-spaced">DOCK REQUIREMENTS</div>
          <div className="requirement-options">
            <label className={`requirement-option ${form.temperatureControlled ? 'selected' : ''}`}>
              <span className="option-icon cold-option"><Snowflake size={17} /></span><span className="option-copy"><strong>Temperature controlled</strong><small>Keep cargo within a set temperature range</small></span>
              <Form.Check.Input type="checkbox" checked={form.temperatureControlled} onChange={(event) => update('temperatureControlled', event.target.checked)} />
            </label>
            <label className={`requirement-option ${form.certificatesRequired ? 'selected' : ''}`}>
              <span className="option-icon certificate-option"><Check size={17} /></span><span className="option-copy"><strong>Certificates required</strong><small>Delivery needs supporting certificates</small></span>
              <Form.Check.Input type="checkbox" checked={form.certificatesRequired} onChange={(event) => update('certificatesRequired', event.target.checked)} />
            </label>
          </div>
          {formError && <Alert variant="danger" className="booking-form-error" role="alert">{formError}</Alert>}
          <div className="modal-actions"><Button type="button" variant="light" className="app-secondary-button" onClick={onClose}>Cancel</Button><Button type="submit" variant="primary" className="app-primary-button"><Check size={16} /> {isEditing ? 'Save changes' : 'Create booking'}</Button></div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

function BookingDetailsModal({ booking, onClose, onEdit }) {
  return (
    <Modal show onHide={onClose} centered className="booking-details-modal">
      <Modal.Header closeButton>
        <div>
          <div className="eyebrow">BOOKING DETAILS</div>
          <Modal.Title as="h2">{booking.referenceNumber}</Modal.Title>
          <p className="modal-subtitle">{format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')} at {booking.time}</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="details-grid">
          <div className="detail-item"><span>Truck registration</span><strong>{booking.truckRegistration}</strong></div>
          <div className="detail-item"><span>Destination</span><strong>{booking.destination}</strong></div>
          <div className="detail-item detail-wide"><span>Cargo description</span><strong>{booking.cargoDescription}</strong></div>
          <div className="detail-item"><span>Temperature controlled</span><strong>{booking.temperatureControlled ? 'Yes' : 'No'}</strong></div>
          <div className="detail-item"><span>Certificates required</span><strong>{booking.certificatesRequired ? 'Yes' : 'No'}</strong></div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" className="app-secondary-button" onClick={onClose}>Close</Button>
        <Button variant="primary" className="app-primary-button" onClick={onEdit}><span className="edit-glyph">✎</span> Edit booking</Button>
      </Modal.Footer>
    </Modal>
  )
}

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

function weatherDetails(code) {
  return WEATHER_CODES[code] || ['Conditions unavailable', Cloud]
}

function icingAssessment(weather, indices) {
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

function WeatherPage() {
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
      if (!data.current || !data.hourly?.time?.length) throw new Error('Weather service returned incomplete forecast data.')
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
  const forecastIndices = useMemo(() => {
    if (!weather?.hourly) return []
    const start = weather.hourly.time.findIndex((time) => time >= weather.current.time)
    if (start < 0) return []
    return Array.from({ length: Math.min(12, weather.hourly.time.length - start) }, (_, index) => start + index)
  }, [weather])
  const icing = weather && forecastIndices.length ? icingAssessment(weather, forecastIndices) : null

  return (
    <>
      <PageHeading eyebrow="DOCK PREPARATION" title="Weather conditions" description="Local forecasts help your team prepare for changing unloading conditions.">
        <div className="location-chip"><span className="location-dot" /> Kuopio, Finland <ChevronDown size={14} /></div>
      </PageHeading>

      {error ? (
        <Alert variant="danger" className="weather-error" role="alert"><div className="weather-error-icon"><Cloud size={19} /></div><div><strong>Forecast unavailable</strong><p>{error}</p></div><Button variant="light" className="app-secondary-button" onClick={fetchWeather}>Try again</Button></Alert>
      ) : (
        <>
          <section className="weather-hero">
            <div className="weather-hero-main">
              <div className="weather-live-label"><span className="weather-live-dot" /> CURRENT CONDITIONS <span>·</span> KUOPIO</div>
              {loading ? <div className="weather-loading"><span className="spinner-border spinner-border-sm" role="status" /> Loading latest conditions...</div> : (
                <>
                  <div className="current-weather"><div className="current-temperature">{Math.round(current.temperature_2m)}<span>°</span></div><div className="current-condition"><WeatherIcon size={34} strokeWidth={1.6} /><strong>{condition}</strong><span>Feels like {Math.round(current.apparent_temperature)}°</span></div></div>
                  <div className="weather-update">Updated {format(parseISO(current.time), 'HH:mm')} local time</div>
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
              <div><strong>{icing.title}</strong><p>{icing.message}</p><small>Estimate based on forecast temperature and precipitation; verify actual dock conditions.</small></div>
            </Alert>
          )}

          <section className="forecast-panel">
            <div className="forecast-heading"><div><div className="eyebrow">PLAN AHEAD</div><h2>Next 12 hours</h2><p>Hourly temperature and precipitation outlook for dock operations.</p></div><span className="forecast-source"><span className="status-dot" /> Live forecast <span>·</span> Open-Meteo</span></div>
            {loading ? <div className="forecast-skeleton"><span /><span /><span /><span /><span /><span /><span /></div> : (
              <div className="forecast-scroll">
                <div className="forecast-grid hourly-forecast-grid">
                  {forecastIndices.map((index) => {
                    const hour = weather.hourly.time[index]
                    const [label, Icon] = weatherDetails(weather.hourly.weather_code[index])
                    const hourDate = parseISO(hour)
                    return (
                      <div className={`forecast-day ${index === forecastIndices[0] ? 'forecast-today' : ''}`} key={hour}>
                        <span className="forecast-weekday">{format(hourDate, 'EEE')}</span>
                        <span className="forecast-date">{format(hourDate, 'HH:mm')}</span>
                        <Icon className="forecast-icon" size={26} strokeWidth={1.65} />
                        <span className="forecast-condition">{label}</span>
                        <span className="forecast-temps"><strong>{Math.round(weather.hourly.temperature_2m[index])}°</strong></span>
                        <span className="forecast-rain"><Droplets size={12} /> {weather.hourly.precipitation_probability[index] ?? 0}% <small>· {weather.hourly.precipitation[index] ?? 0} mm</small></span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
          <section className="weather-note"><div className="weather-note-icon"><Thermometer size={17} /></div><p><strong>Cold-chain reminder</strong> Compare outdoor conditions with shipment measurements and check temperature-controlled unloading areas. Forecasts are provided by Open-Meteo.</p><span>METRIC UNITS</span></section>
        </>
      )}
      <div className="page-footnote"><span>Weather data provided by Open-Meteo</span><button className="refresh-weather" onClick={fetchWeather} disabled={loading}><ArrowLeft size={13} /> Refresh forecast</button></div>
    </>
  )
}

export default App
