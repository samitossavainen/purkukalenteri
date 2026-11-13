import { useMemo, useState } from 'react'
import { Download, Plus, Truck, X } from 'lucide-react'
import BookingTable from '../components/BookingTable'
import PageHeading from '../components/PageHeading'
import SearchBar from '../components/SearchBar'

function csvField(value) {
  const text = String(value ?? '')
  const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text
  return `"${safeText.replaceAll('"', '""')}"`
}

export default function BookingsPage({ bookings, onCreate, onView, onEdit, onDelete }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const filteredBookings = useMemo(() => bookings
    .filter((booking) => {
      const search = query.trim().toLowerCase()
      return !search || [booking.referenceNumber, booking.truckRegistration, booking.cargoDescription, booking.destination, booking.notes]
        .some((value) => value.toLowerCase().includes(search))
    })
    .filter((booking) => {
      if (filter === 'cancelled') return booking.cancelled === true
      if (filter === 'cold') return booking.temperatureControlled
      if (filter === 'certificates') return booking.certificatesRequired
      return true
    })
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [bookings, query, filter])

  function exportBookings() {
    const header = ['Reference', 'Date', 'Time', 'Truck plate number', 'Cargo', 'Destination', 'Notes', 'Temperature range check', 'Check for CoA', 'Status']
    const rows = filteredBookings.map((booking) => [
      booking.referenceNumber, booking.date, booking.time, booking.truckRegistration,
      booking.cargoDescription, booking.destination, booking.notes, booking.temperatureControlled ? 'Yes' : 'No',
      booking.certificatesRequired ? 'Yes' : 'No', booking.cancelled ? 'Cancelled' : 'Scheduled',
    ])
    const csv = [header, ...rows].map((row) => row.map(csvField).join(',')).join('\n')
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
        <button className="btn btn-primary app-primary-button" onClick={() => onCreate()}><Plus size={17} /> New booking</button>
      </PageHeading>

      <div className="booking-stats">
        <div><span>Total bookings</span><strong>{bookings.length}</strong></div>
        <div><span>Temperature range checks</span><strong>{bookings.filter((booking) => booking.temperatureControlled).length}</strong></div>
        <div><span>CoA checks</span><strong>{bookings.filter((booking) => booking.certificatesRequired).length}</strong></div>
      </div>

      <section className="management-panel">
        <div className="management-toolbar">
          <div><h2>All bookings <span className="count-pill">{filteredBookings.length}</span></h2><p>Your incoming delivery schedule</p></div>
          <SearchBar query={query} onQueryChange={setQuery} filter={filter} onFilterChange={setFilter} />
        </div>
        {filteredBookings.length ? (
          <BookingTable bookings={filteredBookings} onView={onView} onEdit={onEdit} onDelete={setDeleteTarget} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><Truck size={22} /></div>
            <h3>{query || filter !== 'all' ? 'No matching bookings' : 'Nothing scheduled yet'}</h3>
            <p>{query || filter !== 'all' ? 'Try adjusting your search or filter.' : 'Add your first unloading appointment to get started.'}</p>
            {!query && filter === 'all' && <button className="btn btn-primary app-primary-button" onClick={() => onCreate()}><Plus size={16} /> Create a booking</button>}
          </div>
        )}
        <div className="management-footer"><span>Showing {filteredBookings.length} of {bookings.length} bookings</span><span>Stored on this device</span></div>
      </section>

      {deleteTarget && (
        <div className="modal-backdrop-custom" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleteTarget(null) }}>
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title">
            <div className="modal-heading">
              <div><div className="eyebrow">REMOVE APPOINTMENT</div><h2 id="delete-title">Delete this booking?</h2></div>
              <button className="icon-button" onClick={() => setDeleteTarget(null)} aria-label="Close"><X size={18} /></button>
            </div>
            <p className="confirm-copy">Booking <strong>{deleteTarget.referenceNumber}</strong> will be permanently removed.</p>
            <div className="modal-actions">
              <button className="btn btn-light app-secondary-button" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}>Delete booking</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
