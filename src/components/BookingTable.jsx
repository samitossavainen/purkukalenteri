import { Table } from 'react-bootstrap'
import BookingCard from './BookingCard'

export default function BookingTable({ bookings, onView, onEdit, onDelete }) {
  return (
    <Table responsive className="booking-table align-middle mb-0">
      <thead>
        <tr>
          <th>REFERENCE</th>
          <th>ARRIVAL</th>
          <th>TRUCK PLATE</th>
          <th>CARGO & DESTINATION</th>
          <th>QUALITY CONTROL</th>
          <th><span className="visually-hidden">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </Table>
  )
}
