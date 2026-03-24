const INTAKES_KEY = 'ttx:intakes'
const REPORTS_KEY = 'ttx:inspectionReports'

function readJson(key) {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeJson(key, value) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export function saveIntakeRecord(intake) {
  const existing = readJson(INTAKES_KEY)
  const updated = [intake, ...existing].slice(0, 100)
  writeJson(INTAKES_KEY, updated)
}
export function deleteInspectionReport(reportId) {
  const existing = readJson(REPORTS_KEY)
  const updated = existing.filter((item) => item.reportId !== reportId)
  writeJson(REPORTS_KEY, updated)
}
export function getIntakeRecords() {
  return readJson(INTAKES_KEY)
}

export function saveInspectionReport(report) {
  const existing = readJson(REPORTS_KEY)
  const updated = [report, ...existing].slice(0, 100)
  writeJson(REPORTS_KEY, updated)
}

export function getInspectionReports() {
  return readJson(REPORTS_KEY)
}

export function getInspectionStats() {
  const reports = getInspectionReports()

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const thisMonthReports = reports.filter((item) => {
    const date = new Date(item.generatedAtISO || item.generatedAt)
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    )
  }).length

  const quickServiceReports = reports.filter(
    (item) => item.sourceJobType === 'Quick Service'
  ).length

  const generalServiceReports = reports.filter(
    (item) => item.sourceJobType === 'General Service'
  ).length

  return {
    totalReports: reports.length,
    thisMonthReports,
    quickServiceReports,
    generalServiceReports,
    lastGeneratedAt: reports[0]?.generatedAt || 'No reports yet',
  }
}