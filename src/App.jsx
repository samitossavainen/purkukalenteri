import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { parseISO } from 'date-fns'
import BookingDetailsModal from './components/BookingDetailsModal'
import BookingModal from './components/BookingModal'
import NavigationBar from './components/NavigationBar'
import BookingsPage from './pages/BookingsPage'
import CalendarPage from './pages/CalendarPage'
import WeatherPage from './pages/WeatherPage'
import { loadBookings, TIME_SLOTS } from './utils/bookings'
import { isPastSlot, nextWeekdayDate, shiftDate } from './utils/dates'

export default function App() {
  const [initialStorage] = useState(() => {
    try {
      return { bookings: loadBookings(), error: '' }
    } catch (error) {
      console.error('Could not load saved bookings.', error)
      return {
        bookings: [],
        error: 'Saved bookings could not be loaded. The stored data was left unchanged; repair it before continuing.',
      }
    }
  })
  const [bookings, setBookings] = useState(initialStorage.bookings)
  const [storageError, setStorageError] = useState(initialStorage.error)
  const [editingBooking, setEditingBooking] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    if (initialStorage.error) return
    try {
      window.localStorage.setItem('purkukalenteri-bookings', JSON.stringify(bookings))
      setStorageError('')
    } catch (error) {
      console.error('Could not save bookings.', error)
      setStorageError('Bookings could not be saved in this browser. Changes may be lost when you close the page.')
    }
  }, [bookings, initialStorage.error])

  function openNewBooking(date, time) {
    let bookingDate = date || nextWeekdayDate()
    let bookingTime = time

    if (!bookingTime) {
      bookingTime = TIME_SLOTS.find((slot) => !isPastSlot(bookingDate, slot))
      if (!bookingTime) {
        bookingDate = nextWeekdayDate(shiftDate(parseISO(bookingDate), 1))
        bookingTime = TIME_SLOTS[0]
      }
    }

    setEditingBooking({ date: bookingDate, time: bookingTime })
  }

  function saveBooking(booking) {
    setBookings((current) => {
      const exists = current.some((item) => item.id === booking.id)
      return exists
        ? current.map((item) => (item.id === booking.id ? { ...item, ...booking } : item))
        : [...current, { ...booking, id: crypto.randomUUID() }]
    })
    setEditingBooking(null)
  }

  function editBooking(booking) {
    setSelectedBooking(null)
    setEditingBooking(booking)
  }

  function deleteBooking(id) {
    setBookings((current) => current.filter((booking) => booking.id !== id))
  }

  function cancelBooking(id) {
    setBookings((current) => current.map((booking) =>
      booking.id === id ? { ...booking, cancelled: true } : booking,
    ))
    setSelectedBooking(null)
  }

  return (
    <div className="app-shell">
      <NavigationBar bookingCount={bookings.length} storageError={storageError}>
        <Routes>
          <Route
            path="/"
            element={<CalendarPage bookings={bookings} onCreate={openNewBooking} onView={setSelectedBooking} />}
          />
          <Route
            path="/bookings"
            element={<BookingsPage bookings={bookings} onCreate={openNewBooking} onView={setSelectedBooking} onEdit={setEditingBooking} onDelete={deleteBooking} />}
          />
          <Route path="/weather" element={<WeatherPage />} />
          <Route
            path="*"
            element={<CalendarPage bookings={bookings} onCreate={openNewBooking} onView={setSelectedBooking} />}
          />
        </Routes>
      </NavigationBar>

      {editingBooking && (
        <BookingModal
          booking={editingBooking}
          bookings={bookings}
          onClose={() => setEditingBooking(null)}
          onSave={saveBooking}
        />
      )}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onEdit={() => editBooking(selectedBooking)}
          onCancel={() => cancelBooking(selectedBooking.id)}
        />
      )}
    </div>
  )
}
