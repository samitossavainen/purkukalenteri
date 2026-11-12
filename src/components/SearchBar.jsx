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
          aria-label="Search by reference, truck, cargo, or destination"
        />
      </label>
      <select
        className="form-select filter-select"
        value={filter}
        onChange={(event) => onFilterChange(event.target.value)}
        aria-label="Filter bookings"
      >
        <option value="all">All bookings</option>
        <option value="cold">Temperature controlled</option>
        <option value="certificates">Certificates required</option>
      </select>
    </div>
  )
}
