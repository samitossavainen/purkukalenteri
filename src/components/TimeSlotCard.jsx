import { Plus, Snowflake } from 'lucide-react'
import { isPastSlot } from '../utils/dates'

export default function TimeSlotCard({ date, time, booking, onCreate, onView }) {
  const past = isPastSlot(date, time)

  return (
    <div className="calendar-cell">
      {booking ? (
        <button
          className={`booking-card ${booking.temperatureControlled ? 'booking-cold' : ''}`}
          onClick={() => onView(booking)}
          title={`View ${booking.referenceNumber}${booking.notes ? `: ${booking.notes}` : ''}`}
        >
          <span className="booking-card-top">
            <span className="booking-reference">{booking.referenceNumber}</span>
            {booking.temperatureControlled && <Snowflake size={13} />}
          </span>
          <strong>{booking.truckRegistration || 'Plate not provided'}</strong>
          <span className="booking-destination">{booking.destination || 'Not provided'}</span>
          {booking.notes?.trim() && <span className="booking-notes">{booking.notes}</span>}
        </button>
      ) : (
        <button
          className="slot-add"
          onClick={() => onCreate(date, time)}
          disabled={past}
          aria-label={past ? `Past slot ${date} at ${time}` : `Add booking ${date} at ${time}`}
          title={past ? 'This unloading time has passed' : undefined}
        >
          {past ? 'Past' : <Plus size={15} />}
        </button>
      )}
    </div>
  )
}
