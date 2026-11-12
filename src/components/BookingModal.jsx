import { useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { Check, Snowflake } from 'lucide-react'
import { format, isWeekend, parseISO } from 'date-fns'
import { TIME_SLOTS } from '../utils/bookings'
import { isPastSlot, localDate } from '../utils/dates'

export default function BookingModal({ booking, bookings, onClose, onSave }) {
  const [formError, setFormError] = useState('')
  const [pendingGeneratedReference, setPendingGeneratedReference] = useState('')
  const [form, setForm] = useState({
    referenceNumber: booking.referenceNumber || '',
    date: booking.date || localDate(new Date()),
    time: booking.time || TIME_SLOTS[0],
    truckRegistration: booking.truckRegistration || '',
    cargoDescription: booking.cargoDescription || '',
    destination: booking.destination || 'Tehdas',
    temperatureControlled: booking.temperatureControlled || false,
    certificatesRequired: booking.certificatesRequired || false,
  })
  const isEditing = Boolean(booking.id)
  const today = localDate(new Date())
  const minimumDate = isEditing && booking.date < today ? booking.date : today

  function update(field, value) {
    setFormError('')
    setPendingGeneratedReference('')
    setForm((current) => ({ ...current, [field]: value }))
  }

  function isSlotValid() {
    const unchangedPastSlot = isEditing && booking.date === form.date && booking.time === form.time
    if (isPastSlot(form.date, form.time) && !unchangedPastSlot) {
      setFormError('Choose an unloading time that has not passed.')
      return false
    }
    if (isWeekend(parseISO(form.date))) {
      setFormError('Choose a weekday (Monday to Friday) for this unloading appointment.')
      return false
    }
    const slotTaken = bookings.some((item) =>
      !item.cancelled && item.id !== booking.id && item.date === form.date && item.time === form.time,
    )
    if (slotTaken) {
      setFormError('This time slot is already booked. Choose another available slot.')
      return false
    }
    setFormError('')
    return true
  }

  function isReferenceUnique(referenceNumber) {
    const normalizedReference = referenceNumber.trim().toLowerCase()
    return !bookings.some((item) =>
      item.id !== booking.id && (item.referenceNumber || '').trim().toLowerCase() === normalizedReference,
    )
  }

  function saveBooking(referenceNumber) {
    if (!isSlotValid()) return
    if (!isReferenceUnique(referenceNumber)) {
      setPendingGeneratedReference('')
      setFormError('Reference number must be unique. Enter a different reference number.')
      return
    }
    setPendingGeneratedReference('')
    onSave({ ...form, referenceNumber: referenceNumber.trim(), id: booking.id })
  }

  function submit(event) {
    event.preventDefault()
    if (!isSlotValid()) return
    setPendingGeneratedReference('')
    const referenceNumber = form.referenceNumber.trim()
    if (referenceNumber) {
      saveBooking(referenceNumber)
      return
    }

    const generatedReference = `${format(parseISO(form.date), 'yyyyMMdd')}${form.time.replace(':', '')}`
    if (!isReferenceUnique(generatedReference)) {
      setFormError(`Generated reference ${generatedReference} is already in use. Enter a different reference number.`)
      return
    }
    setPendingGeneratedReference(generatedReference)
  }

  return (
    <Modal show onHide={onClose} centered size="lg" scrollable className="booking-react-modal">
      <Modal.Header closeButton>
        <div>
          <div className="eyebrow">{isEditing ? 'UPDATE APPOINTMENT' : 'INCOMING DELIVERY'}</div>
          <Modal.Title as="h2">{isEditing ? 'Edit booking' : 'New booking'}</Modal.Title>
          <p className="modal-subtitle">Enter the delivery details and quality-control checks.</p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submit}>
          <div className="form-section-label">APPOINTMENT DETAILS</div>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="referenceNumber" className="form-field">
                <Form.Label>Reference number</Form.Label>
                <Form.Control value={form.referenceNumber} onChange={(event) => update('referenceNumber', event.target.value)} placeholder="Optional" />
                <Form.Text>Leave blank to generate a number from the selected date and time.</Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="truckRegistration" className="form-field">
                <Form.Label>Truck plate number</Form.Label>
                <Form.Control value={form.truckRegistration} onChange={(event) => update('truckRegistration', event.target.value.toUpperCase())} placeholder="e.g. ABC-123" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="arrivalDate" className="form-field">
                <Form.Label>Arrival date <b>*</b></Form.Label>
                <Form.Control type="date" min={minimumDate} value={form.date} onChange={(event) => update('date', event.target.value)} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="timeSlot" className="form-field">
                <Form.Label>Time slot <b>*</b></Form.Label>
                <Form.Select value={form.time} onChange={(event) => update('time', event.target.value)} required>
                  {TIME_SLOTS.map((time) => (
                    <option
                      value={time}
                      key={time}
                      disabled={isPastSlot(form.date, time) && !(isEditing && booking.date === form.date && booking.time === time)}
                    >
                      {time}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <div className="form-section-label form-section-spaced">CARGO INFORMATION</div>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="cargoDescription" className="form-field">
                <Form.Label>Cargo description</Form.Label>
                <Form.Control value={form.cargoDescription} onChange={(event) => update('cargoDescription', event.target.value)} placeholder="e.g. Fresh produce, 24 pallets" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="destination" className="form-field">
                <Form.Label>Destination</Form.Label>
                <Form.Control value={form.destination} onChange={(event) => update('destination', event.target.value)} placeholder="e.g. Warehouse A" />
              </Form.Group>
            </Col>
          </Row>

          <div className="form-section-label form-section-spaced">QUALITY CONTROL</div>
          <div className="requirement-options">
            <label className={`requirement-option ${form.temperatureControlled ? 'selected' : ''}`}>
              <span className="option-icon cold-option"><Snowflake size={17} /></span>
              <span className="option-copy"><strong>Check temperature range</strong><small>Verify goods are within their specified temperature range</small></span>
              <Form.Check.Input type="checkbox" checked={form.temperatureControlled} onChange={(event) => update('temperatureControlled', event.target.checked)} />
            </label>
            <label className={`requirement-option ${form.certificatesRequired ? 'selected' : ''}`}>
              <span className="option-icon certificate-option"><Check size={17} /></span>
              <span className="option-copy"><strong>Check for CoA</strong><small>Check the certificate of analysis when applicable</small></span>
              <Form.Check.Input type="checkbox" checked={form.certificatesRequired} onChange={(event) => update('certificatesRequired', event.target.checked)} />
            </label>
          </div>
          {formError && <Alert variant="danger" className="booking-form-error" role="alert">{formError}</Alert>}
          {pendingGeneratedReference && (
            <Alert variant="info" className="booking-reference-prompt" role="alert">
              <span>Reference number is empty. Generate <strong>{pendingGeneratedReference}</strong> from this slot?</span>
              <div>
                <Button type="button" variant="primary" className="app-primary-button" onClick={() => saveBooking(pendingGeneratedReference)}>
                  Generate and create booking
                </Button>
                <Button type="button" variant="light" className="app-secondary-button" onClick={() => setPendingGeneratedReference('')}>
                  Cancel
                </Button>
              </div>
            </Alert>
          )}
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
