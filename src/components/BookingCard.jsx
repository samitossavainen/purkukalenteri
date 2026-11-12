import { Snowflake, Truck, X } from 'lucide-react'
import { parseISO } from 'date-fns'
import { displayDate } from '../utils/dates'

export default function BookingCard({ booking, onView, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <div className="booking-reference-cell">
          <button className="reference-button" onClick={() => onView(booking)}>{booking.referenceNumber}</button>
          {booking.cancelled && <span className="booking-status-cancelled">Cancelled</span>}
        </div>
      </td>
      <td>
        <strong className="arrival-date">{displayDate(parseISO(booking.date), 'MMM d, yyyy')}</strong>
        <span className="table-subline">{booking.time}</span>
      </td>
      <td>
        <span className="truck-cell">
          <span className="truck-icon"><Truck size={15} /></span>
          <strong>{booking.truckRegistration || 'Not provided'}</strong>
        </span>
      </td>
      <td>
        <strong>{booking.cargoDescription || 'Not provided'}</strong>
        <span className="table-subline">{booking.destination}</span>
      </td>
      <td>
        <div className="requirement-tags">
          {booking.temperatureControlled && <span className="requirement-tag cold-tag"><Snowflake size={12} /> Temp range check</span>}
          {booking.certificatesRequired && <span className="requirement-tag certificate-tag">CoA check</span>}
          {!booking.temperatureControlled && !booking.certificatesRequired && <span className="no-requirements">No checks</span>}
        </div>
      </td>
      <td>
        <div className="row-actions">
          <button className="icon-button" onClick={() => onEdit(booking)} aria-label={`Edit ${booking.referenceNumber}`}>
            <span className="edit-glyph">✎</span>
          </button>
          <button className="icon-button delete-action" onClick={() => onDelete(booking)} aria-label={`Delete ${booking.referenceNumber}`}>
            <X size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}
