import { Button, Modal } from 'react-bootstrap'
import { format, parseISO } from 'date-fns'

export default function BookingDetailsModal({ booking, onClose, onEdit, onCancel }) {
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
        {booking.cancelled && (
          <div className="booking-cancelled-notice" role="status">
            This reservation was cancelled. Its time slot is available for a new booking.
          </div>
        )}
        <div className="details-grid">
          <div className="detail-item"><span>Truck plate number</span><strong>{booking.truckRegistration || 'Not provided'}</strong></div>
          <div className="detail-item"><span>Destination</span><strong>{booking.destination || 'Not provided'}</strong></div>
          <div className="detail-item detail-wide"><span>Cargo description</span><strong>{booking.cargoDescription || 'Not provided'}</strong></div>
          {booking.notes?.trim() && <div className="detail-item detail-wide"><span>Additional information / notes</span><strong>{booking.notes}</strong></div>}
          <div className="detail-item"><span>Temperature range check</span><strong>{booking.temperatureControlled ? 'Yes' : 'No'}</strong></div>
          <div className="detail-item"><span>Check for CoA</span><strong>{booking.certificatesRequired ? 'Yes' : 'No'}</strong></div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" className="app-secondary-button" onClick={onClose}>Close</Button>
        {!booking.cancelled && <Button variant="outline-danger" onClick={onCancel}>Cancel reservation</Button>}
        <Button variant="primary" className="app-primary-button" onClick={onEdit}>
          <span className="edit-glyph">✎</span> Edit booking
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
