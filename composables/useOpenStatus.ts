import type { Station } from '~/types/station'

export function useOpenStatus(station: Pick<Station, 'hours'>, now = new Date()) {
  const [openHour, openMinute] = station.hours.open.split(':').map(Number)
  const [closeHour, closeMinute] = station.hours.close.split(':').map(Number)
  const current = now.getHours() * 60 + now.getMinutes()
  const opens = openHour * 60 + openMinute
  const closes = closeHour * 60 + closeMinute
  const isOpen = station.hours.days.includes((now.getDay() + 6) % 7) && (closes < opens ? current >= opens || current < closes : current >= opens && current < closes)
  return { isOpen, label: isOpen ? 'Открыто' : 'Закрыто' }
}
