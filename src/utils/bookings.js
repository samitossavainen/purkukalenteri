export const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export function loadBookings() {
  try {
    const saved = window.localStorage.getItem('purkukalenteri-bookings')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Could not load saved bookings.', error)
    return []
  }
}
