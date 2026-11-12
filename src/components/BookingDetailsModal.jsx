import { Button, Modal } from 'react-bootstrap'
import { format, parseISO } from 'date-fns'

export default function BookingDetailsModal({ booking, onClose, onEdit }) {
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
        <Button variant="primary" className="app-primary-button" onClick={onEdit}>
          <span className="edit-glyph">✎</span> Edit booking
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
