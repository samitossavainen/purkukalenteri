import { Plus, Snowflake } from 'lucide-react'

export default function TimeSlotCard({ date, time, booking, onCreate, onView }) {
  return (
    <div className="calendar-cell">
      {booking ? (
        <button
          className={`booking-card ${booking.temperatureControlled ? 'booking-cold' : ''}`}
          onClick={() => onView(booking)}
          title={`View ${booking.referenceNumber}`}
        >
          <span className="booking-card-top">
            <span className="booking-reference">{booking.referenceNumber}</span>
            {booking.temperatureControlled && <Snowflake size={13} />}
          </span>
          <strong>{booking.truckRegistration}</strong>
          <span className="booking-destination">{booking.destination}</span>
        </button>
      ) : (
        <button className="slot-add" onClick={() => onCreate(date, time)} aria-label={`Add booking ${date} at ${time}`}>
          <Plus size={15} />
        </button>
      )}
    </div>
  )
}
