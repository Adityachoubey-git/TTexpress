import { Link } from 'react-router-dom'

function DetailRow({ label, value }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 border-b border-gray-100 py-2 text-sm">
      <span className="font-semibold text-[var(--color-brand-dark)]">{label}</span>
      <span className="text-gray-700">{value || '—'}</span>
    </div>
  )
}

export default function ReportPreview({ submittedData }) {
  return (
    <aside className="card overflow-hidden">
      <div className="report-strip px-5 py-4 sm:px-6">
        <h2 className="text-lg font-bold">Generated Intake Report</h2>
        <p className="mt-1 text-sm text-white/70">
          Intake summary appears here after submission
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {!submittedData ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-sm text-[var(--color-text-muted)]">
            No submission yet. Submit the intake form to generate the initial intake report.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl bg-[var(--color-bg-soft)] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[var(--color-brand-dark)]">
                    {submittedData.intakeId}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Generated on {submittedData.submittedAt}
                  </p>
                </div>
                <span className="badge badge-red">{submittedData.jobType}</span>
              </div>

              <DetailRow label="Vehicle Number" value={submittedData.vehicleNumber} />
              <DetailRow label="Company Name" value={submittedData.companyName} />
              <DetailRow label="Fleet Owner" value={submittedData.fleetOwnerName} />
              <DetailRow label="Contact" value={submittedData.fleetOwnerContact} />
              <DetailRow label="Email" value={submittedData.fleetOwnerEmail} />
              <DetailRow label="Issue" value={submittedData.issueDescription} />
              <DetailRow label="Priority" value={submittedData.servicePriority} />
              <DetailRow label="Recommended Bay" value={submittedData.recommendedBay} />
              <DetailRow label="Category" value={submittedData.intakeCategory} />
            </div>

            <Link to="/reports" className="btn-secondary block w-full text-center">
              Continue to Inspection Report Page
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}