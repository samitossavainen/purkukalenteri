import { addDays as addDateDays, format, isSameMonth, startOfWeek } from 'date-fns'

export function localDate(date) {
  return format(date, 'yyyy-MM-dd')
}

export function shiftDate(date, days) {
  return addDateDays(date, days)
}

export function nextWeekdayDate(date = new Date()) {
  const day = date.getDay()
  return localDate(day === 6 ? shiftDate(date, 2) : day === 0 ? shiftDate(date, 1) : date)
}

export function mondayOf(date) {
  return startOfWeek(date, { weekStartsOn: 1 })
}

export function displayDate(date, pattern = 'MMM d') {
  return format(date, pattern)
}

export function weekLabel(days) {
  const start = days[0]
  const end = days[4]
  if (isSameMonth(start, end)) {
    return `${format(start, 'MMMM d')}–${format(end, 'd, yyyy')}`
  }
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`
}
