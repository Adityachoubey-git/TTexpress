function InfoRow({ label, value }) {
  return (
    <div className="pdfr-row">
      <div className="pdfr-row-label">{label}</div>
      <div className="pdfr-row-value">{value || '—'}</div>
    </div>
  )
}

function MiniCard({ label, value }) {
  return (
    <div className="pdfr-mini-card">
      <div className="pdfr-mini-label">{label}</div>
      <div className="pdfr-mini-value">{value || '—'}</div>
    </div>
  )
}

function FindingItem({ label, value }) {
  return (
    <div className="pdfr-finding-item">
      <div className="pdfr-finding-label">{label}</div>
      <div className="pdfr-finding-value">{value || '—'}</div>
    </div>
  )
}

function getStatus(condition) {
  if (condition === 'Good') {
    return { label: 'Serviceable', className: 'pdfr-chip-success' }
  }
  if (condition === 'Fair') {
    return { label: 'Needs Attention', className: 'pdfr-chip-warning' }
  }
  return { label: 'Repair Required', className: 'pdfr-chip-danger' }
}

export default function PdfInspectionReport({ report }) {
  if (!report) return null

  const status = getStatus(report.overallCondition)
  const general = report.generalServiceDetails

  return (
    <div className="pdfr-root">
      <div className="pdfr-topbar" />

      <div className="pdfr-body">
        <header className="pdfr-header">
          <div className="pdfr-brand-wrap">
            <div className="pdfr-brand-mark">TT</div>
            <div>
              <div className="pdfr-brand-kicker">TT XPRESS • FLEET SERVICE</div>
              <h1 className="pdfr-title">Vehicle Inspection & Service Report</h1>
              <p className="pdfr-subtitle">
                Professional workshop inspection summary for intake validation,
                service recommendation, and customer approval.
              </p>
            </div>
          </div>

          <div className="pdfr-meta-box">
            <div className="pdfr-meta-row">
              <span>Report ID</span>
              <strong>{report.reportId}</strong>
            </div>
            <div className="pdfr-meta-row">
              <span>Generated On</span>
              <strong>{report.generatedAt}</strong>
            </div>
            <div className="pdfr-meta-row">
              <span>Prepared By</span>
              <strong>{report.preparedBy || 'System Generated'}</strong>
            </div>
          </div>
        </header>

        <div className="pdfr-chip-row">
          <span className="pdfr-chip pdfr-chip-primary">{report.sourceJobType}</span>
          <span className={`pdfr-chip ${status.className}`}>{status.label}</span>
        </div>

        <div className="pdfr-grid-2">
          <section className="pdfr-panel">
            <div className="pdfr-section-title">Vehicle & Owner Details</div>
            <InfoRow label="Vehicle Number" value={report.vehicleNumber} />
            <InfoRow label="Company Name" value={report.companyName} />
            <InfoRow label="Fleet Owner" value={report.fleetOwnerName} />
            <InfoRow label="Contact" value={report.fleetOwnerContact} />
          </section>

          <section className="pdfr-panel">
            <div className="pdfr-section-title">Inspection Details</div>
            <InfoRow label="Inspection Date" value={report.inspectionDate} />
            <InfoRow label="Inspector Name" value={report.inspectorName} />
            <InfoRow label="Odometer" value={report.odometerReading} />
            <InfoRow label="Overall Condition" value={report.overallCondition} />
          </section>
        </div>

        <section className="pdfr-panel">
          <div className="pdfr-section-title">Inspection Summary</div>
          <p className="pdfr-paragraph">{report.inspectionSummary}</p>
        </section>

        <div className="pdfr-grid-2">
          <section className="pdfr-panel">
            <div className="pdfr-section-title">Recommended Work</div>
            <p className="pdfr-paragraph">{report.workRecommended}</p>
          </section>

          <section className="pdfr-panel">
            <div className="pdfr-section-title">Service Estimate</div>
            <div className="pdfr-mini-grid">
              <MiniCard
                label="Estimated Cost"
                value={report.estimatedCost || 'To be confirmed'}
              />
              <MiniCard
                label="Estimated Delivery"
                value={report.estimatedDelivery || 'To be confirmed'}
              />
            </div>
          </section>
        </div>

        {report.sourceJobType === 'General Service' && general && (
          <section className="pdfr-panel">
            <div className="pdfr-section-title">General Service Findings</div>

            <div className="pdfr-findings-grid">
              <FindingItem
                label="Exterior Body"
                value={general.exteriorBodyCondition}
              />
              <FindingItem
                label="Paint Condition"
                value={general.paintCondition}
              />
              <FindingItem
                label="Battery Health"
                value={general.batteryHealth}
              />
              <FindingItem
                label="Tyre Pressure"
                value={general.tyrePressure}
              />
            </div>

            <div className="pdfr-remark-box">
              <div className="pdfr-remark-title">Inspector Remark</div>
              <div className="pdfr-remark-text">
                {general.generalServiceRemark || 'No additional remark added.'}
              </div>
            </div>
          </section>
        )}

        <section className="pdfr-sign-grid">
          <div className="pdfr-sign-box">
            <div className="pdfr-sign-title">Inspector Signature</div>
            <div className="pdfr-sign-line" />
          </div>

          <div className="pdfr-sign-box">
            <div className="pdfr-sign-title">Customer Approval</div>
            <div className="pdfr-sign-line" />
          </div>
        </section>

        <footer className="pdfr-footer">
          TT Xpress workshop report • This is a system-generated service document
          for workshop processing and customer communication.
        </footer>
      </div>
    </div>
  )
}