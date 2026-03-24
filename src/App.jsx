import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import ServiceIntakePage from './pages/ServiceIntakePage'
import InspectionReportsPage from './pages/InspectionReportsPage'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<ServiceIntakePage />} />
        <Route path="/reports" element={<InspectionReportsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}