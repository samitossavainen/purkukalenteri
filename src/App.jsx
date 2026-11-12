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
  const [bookings, setBookings] = useState(loadBookings)
  const [editingBooking, setEditingBooking] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)

  useEffect(() => {
    window.localStorage.setItem('purkukalenteri-bookings', JSON.stringify(bookings))
  }, [bookings])

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
        ? current.map((item) => (item.id === booking.id ? booking : item))
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

  return (
    <div className="app-shell">
      <NavigationBar bookingCount={bookings.length}>
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
        />
      )}
    </div>
  )
}
