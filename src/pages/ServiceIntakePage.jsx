import { useState } from 'react'
import ServiceIntakeForm from '../components/Form/ServiceIntakeForm'
import ReportPreview from '../components/report/ReportPreview'

export default function ServiceIntakePage() {
  const [submittedData, setSubmittedData] = useState(null)

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <ServiceIntakeForm onSubmitSuccess={setSubmittedData} />
      <ReportPreview submittedData={submittedData} />
    </div>
  )
}