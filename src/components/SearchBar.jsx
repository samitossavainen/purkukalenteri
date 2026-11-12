import { Search } from 'lucide-react'

export default function SearchBar({ query, onQueryChange, filter, onFilterChange }) {
  return (
    <div className="management-filters">
      <label className="search-field">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search bookings..."
          aria-label="Search by reference, truck plate number, cargo, or destination"
        />
      </label>
      <select
        className="form-select filter-select"
        value={filter}
        onChange={(event) => onFilterChange(event.target.value)}
        aria-label="Filter bookings"
      >
        <option value="all">All bookings</option>
        <option value="cold">Temperature range check</option>
        <option value="certificates">Check for CoA</option>
        <option value="cancelled">Cancelled reservations</option>
      </select>
    </div>
  )
}
