import clsx from 'clsx'

function getServiceStatus(overallCondition) {
  if (overallCondition === 'Good') {
    return {
      label: 'Serviceable',
      tone: 'success',
      note: 'Vehicle is in good running condition with routine maintenance needs.',
    }
  }

  if (overallCondition === 'Fair') {
    return {
      label: 'Needs Attention',
      tone: 'warning',
      note: 'Vehicle is operational but requires corrective action on identified points.',
    }
  }

  return {
    label: 'Immediate Repair',
    tone: 'danger',
    note: 'Vehicle condition indicates urgent repair before regular operation.',
  }
}

function getJobTypeLabel(jobType) {
  return jobType === 'General Service' ? 'Detailed Workshop Inspection' : 'Quick Service Inspection'
}

function SectionTitle({ children }) {
  return (
    <div className="mb-3 border-b border-gray-200 pb-2">
      <h4 className="text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--color-brand-dark)]">
        {children}
      </h4>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 py-2 text-sm">
      <span className="font-semibold text-[var(--color-brand-dark)]">{label}</span>
      <span className="text-gray-700">{value || '—'}</span>
    </div>
  )
}

function FindingCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
        {value || '—'}
      </p>
    </div>
  )
}

export default function InspectionReportDocument({ report }) {
  if (!report) return null

  const status = getServiceStatus(report.overallCondition)

  return (
    <div className="inspection-report-paper mx-auto w-full max-w-[820px] bg-white">
      <div className="rounded-t-[22px] bg-[var(--color-brand-dark)] px-6 py-5 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/90">
              TT Xpress Workshop
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
              Vehicle Inspection Report
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Professional service assessment and workshop recommendation summary
            </p>
          </div>

          <div className="min-w-[220px] rounded-2xl bg-white/8 p-4 backdrop-blur-sm">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/70">Report ID</span>
                <span className="font-semibold text-white">{report.reportId}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/70">Generated</span>
                <span className="font-semibold text-white">{report.generatedAt}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-white/70">Prepared By</span>
                <span className="font-semibold text-white">{report.preparedBy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 rounded-b-[22px] border border-t-0 border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              Inspection Type
            </p>
            <p className="mt-1 text-lg font-bold text-[var(--color-brand-dark)]">
              {getJobTypeLabel(report.sourceJobType)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="report-chip report-chip-red">{report.sourceJobType}</span>
            <span
              className={clsx(
                'report-chip',
                status.tone === 'success' && 'report-chip-green',
                status.tone === 'warning' && 'report-chip-amber',
                status.tone === 'danger' && 'report-chip-danger'
              )}
            >
              {status.label}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
          <p className="text-sm font-semibold text-[var(--color-brand-dark)]">
            Status Note
          </p>
          <p className="mt-1 text-sm leading-6 text-gray-700">{status.note}</p>
        </div>

        <section>
          <SectionTitle>Vehicle & Customer Details</SectionTitle>
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
            <InfoRow label="Vehicle Number" value={report.vehicleNumber} />
            <InfoRow label="Company Name" value={report.companyName} />
            <InfoRow label="Fleet Owner Name" value={report.fleetOwnerName} />
            <InfoRow label="Fleet Contact" value={report.fleetOwnerContact} />
            <InfoRow label="Inspection Date" value={report.inspectionDate} />
            <InfoRow label="Inspector Name" value={report.inspectorName} />
            <InfoRow label="Odometer Reading" value={report.odometerReading} />
            <InfoRow label="Overall Condition" value={report.overallCondition} />
          </div>
        </section>

        <section>
          <SectionTitle>Inspection Findings</SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FindingCard title="Engine / Mechanical" value={report.engineNotes} />
            <FindingCard title="Brakes" value={report.brakeNotes} />
            <FindingCard title="Battery / Electrical" value={report.batteryNotes} />
            <FindingCard title="Tyres / Wheels" value={report.tyreNotes} />
          </div>

          <div className="mt-4">
            <FindingCard title="Body / Exterior Remarks" value={report.bodyConditionNotes} />
          </div>
        </section>

        <section>
          <SectionTitle>Workshop Recommendation</SectionTitle>
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                Recommended Work
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {report.workRecommended}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-[var(--color-bg-soft)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                  Estimated Cost
                </p>
                <p className="mt-2 text-base font-bold text-[var(--color-brand-dark)]">
                  {report.estimatedCost || 'To be evaluated'}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[var(--color-bg-soft)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                  Estimated Delivery
                </p>
                <p className="mt-2 text-base font-bold text-[var(--color-brand-dark)]">
                  {report.estimatedDelivery || 'To be confirmed'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>Final Summary</SectionTitle>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {report.finalSummary}
            </p>
          </div>
        </section>

        <section>
          <SectionTitle>Approval & Sign-Off</SectionTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="signature-box">
              <p className="text-sm font-semibold text-[var(--color-brand-dark)]">
                Inspector Signature
              </p>
              <div className="mt-12 border-t border-dashed border-gray-300 pt-2 text-xs text-gray-500">
                Name / Signature
              </div>
            </div>

            <div className="signature-box">
              <p className="text-sm font-semibold text-[var(--color-brand-dark)]">
                Customer Approval
              </p>
              <div className="mt-12 border-t border-dashed border-gray-300 pt-2 text-xs text-gray-500">
                Name / Signature
              </div>
            </div>
          </div>
        </section>

        <div className="rounded-2xl bg-[var(--color-brand-dark)] px-4 py-3 text-xs leading-6 text-white/80">
          This document is a system-generated inspection report prepared for workshop review,
          service planning, and customer communication.
        </div>
      </div>
    </div>
  )
}