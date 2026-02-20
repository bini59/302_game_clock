export function formatTime(date: Date): { hours: string; minutes: string; seconds: string } {
  return {
    hours: String(date.getHours()).padStart(2, '0'),
    minutes: String(date.getMinutes()).padStart(2, '0'),
    seconds: String(date.getSeconds()).padStart(2, '0'),
  }
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDayOfWeek(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return days[date.getDay()] ?? ''
}

export function getDateString(): string {
  return formatDate(new Date())
}

export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const d1 = new Date(timestamp1)
  const d2 = new Date(timestamp2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export function getDaysSince(timestamp: number): number {
  const now = Date.now()
  const diffMs = now - timestamp
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

export function formatRemainingTime(targetTimestamp: number): string {
  const remaining = targetTimestamp - Date.now()
  if (remaining <= 0) return ''
  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}시간 ${minutes}분 남음`
}
