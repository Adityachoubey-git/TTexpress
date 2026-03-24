export function generateIntakeId() {
  const now = new Date()

  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')

  const random = Math.floor(100 + Math.random() * 900)

  return `TTX-${yyyy}${mm}${dd}-${random}`
}