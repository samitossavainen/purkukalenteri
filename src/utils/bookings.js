import { isValid, parseISO } from 'date-fns'

export const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

function isStoredBooking(booking) {
  if (!booking || typeof booking !== 'object' || Array.isArray(booking)) return false

  const optionalStrings = ['referenceNumber', 'truckRegistration', 'cargoDescription', 'destination', 'notes']
  const optionalBooleans = ['temperatureControlled', 'certificatesRequired', 'cancelled']

  return typeof booking.id === 'string'
    && booking.id.length > 0
    && typeof booking.date === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(booking.date)
    && isValid(parseISO(booking.date))
    && TIME_SLOTS.includes(booking.time)
    && optionalStrings.every((field) => booking[field] === undefined || typeof booking[field] === 'string')
    && optionalBooleans.every((field) => booking[field] === undefined || typeof booking[field] === 'boolean')
}

export function loadBookings() {
  const saved = window.localStorage.getItem('purkukalenteri-bookings')
  if (!saved) return []

  const bookings = JSON.parse(saved)
  if (!Array.isArray(bookings) || !bookings.every(isStoredBooking)) {
    throw new Error('Saved booking data has an invalid format.')
  }

  return bookings.map((booking) => ({
    ...booking,
    referenceNumber: booking.referenceNumber || '',
    truckRegistration: booking.truckRegistration || '',
    cargoDescription: booking.cargoDescription || '',
    destination: booking.destination ?? 'Tehdas',
    notes: booking.notes || '',
    temperatureControlled: booking.temperatureControlled || false,
    certificatesRequired: booking.certificatesRequired || false,
    cancelled: booking.cancelled || false,
  }))
}
