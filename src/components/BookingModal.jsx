import { useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { Check, Snowflake } from 'lucide-react'
import { isWeekend, parseISO } from 'date-fns'
import { TIME_SLOTS } from '../utils/bookings'
import { localDate } from '../utils/dates'

export default function BookingModal({ booking, bookings, onClose, onSave }) {
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
            <Col md={6}>
              <Form.Group controlId="referenceNumber" className="form-field">
                <Form.Label>Reference number <b>*</b></Form.Label>
                <Form.Control value={form.referenceNumber} onChange={(event) => update('referenceNumber', event.target.value)} placeholder="e.g. PO-2024-0842" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="truckRegistration" className="form-field">
                <Form.Label>Truck registration <b>*</b></Form.Label>
                <Form.Control value={form.truckRegistration} onChange={(event) => update('truckRegistration', event.target.value.toUpperCase())} placeholder="e.g. ABC-123" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="arrivalDate" className="form-field">
                <Form.Label>Arrival date <b>*</b></Form.Label>
                <Form.Control type="date" value={form.date} onChange={(event) => update('date', event.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="timeSlot" className="form-field">
                <Form.Label>Time slot <b>*</b></Form.Label>
                <Form.Select value={form.time} onChange={(event) => update('time', event.target.value)} required>
                  {TIME_SLOTS.map((time) => <option value={time} key={time}>{time}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="form-section-label form-section-spaced">CARGO INFORMATION</div>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="cargoDescription" className="form-field">
                <Form.Label>Cargo description <b>*</b></Form.Label>
                <Form.Control value={form.cargoDescription} onChange={(event) => update('cargoDescription', event.target.value)} placeholder="e.g. Fresh produce, 24 pallets" required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="destination" className="form-field">
                <Form.Label>Destination <b>*</b></Form.Label>
                <Form.Control value={form.destination} onChange={(event) => update('destination', event.target.value)} placeholder="e.g. Warehouse A" required />
              </Form.Group>
            </Col>
          </Row>

          <div className="form-section-label form-section-spaced">DOCK REQUIREMENTS</div>
          <div className="requirement-options">
            <label className={`requirement-option ${form.temperatureControlled ? 'selected' : ''}`}>
              <span className="option-icon cold-option"><Snowflake size={17} /></span>
              <span className="option-copy"><strong>Temperature controlled</strong><small>Keep cargo within a set temperature range</small></span>
              <Form.Check.Input type="checkbox" checked={form.temperatureControlled} onChange={(event) => update('temperatureControlled', event.target.checked)} />
            </label>
            <label className={`requirement-option ${form.certificatesRequired ? 'selected' : ''}`}>
              <span className="option-icon certificate-option"><Check size={17} /></span>
              <span className="option-copy"><strong>Certificates required</strong><small>Delivery needs supporting certificates</small></span>
              <Form.Check.Input type="checkbox" checked={form.certificatesRequired} onChange={(event) => update('certificatesRequired', event.target.checked)} />
            </label>
          </div>
          {formError && <Alert variant="danger" className="booking-form-error" role="alert">{formError}</Alert>}
          <div className="modal-actions">
            <Button type="button" variant="light" className="app-secondary-button" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" className="app-primary-button">
              <Check size={16} /> {isEditing ? 'Save changes' : 'Create booking'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
